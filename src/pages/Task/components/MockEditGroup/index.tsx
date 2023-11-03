import { CloseOutlined, PauseOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import type { attendantsType, mockGroupsType } from '../../ShortMock/typeList';
import { getBatchDetails } from '@/services/batch';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { Button, Input, message, Select, Spin, Tooltip } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import classNames from 'classnames';
import DndComponentProvider, { DropContainer, DragCard } from '@/components/DndContainer';
import type { DragSourceMonitor } from 'react-dnd';
import { updateMockGroups, updateMockMackupGroups } from '@/services/mock';
import _ from 'lodash';

const { Option } = Select;

/*
if(attendants.length){
  if(mockGroups中已经有缺勤组) 修改缺勤组
  else 创建缺勤组 
else if(createByIndividual){
  if(mockGroups.length) 修改一对一组
  else 创建一对一组
}else{
  if(mockGroups.length) 修改普通组
  else 创建普通组
}
*/
/**
 * @param {mockGroupsType[]} mockGroups 分组信息，编辑时会用到
 * @param {string} batchId
 * @param {string} taskId
 * @param {boolean} createByIndividual 是否是一对一分组
 * @param {number} initNumber 初始化创建组的个数，创建分组时传此参数
 * @param {function(refreshFlag: boolean)=>void} onCancel 点击Cancel按钮触发的方法，接收一个参数refreshFlag，refreshFlag为true时表示分组信息更新完成，需要父组件刷新数据。
 * @param {attendantsType[]} attendants 用于筛查缺勤学生列表
 */
export interface MockEditGroupProps {
  mockGroups?: mockGroupsType[];
  batchId: string;
  taskId: string;
  createByIndividual?: boolean;
  initNumber?: number;
  onCancel: (refreshFlag?: boolean) => void;
  attendants: attendantsType[];
}
export default function MockEditGroup(props: MockEditGroupProps) {
  const {
    mockGroups: rawMockGroups,
    batchId,
    taskId,
    createByIndividual = false,
    initNumber = 1,
    onCancel = () => null,
    attendants,
  } = props;
  const [mockGroups, setMockGroups] = useState<mockGroupsType[]>([]);
  const [trainerList, setTrainerList] = useState<attendantsType[]>([]);
  const [unselectedTraineeList, setUnselectedTraineeList] = useState<attendantsType[]>([]);
  const { loading: getBatchDetailsLoading, runAsync: getBatchDetailsFun } = useRequest(
    getBatchDetails,
    { manual: true },
  );
  /** rawMockGroups中是否有缺勤组 */
  const AbsentFlag = useMemo(
    () => !!rawMockGroups?.some((item) => item.isMakeUpMockGroup),
    [rawMockGroups],
  );
  const saveFun = useMemo(() => {
    if (attendants?.length && !AbsentFlag) {
      // 创建缺勤组用post，新增数据拼接
      return updateMockMackupGroups;
    }
    // 普通组的创建编辑，一对一组的创建编辑，缺勤组的编辑用put，全量数据覆盖
    return updateMockGroups;
  }, [attendants, AbsentFlag]);
  // const saveFun = updateMockGroups;
  const { loading: updateMockGroupsLoading, runAsync: updateMockGroupsFun } = useRequest(saveFun, {
    manual: true,
  });

  useEffect(() => {
    if (batchId)
      getBatchDetailsFun(batchId).then((res) => {
        const trainers: attendantsType[] = res?.trainers || [];
        setTrainerList(trainers);
        if (attendants?.length) {
          // 缺勤组相关流程
          if (AbsentFlag) {
            // 修改缺勤组的流程
            // 修改缺勤组时不仅需要给接口缺勤组数据，还需要携带正常组数据，所以全部数据都要保留，显示时再筛吧
            setMockGroups(rawMockGroups || []);
            setUnselectedTraineeList(attendants?.filter((i) => i.status === 'Absent'));
          } else {
            // 创建缺勤组的流程
            // 创建缺勤组时只需要给刚刚创建的缺勤组，无需携带正常组
            // const groups = cloneDeep(rawMockGroups) || [];
            // groups?.push({
            //   host: {} as attendantsType,
            //   trainees: [],
            //   isMakeUpMockGroup: true,
            // });
            // setMockGroups(groups);
            setMockGroups([
              {
                host: {} as attendantsType,
                trainees: [],
                isMakeUpMockGroup: true,
              },
            ]);
            setUnselectedTraineeList(attendants?.filter((i) => i.status === 'Absent'));
          }
        } else {
          // 非缺勤组相关流程
          const allTrainees: attendantsType[] = res.trainees || [];
          if (rawMockGroups) {
            // 无论是不是一对一组，只要传入分组信息，都是edit的情况
            let formatGroups: mockGroupsType[] = [];
            if (createByIndividual) {
              // 编辑一对一组
              const hostMap = {}; // record<hostId, 常规group数据>，用于把相同host的组合并成一个组
              const hostMapOrder: string[] = [];
              rawMockGroups.forEach((group) => {
                if (hostMapOrder.every((i) => i != (group.host as attendantsType).userId)) {
                  if ((group.host as attendantsType).userId) {
                    hostMapOrder.push((group.host as attendantsType).userId);
                  }
                }
                hostMap[(group.host as attendantsType).userId] = {
                  ...group, // 目前来开只需要host，meetingLink，但是...反正都是一大坨扔过去，还差这点数据吗，万一以后还有用呢
                  trainees: hostMap[(group.host as attendantsType).userId]?.trainees || [],
                };
                hostMap[(group.host as attendantsType).userId].trainees.push({
                  ...group.trainees?.[0],
                  extra: { ...group },
                });
              });
              formatGroups = hostMapOrder.map((i) => hostMap[i]);
            } else {
              // 编辑普通组
              formatGroups = rawMockGroups;
            }
            setMockGroups(formatGroups);
            // 筛出新增的无分组学员
            formatGroups.forEach((group) => {
              group.trainees.forEach((trainee) => {
                const index = allTrainees.findIndex((i: any) => i.userId === trainee.userId);
                if (index > -1) allTrainees.splice(index, 1);
              });
            });
            setUnselectedTraineeList(allTrainees);
          } else {
            // 创建分组流程，创建一对一分组和常规分组只有初始化小组数量不同
            // 需要初始化小组的数量,一对一创建讲师数量相同的小组数，常规分组创建传入的initNumber数
            setUnselectedTraineeList([]);
            let groupNumber = 0;
            groupNumber = createByIndividual ? trainers.length : initNumber;
            // 初始化空组
            const groups: mockGroupsType[] = [];
            for (let index = 0; index < groupNumber; index++) {
              groups.push({
                host: {} as attendantsType,
                trainees: [],
              });
            }
            // 自动分配讲师和学员
            for (let index = 0; index < groupNumber; index++) {
              groups[index % groupNumber].host = trainers[index % trainers.length];
            }
            for (let index = 0; index < allTrainees.length; index++) {
              groups[index % groupNumber].trainees!.push(allTrainees[index]);
            }
            setMockGroups(groups);
          }
        }
      });
    // }, [batchId]);
  }, [batchId, attendants, getBatchDetailsFun, initNumber, createByIndividual, rawMockGroups]);

  function mergeName(user?: attendantsType) {
    if (!user) return;
    return [user.firstName || user.firstname, user.lastName || user.lastname].join(' ');
  }

  /** 是否不可点击保存按钮，为true时save groups按钮变为disabled */
  const notSavable = useMemo(() => {
    /** 操作缺勤组时不检查普通组，操作普通组时不检查缺勤组 */
    const filterGroups = mockGroups.filter((i) => !!i.isMakeUpMockGroup === !!attendants?.length);
    /** 检查是否有组中host相同，有相同host则不可保存 */
    function checkDuplicateHost() {
      const check = {};
      // 正常组/缺勤组，互不影响此处的判断
      return filterGroups.some((i) => {
        const visited = check[(i?.host as attendantsType)?.userId];
        check[(i?.host as attendantsType)?.userId] = true;
        return visited;
      });
    }
    /** 检查是否有组中没选host，或没选trainee，mockGroup中有未选择讲师或未选择学员的组，那就disabled */
    function checkIncompleteGroup() {
      return filterGroups.some(
        (group) => !Object.keys(group.host)?.length || !group.trainees?.length,
      );
    }
    /**
     * 检查未选择学员unselectedTraineeList
     * attendants列表长度不为0，即当前为缺勤组流程，那么无论是否选完所有学生，都不检查disabled状态，若长度为0，则只有选完所有学生才可点击保存
     */
    function checkUnselectedTraineeList() {
      return attendants?.length ? false : !!unselectedTraineeList?.length;
    }
    // console.log('ssss-notSavable', checkDuplicateHost(), checkIncompleteGroup(), checkUnselectedTraineeList());
    return (
      !filterGroups.length ||
      checkDuplicateHost() ||
      checkIncompleteGroup() ||
      checkUnselectedTraineeList()
    );
  }, [attendants, unselectedTraineeList, mockGroups]);

  function addGroup() {
    const groups = _.cloneDeep(mockGroups);
    groups.push({
      host: {} as attendantsType,
      trainees: [],
      meetingLink: '',
      isMakeUpMockGroup: !!attendants?.length,
    });
    setMockGroups(groups);
  }
  function deleteGroup(index: number) {
    const unselected = _.cloneDeep(unselectedTraineeList);
    const deleteTrainees = mockGroups[index].trainees;
    if (deleteTrainees?.length) setUnselectedTraineeList(unselected.concat(deleteTrainees));
    const groups = _.cloneDeep(mockGroups);
    groups.splice(index, 1);
    setMockGroups(groups);
  }
  function saveGroups() {
    interface Extra extends attendantsType {
      extra?: any;
    }
    let formatGroups: mockGroupsType[] = [];
    if (createByIndividual && rawMockGroups?.length) {
      // 编辑一对一组走这一套，要把合并好的组再拆分成一对一格式
      mockGroups.forEach((hostMap) => {
        hostMap.trainees.forEach((trainee: Extra) => {
          formatGroups.push({
            ...trainee.extra,
            status: trainee.extra?.status ?? 'Created',
            host: (hostMap.host as attendantsType).userId,
            meetingLink: hostMap.meetingLink,
            traineeIds: [trainee.userId],
          });
        });
      });
    } else {
      // 普通组的创建编辑，缺勤组的创建编辑，一对一的创建走这一套
      formatGroups = mockGroups.map((group) => {
        return {
          ...group,
          host: (group.host as attendantsType)?.userId,
          status: group.status ?? 'Created',
          traineeIds: group.trainees?.map((trainee) => trainee.userId),
        };
      });
    }
    // console.log('sssssss-sssave', formatGroups);
    updateMockGroupsFun({
      batchId,
      taskId,
      isOneOnOne: createByIndividual,
      mockGroups: formatGroups,
    })
      .catch((err) => {
        message.error(err?.serviceStatus?.errorMessage || 'ERROR!');
      })
      .then((res) => {
        if (!res) return;
        onCancel(true);
      });
  }

  const traineeCard = (trainee: attendantsType) => {
    return (
      <>
        <PauseOutlined rotate={90} />
        {`  ${trainee.firstName || trainee.firstname} ${(
          trainee.lastName || trainee.lastname
        )?.slice(0, 1)}.`}
      </>
    );
  };

  function dragOverGroup(dragItem: attendantsType, groupIndex: number) {
    if (mockGroups[groupIndex].trainees?.includes(dragItem)) return;
    const groups = _.cloneDeep(mockGroups);
    groups.forEach((group) => {
      if (!group.trainees) return;
      const tempIndex = group.trainees.findIndex((trainee) => trainee.userId === dragItem.userId);
      if (tempIndex > -1) {
        group.trainees.splice(tempIndex, 1);
      }
    });
    if (!groups[groupIndex].trainees?.includes(dragItem))
      groups[groupIndex].trainees?.push(dragItem);
    setMockGroups(groups);
  }
  function dropUnselectedTrainee(index: number, monitor: DragSourceMonitor) {
    if (monitor.didDrop()) {
      const unselected = _.cloneDeep(unselectedTraineeList);
      unselected.splice(index, 1);
      setUnselectedTraineeList(unselected);
    }
  }
  function changeMeetingLink(value: string, groupIndex: number) {
    const groups = _.cloneDeep(mockGroups);
    groups[groupIndex].meetingLink = value;
    setMockGroups(groups);
  }

  const renderGroupBox = (group: mockGroupsType, groupIndex: number) => {
    function onChangeTrainer(option: DefaultOptionType, index: number) {
      const _list = _.cloneDeep(mockGroups);
      _list[index].host = option.label as attendantsType;
      setMockGroups(_list);
    }
    return (
      !!attendants?.length === !!group.isMakeUpMockGroup && (
        <DropContainer
          hover={(item) => dragOverGroup(item, groupIndex)}
          className={styles.groupBox}
          key={(group.mockGroupId || groupIndex) + 'group'}
        >
          {/* <div className={styles.groupBox} key={group.mockGroupId + 'group'}> */}
          <div className={styles.trainer}>
            <span className={styles.label}>Trainer</span>
            <Select
              placeholder="choose leader"
              defaultValue={(group.host as attendantsType)?.userId}
              value={(group.host as attendantsType)?.userId}
              onChange={(v, option) => onChangeTrainer(option as DefaultOptionType, groupIndex)}
              size="large"
              loading={getBatchDetailsLoading}
              className={styles.select}
            >
              {trainerList.map((item) => (
                <Option key={item.userId + 'trainer'} value={item.userId} label={item}>
                  {mergeName(item)}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.label}>Trainee</div>
          <div className={styles.trainees}>
            {group.trainees?.map((item) => (
              <DragCard item={item} className={styles.traineeCard} key={item.userId + 'trainee'}>
                <Tooltip title={mergeName(item)} mouseEnterDelay={0.5}>
                  {traineeCard(item)}
                </Tooltip>
              </DragCard>
            ))}
          </div>
          <div className={styles.zoom}>
            <span className={styles.label}>Zoom</span>
            <Input
              value={group.meetingLink}
              onChange={(e) => changeMeetingLink(e.target.value, groupIndex)}
              size="large"
              className={styles.input}
            />
          </div>
          <div className={styles.deleteButton} onClick={() => deleteGroup(groupIndex)}>
            <CloseOutlined />
          </div>
          {/* </div> */}
        </DropContainer>
      )
    );
  };

  return (
    <Spin spinning={getBatchDetailsLoading}>
      <div className={styles.wrapper}>
        <div className={styles.addButton} onClick={addGroup}>
          + Add Group
        </div>
        {unselectedTraineeList?.length > 0 && (
          <span className={styles.tipText}>Drag & Drop trainees between groups</span>
        )}
        <DndComponentProvider>
          {unselectedTraineeList?.length > 0 && (
            <div className={styles.unselectedList}>
              <div className={styles.title}>Unselected Trainee(s)</div>
              {unselectedTraineeList.map((item, index) => (
                <Tooltip
                  title={mergeName(item)}
                  key={item.userId + 'unselected'}
                  mouseEnterDelay={0.5}
                >
                  <DragCard
                    className={classNames(styles.traineeCard, styles.unselected)}
                    item={item}
                    end={(i, monitor) => dropUnselectedTrainee(index, monitor)}
                  >
                    {traineeCard(item)}
                  </DragCard>
                </Tooltip>
              ))}
            </div>
          )}
          <div className={styles.groupContainer}>
            {mockGroups.map((item, index) => renderGroupBox(item, index))}
          </div>
        </DndComponentProvider>
        <div className={styles.footer}>
          <Button onClick={() => onCancel()}>Cancel</Button>
          <Button
            onClick={saveGroups}
            disabled={notSavable}
            loading={updateMockGroupsLoading}
            type="primary"
          >
            Save Groups
          </Button>
        </div>
      </div>
    </Spin>
  );
}
