import { useCallback, useEffect, useMemo, useState } from 'react';
import style from './index.less';
import PageHeader, { PageHeaderItemType } from '@/components/PageHeader';
import ProjectGrading from './Grading';
import ProjectGroups from './ProjectGroups';
import EditGroups from './EditGroups';
import { getTaskInfo } from '@/services/course';
import CardTitle from '@/components/CardTitle';
import IconFont from '@/components/IconFont';
import type { ProjectGroupMemberItem, ProjectGroupsItem, ResourcesItem } from '../interface';
import { UploadPreview } from '@/components/PreviewBar';
import { Dropdown, Empty, Menu, message, Spin } from 'antd';
import { deleteResource, ResourceAdd } from '@/services/assignment';
import ProjectInformation from '../components/TaskInformation/taskInformation';
import UpFileModal from '@/components/UpFile';
import type { RcFile, UploadFile } from 'antd/lib/upload';
import { MoreOutlined } from '@ant-design/icons';
import EditModal from '@/pages/MyBatch/components/EditModal';
import { getBatchDetails, unlockTask, updateTask } from '@/services/batch';
import { useRequest } from 'ahooks';
import UnlockModal from '@/pages/MyBatch/components/UnlockModal';
import LockTaskModal from '@/components/lockTask';
import Assignment from '../Assignment';
import AssignmentGrading from '../Assignment/components/Grading';
import { useModel, useSelector } from 'umi';
import moment from 'moment';
import { cloneDeep } from 'lodash';

interface Props {
  taskId: string;
  pageHeaderItems: PageHeaderItemType[];
}

