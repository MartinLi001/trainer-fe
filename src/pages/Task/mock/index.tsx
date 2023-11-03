import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import { TaskResponse } from '@/pages/Task/mock/typeList';
import PageHeader from '@/components/PageHeader';
import CardTitle from '@/components/CardTitle';
import IconFont from '@/components/IconFont';
import { date2desc } from '@/utils';
import { Dropdown, Menu, message, Spin } from 'antd';
import { updateTask, unlockTask, reopenList } from '@/services/batch';
import { MoreOutlined } from '@ant-design/icons';
import EditModal from '@/pages/MyBatch/components/EditModal';
import UnlockModal from '@/pages/MyBatch/components/UnlockModal';
import { useRequest } from 'ahooks';
import {
  MockModelState,
  ConnectProps,
  Loading,
  connect,
  Dispatch,
  BatchState,
  useLocation,
} from 'umi';
import SeeButton from '@/components/SeeButton';
import { history } from 'umi';
import ReOpenModal from './components/reOpenlistModal';
import CodingMockSummary from '../components/CodingMockSummary';
import QuestionList from '../ShortMock/questionList';
import LockTaskModal from '@/components/lockTask';

interface ShortMockProps extends ConnectProps {
  taskId: string;
  type?: string;
  loading: boolean;
  batchData: API.AllBatchType;
  data: TaskResponse;
  dispatch: Dispatch;
}

export enum EnumMockStatus {
  Created = 'Created',
  Inprogress = 'In progress',
  Ended = 'Ended',
  Graded = 'Graded',
}

const ShortMockPage: React.FC<ShortMockProps> = ({
  data,
  batchData,
  taskId,
  dispatch,
  loading,
}) => {
  // const [data, setData] = useState<TaskResponse>({} as TaskResponse);
  const { pathname } = useLocation();
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [reopenVisible, setReopenVisible] = useState<boolean>(false);
  const [unlockModalVisible, setUnlockModalVisible] = useState<boolean>(false);
  const [lockModalVisible, setLockModalVisible] = useState<boolean>(false);
  const { loading: unlockLoading, runAsync: unlockTaskFun } = useRequest(unlockTask, {
    manual: true,
  });

  const { loading: reopenLoading, runAsync: reOpenlistApi } = useRequest(reopenList, {
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
  const renderLink = (link: string) => {
    if (link.trim()) {
      return (
        <a target="_blank" href={link}>
          {link}
        </a>
      );
    }
    return <span className={styles.noLink}>N/A</span>;
  };

  const editDataSub = (values: any) => {
    if (values.endDateTime) {
      values.endDateTime = values.endDateTime.format();
    }
    if (values.startDateTime) {
      values.startDateTime = values.startDateTime.format();
    }
    const submitData = {
      ...values,
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
    if (type == 'Repenning') {
      setReopenVisible(true);
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

    if (data.status == 'Graded') {
      menuItems.unshift({
        label: 'Manage Repenning',
        key: 'Repenning',
      });
    }
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

  const goDetailPage = () => {
    if (data.isLocked) {
      message.error('You need to unlock this mock first');
      return;
    }
    if (!Object.values(data.questions ?? {})?.length) {
      message.error('You need add mock questions');
      return;
    }

    const temp = JSON.parse(localStorage.getItem('pageHeaderItems') ?? '[]');
    localStorage.setItem(
      'pageHeaderItems',
      JSON.stringify([
        ...temp,
        {
          name: data?.name,
          href: pathname,
        },
      ]),
    );

    const isMybatch = pathname.startsWith('/myBatch');
    history.push(`${isMybatch ? '/myBatch' : '/Category/Batches'}/CodingMock/details`);
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
      <div className={styles.codingMock}>
        <div className={styles.codingMockTop}>
          <div className={styles.codingMockTopLeft}>
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
            <div className={styles.codingMockTopLeftContent}>
              <div className={styles.showLeft}>
                {renderTag(`${'Mock'} Title`, data.name)}
                {renderLine('Day', data.priority, '#F3FAFF', '#1D355E')}
                {renderLine('Start Date', date2desc(data.startDateTime), '#F3FAFF', '#1D355E')}
                {renderLine('End Date', date2desc(data.endDateTime), '#F3FAFF', '#1D355E')}
                {renderTag('Description', data.description)}
              </div>
              <div className={styles.showRight}>
                {data.status == 'Created' && (
                  <div className={styles.textLine}>
                    <div className={styles.Created}>Mock Not Started Yet</div>
                  </div>
                )}
                {data.status == 'In progress' && (
                  <div className={styles.textLine}>
                    <div className={styles.inProgress}>Mock In Progress</div>
                  </div>
                )}
                {data.status == 'Graded' && (
                  <div className={styles.textLine}>
                    <div className={styles.Graded}>Mock Finished</div>
                  </div>
                )}
                <div className={styles.textBlock}>
                  <div className={styles.title}> Meeting Link</div>
                  {renderLink(data.meetingLink || '')}
                </div>
                <SeeButton
                  className={styles.enterButton}
                  type="primary"
                  // disabled={data?.questionOrders?.length == 0}
                  onClick={() => goDetailPage()}
                >
                  Enter Coding Mock Group
                </SeeButton>
              </div>
            </div>
          </div>
          <div
            className={styles.codingMockTopRight}
            style={{ maxWidth: !data.mockGroups ? 420 : data.isOneOnOne ? 616 : 570 }}
          ></div>
        </div>

        {data?.mockSummary?.length > 0 && (
          <div className={styles.panel}>
            <CardTitle
              title="Mock Summary"
              iconFont={<IconFont type="icon-question-answer-line" />}
            />
            <div className={styles.card}>
              <CodingMockSummary summary={data.mockSummary} />
            </div>
          </div>
        )}

        <div className={styles.panel}>
          <CardTitle
            title="Mock Questions"
            iconFont={<IconFont type="icon-question-answer-line" />}
          />
          <div className={styles.card}>
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
            showAllFields
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
        {reopenVisible && (
          <ReOpenModal
            peopleList={batchData}
            visible={reopenVisible}
            openList={data.reopenList}
            onClose={() => {
              setReopenVisible(false);
            }}
            loading={reopenLoading}
            onOk={(values: string[]) => {
              const reopenSubmit = {
                addList: values.filter((ite) => {
                  return !data.reopenList.includes(ite);
                }),
                removeList: data.reopenList.filter((ite) => {
                  return !values.includes(ite);
                }),
              };
              dispatch({
                type: 'Mock/updateData',
                payload: { ...data, reopenList: values },
              });
              reOpenlistApi({
                ...reopenSubmit,
                batchId: data.batchId,
                taskId: data.taskId,
              }).then(() => {
                message.success('reopen success');
                setReopenVisible(false);
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

export default connect(
  ({ Mock, Batch, loading }: { Mock: MockModelState; Batch: BatchState; loading: Loading }) => ({
    data: Mock.data,
    batchData: Batch.data,
    loading: loading.models.Mock,
  }),
)(ShortMockPage);
