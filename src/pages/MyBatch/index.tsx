import moment from 'moment';
import { connect, ConnectProps, history, Loading, useLocation, Dispatch } from 'umi';
import { Dropdown, Menu, message, Spin } from 'antd';
import { useRequest, useUpdateEffect } from 'ahooks';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import People from '../People';
import Tabs from './components/Tabs';
import TaskList from '@/components/CourseList';
import SeeButton from '@/components/SeeButton';
import PageHeader, { PageHeaderItemType } from '@/components/PageHeader';
import SeeSelect from '@/components/SeeSelect';
import LockTaskModal from '@/components/lockTask';
import CreateModal from './components/CreateModal';
import EditModal from './components/EditModal';
import UnlockModal from './components/UnlockModal';
import DeleteModal from './components/DeleteModal';
import CopyBatchModal from './components/CopyBatchModal';

import Tips from '@/pages/Kpi/components/tips';

import {
  getMyBatches,
  deleteTask,
  unlockTask,
  addTask,
  updateTask,
  batchCopy,
} from '@/services/batch';

import styles from './index.less';
import Kpi from '../Kpi';
const { Option } = SeeSelect;

export interface ComPropsType {
  data: API.TaskType[] | API.AllBatchType;
  sort?: string;
  callBack?: (batchId: string) => void;
}

interface MyBatchProps extends ConnectProps {
  loading: boolean;
  data: API.AllBatchType;
  dispatch: Dispatch;
}

