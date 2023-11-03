import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import { TaskResponse } from '@/pages/Task/mock/typeList';
import PageHeader, { PageHeaderItemType } from '@/components/PageHeader';
import CardTitle from '@/components/CardTitle';
import IconFont from '@/components/IconFont';
import { date2desc } from '@/utils';
import { Dropdown, Menu, message, Spin } from 'antd';
import { updateTask, unlockTask } from '@/services/batch';
import { MoreOutlined } from '@ant-design/icons';
// import SeeButton from '@/components/SeeButton';
import EditModal from '@/pages/MyBatch/components/EditModal';
import UnlockModal from '@/pages/MyBatch/components/UnlockModal';
import MockGroup from './MockGroup';
import MockSummary from './MockSummary';
import { useRequest } from 'ahooks';
import MockEditGroup, { MockEditGroupProps } from '@/pages/Task/components/MockEditGroup';
import { MockModelState, ConnectProps, Loading, connect, Dispatch } from 'umi';
import QuestionList from './questionList';
import LockTaskModal from '@/components/lockTask';
interface ShortMockProps extends ConnectProps {
  taskId: string;
  type?: string;
  loading: boolean;
  data: TaskResponse;
  dispatch: Dispatch;
  pageHeaderItems: PageHeaderItemType[];
}

export enum EnumMockStatus {
  Created = 'Created',
  Inprogress = 'In progress',
  Ended = 'Ended',
  Graded = 'Graded',
}

