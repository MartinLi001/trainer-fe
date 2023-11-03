import { useCallback, useEffect, useState } from 'react';
import styles from './index.less';
import type { ResourcesItem } from '@/pages/Task/interface';
import { getTaskInfo } from '@/services/course';
import PageHeader, { PageHeaderItemType } from '@/components/PageHeader';
import { Dropdown, Empty, Menu, message, Spin } from 'antd';
import CardTitle from '@/components/CardTitle';
import IconFont from '@/components/IconFont';
import { MoreOutlined } from '@ant-design/icons';
import LectureInformation from '../components/TaskInformation/taskInformation';
import { UploadPreview } from '@/components/PreviewBar';
import { deleteResource, ResourceAdd } from '@/services/assignment';
import type { RcFile, UploadFile } from 'antd/lib/upload';
import UpFileModal from '@/components/UpFile';
import UnlockModal from '@/pages/MyBatch/components/UnlockModal';
import EditModal from '@/pages/MyBatch/components/EditModal';
import { useRequest } from 'ahooks';
import { unlockTask, updateTask } from '@/services/batch';
import LockTaskModal from '@/components/lockTask';
import { cloneDeep } from 'lodash';

interface Props {
  taskId: string;
  pageHeaderItems: PageHeaderItemType[];
}

export default function Lecture(props: Props) {
  const { taskId, pageHeaderItems } = props;
  const [taskData, setTaskData] = useState<any>({});
  const [spinning, setSpinning] = useState(false);
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

  // 刷新接口数据
  const reloadData = useCallback(() => {
    setSpinning(true);
    getTaskInfo(taskId)
      .then((res: any) => {
        setTaskData(res);
      })
      .finally(() => setSpinning(false));
  }, [taskId]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  //#region resources
  function removeResource(file: ResourcesItem) {
    setSpinning(true);
    deleteResource({
      batchId: taskData.batchId,
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
  function editTaskOk(values: any) {
    editTaskFun({
      ...values,
      batchId: taskData.batchId,
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
      batchId: taskData.batchId,
      taskId,
    }).then(() => {
      message.success('unlock success');
      setModalVisibleKey('');
      // reloadData();
      setTaskData((oldData: any) => {
        return { ...oldData, ...values, isLocked: false };
      });
    });
  }
  //#endregion

  const informationOption = (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item>
            <span
              onClick={() => setModalVisibleKey(taskData?.isLocked ? 'unlockTask' : 'lockTask')}
            >
              {taskData?.isLocked ? 'Unlock' : 'Lock'} task
            </span>
          </Menu.Item>
          <Menu.Item>
            <span onClick={() => setModalVisibleKey('editTask')}>Edit task</span>
          </Menu.Item>
        </Menu>
      }
      placement="bottom"
      trigger={['click']}
    >
      <MoreOutlined style={{ fontSize: 24 }} />
    </Dropdown>
  );

  return (
    <Spin spinning={spinning}>
      <PageHeader
        items={[
          ...pageHeaderItems,
          {
            name: taskData.name,
          },
        ]}
      />
      <div className={styles.lectureWrapper}>
        <div className={styles.span3}>
          <CardTitle
            title="Lecture Information"
            iconFont={<IconFont type="icon-information-line" />}
            extra={informationOption}
          />
          <div className={styles.cardBox}>
            <LectureInformation data={taskData} hiddenInfo={['enableLateSubmission']} />
          </div>
        </div>
        <div className={styles.span2}>
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
          <div className={styles.cardBox}>
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
        batchId={taskData.batchId}
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
      <EditModal
        showAllFields
        loading={editLoading}
        visible={modalVisibleKey === 'editTask'}
        onClose={() => setModalVisibleKey('')}
        onOk={editTaskOk}
        data={{ ...taskData }}
      />
    </Spin>
  );
}