export default function Project(props: Props) {
  const { initialState } = useModel('@@initialState');
  const { taskId, pageHeaderItems } = props;
  const [switchToAssignment, setSwitchToAssignment] = useState(false); //是否用Assignment的样子显示
  const [taskData, setTaskData] = useState<any>({});
  const [projectGroups, setProjectGroups] = useState<ProjectGroupsItem[]>([]);
  const [batchId, setBatchId] = useState('');
  const [displayContent, setDisplayContent] = useState<'detail' | 'editGroups'>('detail');
  const [spinning, setSpinning] = useState(false);
  const [allTrainees, setAllTrainees] = useState<ProjectGroupMemberItem[]>([]); // batch下所有的学员
  const [modalVisibleKey, setModalVisibleKey] = useState<
    'addResources' | 'unlockTask' | 'lockTask' | 'editTask' | ''
  >('');
  const { loading: unlockLoading, runAsync: unlockTaskFun } = useRequest(unlockTask, {
    manual: true,
  });
  const { loading: editLoading, runAsync: editTaskFun } = useRequest(updateTask, {
    manual: true,
  });
  const { loading: resourceAddLoading, runAsync: resourceAddFun } = useRequest(ResourceAdd, {
    manual: true,
  });

  const { Batch } = useSelector((state) => state) as any;
  const isBatchTrainer = useMemo(
    () => Batch?.data?.trainers?.some((i: any) => i.userId === initialState?.userId),
    [Batch],
  );

  // 判断是否有学生提交
  function isSubmitted(submissions: any) {
    return submissions?.some((i: any) => i.submittedDateTime || i.comments || i.resources);
  }

  // 刷新接口数据
  const reloadData = useCallback(() => {
    setSpinning(true);
    getTaskInfo(taskId)
      .then((res: any) => {
        if (!res?.projectGroups?.length && isSubmitted(res.submissions)) {
          setSwitchToAssignment(true);
        }
        setTaskData(res);
        setProjectGroups(res?.projectGroups);
        setBatchId(res.batchId);
      })
      .finally(() => setSpinning(false));
  }, [taskId]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);
  useEffect(() => {
    if (batchId)
      getBatchDetails(batchId).then((res) => {
        setAllTrainees(res?.trainees || []);
      });
  }, [batchId]);

  //#region resources
  function removeResource(file: ResourcesItem) {
    setSpinning(true);
    deleteResource({
      batchId,
      taskId,
      resourceId: file.resourceId,
      path: file.downloadLink,
    }).then(() => {
      message.success('delete success');
      setSpinning(false);
      // reloadData();
      setTaskData((oldData: any) => {
        const newData = cloneDeep(oldData);
        newData.resources = oldData.resources.filter((i: any) => i.resourceId !== file.resourceId);
        return newData;
      });
    });
  }
  function upLoadResources(fileList: UploadFile[]) {
    const values = {
      batchId: taskData.batchId,
      taskId: taskData.taskId,
    };
    const formData = new FormData();
    if (fileList.length) {
      fileList.forEach((file) => {
        formData.append('files', file as RcFile);
      });
    }
    formData.append('task', JSON.stringify({ ...values }));
    resourceAddFun(formData).then(() => {
      message.success('upload success');
      setModalVisibleKey('');
      reloadData();
    });
  }
  //#endregion

  //#region infomation option
  function editTask(values: any) {
    editTaskFun({
      ...values,
      batchId,
      taskId,
    }).then(() => {
      message.success('edit success');
      setModalVisibleKey('');
      // reloadData();
      setTaskData((oldData: any) => {
        return { ...oldData, ...values };
      });
    });
  }
  function unlockOk(values: any) {
    unlockTaskFun({
      ...values,
      batchId,
      taskId,
    }).then(() => {
      message.success('unlock success');
      setModalVisibleKey('');
      // reloadData();
      setTaskData((oldData: any) => {
        return {
          ...oldData,
          startDateTime: values.startDateTime,
          endDateTime: moment(values.startDateTime).add(oldData.duration, 'h'),
          isLocked: false,
        };
      });
    });
  }
  //#endregion

  //#region render
  const renderProjectDetail = () => {
    const informationOption = (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item
              onClick={() => setModalVisibleKey(taskData?.isLocked ? 'unlockTask' : 'lockTask')}
            >
              {taskData?.isLocked ? 'Unlock' : 'Lock'} task
            </Menu.Item>
            <Menu.Item onClick={() => setModalVisibleKey('editTask')}>Edit task</Menu.Item>
          </Menu>
        }
        placement="bottom"
        trigger={['click']}
        // getPopupContainer={(trigger) => trigger.parentElement || document.body}
      >
        <MoreOutlined style={{ fontSize: 24 }} />
      </Dropdown>
    );
    return (
      <Spin spinning={spinning}>
        <div className={style.detailContainer}>
          <div className={style.left}>
            <CardTitle
              title="Project Information"
              iconFont={<IconFont type="icon-information-line" />}
              extra={informationOption}
            />
            <div className={style.cardBox}>
              <ProjectInformation data={taskData} />
            </div>
          </div>
          <div className={style.right}>
            <CardTitle
              title="Project Groups"
              iconFont={<IconFont type="icon-group-line" />}
              extra={
                !!projectGroups?.length && (
                  <IconFont
                    onClick={() => setDisplayContent('editGroups')}
                    type="icon-edit-line"
                    style={{ fontSize: 24 }}
                  />
                )
              }
            />
            <div className={style.cardBox}>
              {projectGroups?.length ? (
                <ProjectGroups projectGroups={projectGroups} allTrainees={allTrainees} />
              ) : (
                <div className={style.noGroups}>
                  <div>No Group Greated Yet!</div>
                  <div
                    className={style.createGroupButton}
                    onClick={() => setDisplayContent('editGroups')}
                  >
                    + Create Project Groups
                  </div>
                </div>
              )}
            </div>
            <CardTitle
              title="Resources"
              iconFont={<IconFont type="icon-file-zip-line" />}
              extra={
                <IconFont
                  type="icon-add-line"
                  style={{ fontSize: 24 }}
                  onClick={() => setModalVisibleKey('addResources')}
                />
              }
            />
            <div className={style.cardBox}>
              {taskData?.resources ? (
                <UploadPreview
                  data={taskData.resources}
                  downIcon
                  taskId={taskId}
                  // onDown={downloadResource}
                  onRemove={removeResource}
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </div>
        </div>
        <CardTitle title="Grading" iconFont={<IconFont type="icon-draft-line" />} />
        {!!projectGroups?.length ? (
          <div className={style.cardBox}>
            <ProjectGrading
              setTaskData={setTaskData}
              setProjectGroups={setProjectGroups}
              projectGroups={projectGroups}
              taskData={taskData}
              reloadData={reloadData}
              isBatchTrainer={isBatchTrainer}
            />
          </div>
        ) : (
          <AssignmentGrading
            reload={reloadData}
            data={taskData}
            tableData={taskData.submissions || []}
            taskId={taskId}
            isBatchTrainer={isBatchTrainer}
            setData={setTaskData}
            // setTableData={(v) => setTaskData({ ...taskData, submissions: v || [] })}
          />
        )}
      </Spin>
    );
  };
  const renderEditGroups = () => {
    return (
      <EditGroups
        projectGroups={projectGroups}
        allTrainees={allTrainees}
        batchId={batchId}
        taskId={taskId}
        onBack={() => {
          setDisplayContent('detail');
        }}
        reloadData={reloadData}
      />
    );
  };
  //#endregion

  const renderProjectWrap = () => {
    return (
      <div className={style.projectWrapper}>
        <PageHeader
          items={[
            ...pageHeaderItems,
            {
              name: taskData.name,
            },
          ]}
        />
        {displayContent === 'editGroups' && renderEditGroups()}
        {displayContent === 'detail' && (
          <div className={style.paddingBox}>{renderProjectDetail()}</div>
        )}
        <UpFileModal
          visible={modalVisibleKey === 'addResources'}
          onClose={() => setModalVisibleKey('')}
          onOk={upLoadResources}
          loading={resourceAddLoading}
        />
        <UnlockModal
          visible={modalVisibleKey === 'unlockTask'}
          loading={unlockLoading}
          onClose={() => setModalVisibleKey('')}
          onOk={unlockOk}
        />
        <LockTaskModal
          batchId={batchId}
          taskId={taskId}
          visible={modalVisibleKey === 'lockTask'}
          onClose={() => setModalVisibleKey('')}
          onOk={() => {
            // reloadData();
            setTaskData((oldData: any) => {
              return { ...oldData, isLocked: true };
            });
            setModalVisibleKey('');
          }}
        />
        {modalVisibleKey === 'editTask' && ( // 或者关闭时直接不渲染就不用解构了
          <EditModal
            loading={editLoading}
            visible={modalVisibleKey === 'editTask'}
            onClose={() => setModalVisibleKey('')}
            onOk={editTask}
            // data={{ ...taskData }} // 若不解构，则第二次打开弹窗就没信息了
            data={taskData} // 或者关闭时直接不渲染就不用解构了
          />
        )}
      </div>
    );
  };

  return switchToAssignment ? (
    <Assignment taskId={taskId} pageHeaderItems={pageHeaderItems} />
  ) : (
    renderProjectWrap()
  );
}