const ShortMockPage: React.FC<ShortMockProps> = ({ data, taskId, dispatch, loading }) => {
  // const [data, setData] = useState<TaskResponse>({} as TaskResponse);
  // const [loading, setLoading] = useState(false);

  const [lockModalVisible, setLockModalVisible] = useState<boolean>(false);

  // const { pathname } = useLocation();

  const [editGroupPageConfig, setEditGroupPageConfig] = useState<{
    show: boolean;
    data: Partial<MockEditGroupProps>;
  }>({
    show: false,
    data: {},
  });

  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [unlockModalVisible, setUnlockModalVisible] = useState<boolean>(false);
  const { loading: unlockLoading, runAsync: unlockTaskFun } = useRequest(unlockTask, {
    manual: true,
  });
  const getMockData = () => {
    dispatch({
      type: 'Mock/getTaskDetail',
      payload: taskId,
    });
  };
  useEffect(() => {
    getMockData();
  }, []);

  const renderTag = (title: string, value: string) => {
    if (!title || !value) return;
    return (
      <div className={styles.textBlock}>
        <div className={styles.title}> {title}</div>
        <div className={styles.value}>{value}</div>
      </div>
    );
  };

  const renderLine = (
    title: string,
    value: string | number,
    backColor?: string,
    color?: string,
  ) => {
    if (!title || !value) return;
    return (
      <div className={styles.textLine}>
        <div className={styles.title}> {title}</div>
        <div
          className={styles.value}
          style={{ backgroundColor: backColor || '#FFF', color: color }}
        >
          {value}
        </div>
      </div>
    );
  };

  const editDataSub = (values: any) => {
    console.log('%cindex.tsx line:340 values', 'color: #007acc;', values);
    if (values.endDateTime) {
      values.endDateTime = values.endDateTime.format();
    }
    if (values.startDateTime) {
      values.startDateTime = values.startDateTime.format();
    }
    const submitData = {
      ...values,
      attendants: data.attendants,
      batchId: data.batchId,
      taskId: data.taskId,
    };

    updateTask(submitData).then(() => {
      message.success('update success');
      // getMockData();
      dispatch({
        type: 'Mock/updateData',
        payload: { ...data, ...values },
      });
      setEditModalVisible(false);
    });
  };
  const menuClick = (type: string) => {
    if (type == 'edit') {
      setEditModalVisible(true);
    }
    if (type == 'unlock') {
      setUnlockModalVisible(true);
    }
    if (type == 'lock') {
      setLockModalVisible(true);
    }
  };
  const renderMenu = () => {
    const menuItems = [
      {
        label: 'Edit Task',
        key: 'edit',
      },
    ];

    if (data.isLocked) {
      menuItems.unshift({
        label: 'Unlock Task',
        key: 'unlock',
      });
    }
    if (!data.isLocked) {
      menuItems.unshift({
        label: 'Lock Task',
        key: 'lock',
      });
    }
    return <Menu onClick={(e) => menuClick(e.key)} items={menuItems} />;
  };

  const pageHeaderData = useMemo(() => {
    const temp = JSON.parse(localStorage.getItem('pageHeaderItems') ?? '[]');
    const result = temp.slice(0, temp.length > 2 ? 3 : 1);
    localStorage.setItem('pageHeaderItems', JSON.stringify(result));
    return result;
  }, [data.name]);

  return (
    <Spin spinning={loading}>
      <PageHeader
        items={[
          ...pageHeaderData,
          {
            name: data.name,
          },
        ]}
      />
      <div className="abc" style={{ display: editGroupPageConfig.show ? 'block' : 'none' }}>
        <MockEditGroup
          {...(editGroupPageConfig?.data as MockEditGroupProps)}
          onCancel={(refreshFlag) => {
            setEditGroupPageConfig({
              show: false,
              data: {},
            });
            if (refreshFlag) getMockData();
          }}
        />
      </div>
      <div
        className={styles.shortAnswerMock}
        style={{ display: editGroupPageConfig.show ? 'none' : 'block' }}
      >
        <div className={styles.shortAnswerMockTop}>
          <div className={styles.shortAnswerMockTopLeft}>
            <CardTitle
              title={`${data?.type || 'ShortMock'} Information`}
              iconFont={<IconFont type="icon-information-line" />}
              extra={
                <Dropdown overlay={renderMenu()} trigger={['click']}>
                  <span style={{ marginLeft: 20 }} onClick={(e) => e.preventDefault()}>
                    <MoreOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
                  </span>
                </Dropdown>
              }
            />
            <div className={styles.shortAnswerMockTopLeftContent}>
              {renderTag(`${'Mock'} Title`, data.name)}
              {renderLine('Day', data.priority, '#F3FAFF', '#1D355E')}
              {renderLine('Start Date', date2desc(data.startDateTime), '#F3FAFF', '#1D355E')}
              {renderLine('End Date', date2desc(data.endDateTime), '#F3FAFF', '#1D355E')}
              {renderTag('Description', data.description)}
            </div>
          </div>
          <div
            className={styles.shortAnswerMockTopRight}
            style={{ maxWidth: !data.mockGroups ? 420 : data.isOneOnOne ? '' : 570 }}
          >
            <MockGroup
              show={editGroupPageConfig.show}
              data={data}
              refresh={getMockData}
              onMockGroupAction={setEditGroupPageConfig}
            />
          </div>
        </div>
        {data?.mockSummary &&
        Object.values(data.mockSummary).some((item: any) => Object.values(item).length > 0) ? (
          <div className={styles.shortAnswerMockSummary}>
            <CardTitle
              title="Mock Summary"
              iconFont={<IconFont type="icon-question-answer-line" />}
            />
            <div className={styles.shortAnswerMockSummaryContent}>
              <MockSummary data={data} />
            </div>
          </div>
        ) : null}
        <div className={styles.shortAnswerMockTable}>
          <CardTitle
            title="Mock Questions"
            iconFont={<IconFont type="icon-question-answer-line" />}
          />
          <div className={styles.shortAnswerMockTableContent}>
            <QuestionList
            // questionOrders={data.questionOrders}
            // questions={data.questions}
            // batchId={data.batchId}
            // taskId={data.taskId}
            // data={data}
            />
          </div>
        </div>
        {editModalVisible && (
          <EditModal
            data={data}
            visible={editModalVisible}
            onClose={() => {
              setEditModalVisible(false);
            }}
            onOk={editDataSub}
          />
        )}
        {unlockModalVisible && (
          <UnlockModal
            visible={unlockModalVisible}
            loading={unlockLoading}
            onClose={() => {
              setUnlockModalVisible(false);
            }}
            onOk={(values) => {
              dispatch({
                type: 'Mock/updateData',
                payload: {
                  ...data,
                  startDateTime: values.startDateTime,
                  isLocked: false,
                },
              });
              unlockTaskFun({
                ...values,
                batchId: data.batchId,
                taskId: data.taskId,
              }).then(() => {
                message.success('unlock success');
                setUnlockModalVisible(false);
                // getMockData();
              });
            }}
          />
        )}
        {lockModalVisible && (
          <LockTaskModal
            batchId={data.batchId}
            taskId={data.taskId}
            visible={lockModalVisible}
            onClose={() => {
              setLockModalVisible(false);
            }}
            onOk={() => {
              // getMockData();
              dispatch({
                type: 'Mock/updateData',
                payload: { ...data, isLocked: true },
              });
              setLockModalVisible(false);
            }}
          />
        )}
      </div>
    </Spin>
  );
};

export default connect(({ Mock, loading }: { Mock: MockModelState; loading: Loading }) => ({
  ...Mock,
  loading: loading.models.Mock,
}))(ShortMockPage);
