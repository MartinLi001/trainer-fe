import React, { useEffect, useMemo, useState } from 'react';
import { Button, message, Select } from 'antd';
import type { ProjectGroupMemberItem, ProjectGroupsItem } from '../interface';
// import { getBatchDetails } from '@/services/batch';
import style from './EditGroups.less';
import { CloseOutlined } from '@ant-design/icons';
import { updateProjectGroups } from '@/services/project';
import { useRequest } from 'ahooks';
import { cloneDeep } from 'lodash';

const { Option } = Select;

interface Props {
  projectGroups: ProjectGroupsItem[];
  allTrainees: ProjectGroupMemberItem[];
  batchId: string;
  taskId: string;
  onBack: () => void;
  reloadData: () => void;
}

export default function EditGroups(props: Props) {
  const {
    projectGroups: rawProjectGroups,
    allTrainees,
    batchId,
    taskId,
    onBack,
    reloadData,
  } = props;
  // const [allTrainees, setAllTrainees] = useState<ProjectGroupMemberItem[]>([]); // batch下所有的学员
  const [projectGroups, setProjectGroups] = useState<ProjectGroupsItem[]>([]);
  const [optionList, setOptionList] = useState<ProjectGroupMemberItem[]>([]); // 未选择的学员
  const [isTouched, setIsTouched] = useState(!!rawProjectGroups?.length); // 用户是否修改过默认分组
  // const [initLength, setInitLength] = useState<string | number | null>(); // 初始化小组数量   废弃！！  直接创建6组
  const { loading: updateProjectGroupsLoading, runAsync: updateProjectGroupsFun } = useRequest(
    updateProjectGroups,
    { manual: true },
  );
  // const { loading: getBatchDetailsLoading, runAsync: getBatchDetailsFun } = useRequest(
  //   getBatchDetails,
  //   { manual: true },
  // );
  useEffect(() => {
    if (rawProjectGroups?.length) setProjectGroups(cloneDeep(rawProjectGroups));
    else {
      const temp = [] as ProjectGroupsItem[];
      for (let i = 0; i < 6; i++) {
        temp.push({ projectGroupMembers: [] });
      }
      setProjectGroups(temp);
    }
  }, [rawProjectGroups]);
  // useEffect(() => {
  //   if (batchId)
  //     getBatchDetailsFun(batchId).then((res) => {
  //       setAllTrainees(res?.trainees || []);
  //     });
  // }, [batchId]);
  useEffect(() => {
    if (!allTrainees?.length) return;
    const temp = cloneDeep(allTrainees);
    // 找出所有未选的学员
    projectGroups.forEach((group) =>
      group.projectGroupMembers.forEach((member) => {
        const index = temp.findIndex((i: any) => i.userId === member.userId);
        if (index > -1) temp.splice(index, 1);
      }),
    );
    setOptionList(temp);
  }, [projectGroups, allTrainees]);

  function mergeName(user?: ProjectGroupMemberItem) {
    if (!user) return;
    let res = `${user.firstName || user.firstname} ${user.lastName || user.lastname}`;
    if (user.preferredName) res += ` (${user.preferredName})`;
    return res;
  }

  function findLeader(memberList: ProjectGroupMemberItem[]) {
    const temp = memberList.find((item) => item.role === 'Leader');
    return mergeName(temp);
  }

  // 初始化时将id和name都存放到select中，对应value和label，以便正常显示option中不存在的数据
  function findMembers(memberList: ProjectGroupMemberItem[]) {
    return memberList
      .filter((item) => item.role !== 'Leader')
      .map((item) => ({ value: item.userId, label: mergeName(item) }));
  }

  // leader更改时的回调
  function onChangeLeader(value: string, groupIndex: number) {
    const backupGroups = cloneDeep(projectGroups);
    const backupOptionList = cloneDeep(optionList);
    const newLeader = allTrainees.find((item) => item.userId === value);
    if (!newLeader) return;
    newLeader.role = 'Leader';
    const newGroups = [newLeader];
    projectGroups[groupIndex].projectGroupMembers.forEach((item) => {
      if (item.role === 'Leader') {
        // 将换掉的原Leader放入optionList列表中
        backupOptionList.push(item);
      } else {
        newGroups.push(item);
      }
    });
    backupGroups[groupIndex].projectGroupMembers = newGroups;
    // 将新Leader从optionList列表中去掉
    setOptionList(backupOptionList.filter((item) => item.userId !== value));
    setProjectGroups(backupGroups);
    setIsTouched(true);
  }

  // members多选更改时的回调
  function onChangeMembers(option: any[], groupIndex: number) {
    const values = option.map((optionItem) => optionItem.value); // 筛出id列表
    const backupGroups = cloneDeep(projectGroups);
    const backupOptionList = cloneDeep(optionList);
    const leaderItem = backupGroups[groupIndex].projectGroupMembers.find(
      (item) => item.role === 'Leader',
    );
    // 将删去的组员放入optionList列表中
    backupGroups[groupIndex].projectGroupMembers.forEach((memberItem) => {
      if (!values.includes(memberItem.userId) && memberItem.role !== 'Leader') {
        backupOptionList.push(memberItem);
      }
    });
    // 将已选择的trainee从optionList列表中去掉
    setOptionList(backupOptionList.filter((item) => !values.includes(item.userId)));
    // 获取选完后新的组员的完整信息
    const members: ProjectGroupMemberItem[] = [];
    if (leaderItem) members.push(leaderItem);
    allTrainees.forEach((traineeItem) => {
      if (values.includes(traineeItem.userId)) {
        traineeItem.role = 'Member';
        members.push(traineeItem);
      }
    });
    // 把对应组的组员替换成新数据
    backupGroups[groupIndex].projectGroupMembers = members;
    setProjectGroups(backupGroups);
    setIsTouched(true);
  }

  // 添加一组
  function addGroup() {
    const temp = cloneDeep(projectGroups);
    temp.push({
      projectGroupMembers: [],
    });
    setProjectGroups(temp);
    setIsTouched(true);
  }

  // 删除一组
  function deleteGroup(index: number) {
    const backupOptionList = cloneDeep(optionList);
    setOptionList(backupOptionList.concat(projectGroups[index].projectGroupMembers));
    const backupGroups = cloneDeep(projectGroups);
    backupGroups.splice(index, 1);
    setProjectGroups(backupGroups);
    setIsTouched(true);
  }

  const groupBox = (group: ProjectGroupsItem, groupIndex: number) => {
    return (
      <div className={style.groupBox} key={`${groupIndex}_${group.projectGroupId}`}>
        <div className={style.inputRow}>
          <div className={style.inputLabel}>Group Leader</div>
          <Select
            placeholder="choose leader"
            defaultValue={findLeader(group.projectGroupMembers)}
            value={findLeader(group.projectGroupMembers)}
            onChange={(value) => onChangeLeader(value, groupIndex)}
            size="large"
            // loading={getBatchDetailsLoading}
            className={style.select}
          >
            {optionList.map((item) => (
              <Option value={item.userId} key={item.userId}>
                {mergeName(item)}
              </Option>
            ))}
          </Select>
        </div>
        <div className={style.inputRow}>
          <div className={style.inputLabel}>Members</div>
          <Select
            mode="multiple"
            placeholder="choose members"
            labelInValue // 此属性是为了初始化时可以正常显示option中不存在的数据
            defaultValue={findMembers(group.projectGroupMembers)}
            value={findMembers(group.projectGroupMembers)}
            onChange={(option) => onChangeMembers(option, groupIndex)}
            size="large"
            // loading={getBatchDetailsLoading}
            className={style.select}
            // optionFilterProp="children"
            showSearch={false}
          >
            {optionList.map((item) => (
              <Option value={item.userId} key={item.userId}>
                {mergeName(item)}
              </Option>
            ))}
          </Select>
        </div>
        <div className={style.deleteButton} onClick={() => deleteGroup(groupIndex)}>
          <CloseOutlined />
        </div>
      </div>
    );
  };

  function onSave() {
    const formatGroups: any[] = [];
    for (const group of projectGroups) {
      if (group.projectGroupMembers?.length) {
        if (!group.projectGroupMembers.some((member) => member.role === 'Leader')) {
          message.error('Project group should have a leader!');
          return;
        }
        formatGroups.push({
          projectGroupId: group.projectGroupId,
          projectMembers: group.projectGroupMembers,
        });
      }
    }
    updateProjectGroupsFun({
      batchId: batchId,
      projectGroups: formatGroups,
      taskId: taskId,
    })
      .catch((err) => {
        message.error(err?.serviceStatus?.errorMessage || 'ERROR!');
      })
      .then((res) => {
        if (!res) return;
        onBack?.();
        reloadData?.();
      });
  }

  const renderTip = useMemo(() => {
    return isTouched ? (
      <span className={style.tipsRed}>
        Note: you have {optionList?.length || 0} unassigned trainees
      </span>
    ) : (
      <span className={style.tipsBlue}>6 groups by default, you can delete or add groups</span>
    );
  }, [isTouched, optionList]);

  return (
    <div className={style.wrapper}>
      {/* <div className={style.header}>
        <span className={style.inputLabel}>Enter Group Number</span>
        <InputNumber
          min={1}
          max={10}
          precision={0}
          className={style.inputNumber}
          disabled={!!projectGroups?.length}
          value={initLength}
          onChange={setInitLength}
        />
        <Button type="primary" onClick={onInit} disabled={!!projectGroups?.length}>
          Enter
        </Button>
        <div onClick={() => addGroup()} className={style.addButton}>
          + Add Group
        </div>
      </div> */}
      <div onClick={() => addGroup()} className={style.addButton}>
        + Add Group
      </div>
      {renderTip}
      <div className={style.boxContainer}>
        {projectGroups?.map((item, index) => groupBox(item, index))}
      </div>
      <div className={style.footer}>
        <Button onClick={onBack}>Cancel</Button>
        <Button
          onClick={onSave}
          disabled={!!optionList?.length}
          loading={updateProjectGroupsLoading}
          type="primary"
        >
          Save Groups
        </Button>
      </div>
    </div>
  );
}