function MyBatch({ dispatch, data: batchDetailData, loading: getDetailLoading }: MyBatchProps) {
  const {
    query: { batchId, type, categoryName, fromAllBatch },
    pathname,
  } = useLocation() as any;

  // const [pageTitle, setPageTitle] = useState<string[]>([]);
  const [selectKey, setSelectKey] = useState('all');
  const [sortKey, setSortKey] = useState('default');

  const [selectBatchId, setSelectBatchId] = useState(batchId);
  const [copyBatchModalVisible, setCopyBatchModalVisible] = useState(false);
  const [actionSelectKey, setActionSelectKey] = useState('');
  const [editData, setEditData] = useState<API.TaskType>({} as API.TaskType);
  const [TipsType, setTipsType] = useState<'mock' | 'overall'>('overall');

  const {
    loading,
    data: batchList,
    runAsync: getMyBatchFun,
  } = useRequest(getMyBatches, {
    manual: true,
  });

  const [rightLoading, setRightLoading] = useState(true);

  useEffect(() => {
    setRightLoading(!!(loading || getDetailLoading));
  }, [loading, getDetailLoading]);

  const getBatchDetailsFun = (currentBatchId: string) => {
    dispatch({
      type: 'Batch/getBatchDetail',
      payload: currentBatchId,
    });
  };

  const { loading: copyBatchLoading, runAsync: batchCopyFun } = useRequest(batchCopy, {
    manual: true,
    onSuccess() {
      setCopyBatchModalVisible(false);
      message.success('copy batch success');
      getBatchDetailsFun(selectBatchId);
    },
    onError(error: any) {
      if (error.fieldErrors?.startDate) {
        message.error(error.fieldErrors?.startDate);
      }
    },
  });

  const { loading: delLoading, runAsync: deleteTaskFun } = useRequest(deleteTask, {
    manual: true,
  });

  const { loading: unlockLoading, runAsync: unlockTaskFun } = useRequest(unlockTask, {
    manual: true,
  });

  const { loading: addLoading, runAsync: addTaskFun } = useRequest(addTask, {
    manual: true,
  });

  const { loading: editLoading, runAsync: editTaskFun } = useRequest(updateTask, {
    manual: true,
  });

  const onClick = ({ key, domEvent }: { key: string; domEvent: any }, data: API.TaskType) => {
    domEvent.stopPropagation();
    setEditData({
      ...data,
    });
    setActionSelectKey(key);
  };

  const onChange = useCallback((item) => {
    const isMybatch = pathname.startsWith('/myBatch');
    const currentQuery = history.location.query || {};
    currentQuery.type = item.key;

    history.push({
      pathname: isMybatch ? '/myBatch' : '/Category/Batches/tasks',
      query: currentQuery,
      // query: {
      //   type: item.key,
      //   categoryName,
      //   fromAllBatch,
      //   ...(batchId ? { batchId } : {}),
      // },
    });
  }, []);

  const renderMenu = (data: API.TaskType) => {
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
    } else {
      menuItems.unshift({
        label: 'Lock Task',
        key: 'locked',
      });
    }

    if (data.isLocked || moment(data.startDateTime) > moment()) {
      menuItems.push({
        label: 'Delete Task',
        key: 'delete',
      });
    }

    return (
      <Menu
        onClick={(e) => {
          onClick(e, data);
        }}
        items={menuItems}
      />
    );
  };

  const renderExtra = (data: API.TaskType): React.ReactElement => {
    return (
      <Dropdown
        overlay={renderMenu(data)}
        trigger={['click']}
        getPopupContainer={(e) => e.parentNode as HTMLElement}
      >
        <span style={{ margin: '0 20px' }} onClick={(e) => e.stopPropagation()}>
          <MoreOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
        </span>
      </Dropdown>
    );
  };

  function onChangeSelectBatchId(id: any) {
    // 需要更新url中的batchId
    const currentQuery = history.location.query || {};
    currentQuery.batchId = id;
    const search = Object.entries(currentQuery)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    history.replace(pathname + '?' + search);
    setSelectBatchId(id);
  }

  const renderSelect = () => {
    if (fromAllBatch) return null;
    const batchIds = batchList?.batchIds;
    if (!batchIds?.length) return null;
    return (
      <SeeSelect
        style={{ width: 215, marginTop: 15 }}
        placeholder="Select Batch"
        onChange={onChangeSelectBatchId}
        value="Select Batch"
      >
        {batchIds?.map((batch: { batchId: string; name: string }) => (
          <Option key={batch.batchId} value={batch.batchId}>
            {batch.name}
          </Option>
        ))}
      </SeeSelect>
    );
  };

  const defaultComponent = ({ data, sort }: ComPropsType) => (
    <TaskList data={data as API.TaskType[]} sort={sort} extra={renderExtra} />
  );

  const typeConfigList = [
    {
      key: 'all',
      label: 'All Task',
      pageTitle: 'All Task',
      component: defaultComponent,
    },
    {
      key: 'Lecture',
      label: 'Lecture',
      pageTitle: 'Lecture List',
      component: defaultComponent,
    },
    {
      key: 'Assignment',
      label: 'Assignment',
      pageTitle: 'Assignment List',
      component: defaultComponent,
    },
    {
      key: 'Mock',
      label: 'Mock',
      pageTitle: 'Mock List',
      values: ['ShortAnswerMock', 'CodingMock'],
      component: defaultComponent,
    },
    {
      key: 'Project',
      label: 'Project',
      pageTitle: 'Project List',
      component: defaultComponent,
    },
    {
      key: 'KPI',
      label: 'KPI',
      pageTitle: 'KPI List',
      component: () => <Kpi batchId={selectBatchId} setTipsType={setTipsType} />,
    },
    {
      key: 'People',
      label: 'People',
      pageTitle: 'People List',
      component: ({ data, callBack }: ComPropsType) => (
        <People data={data as API.AllBatchType} callBack={callBack} />
      ),
    },
  ];

  useEffect(() => {
    setSelectKey(type ?? 'all');
  }, [type]);

  useUpdateEffect(() => {
    const batchIds = batchList?.batchIds;
    if (batchId || (batchIds && batchIds?.length)) {
      const currentBatchId = selectBatchId ?? batchId ?? batchIds?.[0]?.batchId;
      getBatchDetailsFun(currentBatchId);
      setSelectBatchId(currentBatchId);
    } else {
      dispatch({
        type: 'Batch/updateData',
        payload: {},
      });
    }
  }, [batchList, selectBatchId]);

  //
  useEffect(() => {
    dispatch({
      type: 'Mock/updateData',
      payload: {},
    });
    getMyBatchFun()
      .catch((err) => {
        if (err.message) {
          message.error(err.message);
        }
      })
      .finally(() => {
        setRightLoading(false);
      });
  }, []);

  const NewButton = () => (
    <SeeButton
      icon={<PlusOutlined />}
      shape="round"
      type="primary"
      onClick={() => {
        setActionSelectKey('add');
      }}
    >
      Create New Task
    </SeeButton>
  );

  const Right = useMemo(() => {
    const typeConfig = typeConfigList.find((item) => item.key === selectKey);
    if (selectKey === 'People')
      return typeConfig?.component({
        data: batchDetailData,
        callBack: getBatchDetailsFun,
      });

    if (!batchDetailData.tasks?.length) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 48,
            justifyContent: 'center',
            marginTop: 40,
          }}
        >
          <span style={{ color: '#4A585F' }}>No task added yet</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <SeeButton
              icon={<PlusOutlined />}
              shape="round"
              type="ghost"
              onClick={() => {
                setCopyBatchModalVisible(true);
              }}
            >
              Copy from Batch
            </SeeButton>
            <span style={{ fontWeight: 700 }}>or</span>
            <NewButton />
          </div>
        </div>
      );
    }

    const { tasks = [] } = batchDetailData ?? {};
    if (selectKey === 'all') return typeConfig?.component({ data: tasks, sort: sortKey });

    const taskList = tasks.filter((task: API.TaskType) => {
      if (typeConfig?.values) {
        return typeConfig?.values.includes(task.type);
      }
      return task.type === selectKey;
    });
    return typeConfig?.component({ data: taskList, sort: sortKey });
  }, [batchDetailData, selectKey, sortKey]);

  const pageHeaderData = useMemo(() => {
    localStorage.setItem('pageHeaderItems', '[]');
    let pageHeaderItems: PageHeaderItemType[] = [];
    if (batchDetailData?.name) {
      const isMybatch = pathname.startsWith('/myBatch');
      if (isMybatch) {
        pageHeaderItems = [
          {
            name: `${batchDetailData?.name}`,
            href: `/myBatch?type=${selectKey}&batchId=${batchDetailData?.batchId}`,
          },
        ];
      } else {
        pageHeaderItems = [
          {
            name: 'All Batches',
            href: '/Category',
          },
          {
            name: `${categoryName}`,
            href: `/Category/Batches?categoryName=${categoryName}&categoryId=${batchDetailData.batchCategoryId}`,
          },
          {
            name: batchDetailData?.name,
            href: `/Category/Batches/tasks?batchId=${batchId}&categoryName=${categoryName}&type=${selectKey}&fromAllBatch=true`,
          },
        ];
      }
    }
    localStorage.setItem('pageHeaderItems', JSON.stringify(pageHeaderItems));
    return pageHeaderItems;
  }, [selectKey, batchDetailData]);

  return (
    <div>
      <PageHeader items={pageHeaderData} />
      <div className={styles.pageWrap}>
        <div className={styles.left}>
          {renderSelect()}
          <Tabs data={typeConfigList} activeKey={selectKey} onChange={onChange} />
        </div>
        <div className={styles.right}>
          {batchDetailData.tasks?.length > 0 && selectKey !== 'People' && selectKey !== 'KPI' && (
            <div className={styles.search}>
              <div>
                <span className={styles.label}>Sort by</span>
                <SeeSelect style={{ width: 142 }} value={sortKey} onChange={setSortKey}>
                  <Option value="default">Default</Option>
                  <Option value="asc">Earliest First</Option>
                  <Option value="desc">Latest First</Option>
                </SeeSelect>
              </div>
              <NewButton />
            </div>
          )}
          <Spin spinning={rightLoading}>
            <div className={styles.rightCon}>{Right}</div>
          </Spin>
        </div>

        {selectKey === 'KPI' && batchDetailData.tasks?.length > 0 && <Tips type={TipsType} />}
      </div>

      <CreateModal
        loading={addLoading}
        visible={actionSelectKey === 'add'}
        onClose={() => {
          setActionSelectKey('');
        }}
        onOk={(values) => {
          addTaskFun({
            ...values,
            batchId: selectBatchId,
          }).then(() => {
            message.success('add success');
            setActionSelectKey('');
            getMyBatchFun();
          });
        }}
      />

      <EditModal
        hideDateTime
        visible={actionSelectKey === 'edit'}
        data={editData}
        loading={editLoading}
        onClose={() => {
          setActionSelectKey('');
        }}
        onOk={(values) => {
          editTaskFun({
            ...values,
            batchId: selectBatchId,
            taskId: editData.taskId,
          }).then(() => {
            message.success('edit success');
            setActionSelectKey('');
            getMyBatchFun();
          });
        }}
      />

      <UnlockModal
        visible={actionSelectKey === 'unlock'}
        loading={unlockLoading}
        onClose={() => {
          setActionSelectKey('');
        }}
        onOk={(values) => {
          unlockTaskFun({
            ...values,
            batchId: selectBatchId,
            taskId: editData.taskId,
          }).then(() => {
            message.success('unlock success');
            setActionSelectKey('');
            getMyBatchFun();
          });
        }}
      />

      <LockTaskModal
        batchId={selectBatchId}
        taskId={editData.taskId}
        visible={actionSelectKey === 'locked'}
        onClose={() => {
          setActionSelectKey('');
        }}
        onOk={() => {
          setActionSelectKey('');
          getMyBatchFun();
        }}
      />

      <DeleteModal
        visible={actionSelectKey === 'delete'}
        data={editData}
        loading={delLoading}
        onClose={() => {
          setActionSelectKey('');
        }}
        onOk={() => {
          deleteTaskFun({
            batchId: selectBatchId,
            taskId: editData.taskId,
          }).then(() => {
            message.success('delete success');
            setActionSelectKey('');
            getMyBatchFun();
          });
        }}
      />

      <CopyBatchModal
        loading={copyBatchLoading}
        visible={copyBatchModalVisible}
        currentBatchId={selectBatchId}
        onClose={() => setCopyBatchModalVisible(false)}
        onOk={(values: { originalBatchId: string }) => {
          batchCopyFun({
            batchId: selectBatchId,
            confirmOverwrite: true,
            ...values,
          });
        }}
        categoryId={batchDetailData.batchCategoryId}
      />
    </div>
  );
}

export default connect(({ Batch, loading }: { Batch: API.AllBatchType; loading: Loading }) => ({
  ...Batch,
  loading: loading.models.Batch,
}))(MyBatch);
