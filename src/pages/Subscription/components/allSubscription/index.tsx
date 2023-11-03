import styles from './index.less';
import TagNav from '@/components/TagNav';
import SearchInput from '@/components/SearchInput';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import SelectChoose from '../selectChoose';
import { searchSubscriptions, deleteSubscription } from '@/services/question';
import { useEffect, useMemo, useState } from 'react';
import { criteriaObj, allSubscription } from '../../typeList';
import TagShowLength from '@/components/TagListShow';
import { Dropdown, Menu, TableColumnsType, Table, message, Modal } from 'antd';
import { useDebounceFn, useRequest } from 'ahooks';
import moment from 'moment';
import BtachCascader, { SelectedBatchType } from '../BatchCascader';
import { history } from 'umi';
// import notification from '../Notification';

type statusType = 'active' | 'inactive';

type FieldType = {
  displayName: string;
  slug: string;
};
interface Props {
  config: {
    sortableFields: FieldType[];
    status: FieldType[];
  };
  clientList: criteriaObj[];
}

export default function AllSubscription({
  config: {
    sortableFields = [],
    status: filterList = [
      { displayName: 'Active', slug: 'active' },
      { displayName: 'Inactive', slug: 'inactive' },
    ],
  },
  clientList,
}: Props) {
  // const [searchData, setSearchData] = useState<searchDataType>({ sortingCriteria: [] });
  const [sortingCriteria, setSortingCriteria] = useState({
    field: 'createDate',
    isAscending: false,
  });
  const [searchContent, setSearchContent] = useState('');
  const [clientIds, setClientIds] = useState<string[]>([]);
  const [status, setStatus] = useState<statusType[]>(
    (filterList.map((i) => i.slug) as statusType[]) || ['active', 'inactive'],
  );
  const [page, setPage] = useState(1); // 储存和显示以1开始，传给接口以0开始
  const [pageSize, setPageSize] = useState(10);
  const [selectedBatches, setSelectedBatches] = useState<SelectedBatchType>({});

  const StatusEnum = useMemo(() => {
    enum res {}
    filterList.forEach((item) => {
      res[item.slug] = item.displayName;
    });
    return res;
  }, [filterList]);

  const {
    data: searchResult,
    loading: tableLoading,
    refresh: refreshTable,
  } = useRequest(
    () =>
      searchSubscriptions({
        pageNumber: page - 1,
        pageSize: pageSize,
        searchContent: searchContent,
        sortingCriteria: [sortingCriteria],
        clientIds: clientIds,
        status: status,
        batches: selectedBatches?.options?.map((i) => ({
          batchCategoryName: i.categoryName,
          batchName: i.name,
        })),
      }),
    {
      refreshDeps: [
        searchContent,
        sortingCriteria,
        clientIds,
        status,
        page,
        pageSize,
        selectedBatches,
      ],
      onError: (err: any) => {
        message.error(err?.serviceStatus?.errorMessage || 'ERROR!');
      },
      debounceWait: 1, // 当依赖互相影响时，用来保证参数是最新的
    },
  );

  const tableSource = useMemo(() => {
    return searchResult?.dtos?.map((item: any) => {
      const userInfo = item.userInfo || {};
      const startDate = moment(item.startDate);
      const endDate = moment(item.endDate);
      return {
        userInfo: userInfo,
        name: `${userInfo.userFirstName} ${userInfo.userLastName}${
          userInfo.userPreferredName ? `(${userInfo.userPreferredName})` : ''
        }`,
        clients: item.subscribeAllClients
          ? [{ name: 'All Client', clientId: 'All Client' }]
          : item.clients.map((i: string) => ({
              name: clientList?.find((option) => option.clientId === i)?.name,
              clientId: i,
            })),
        createdDate: moment(item.createdDate).local().format('MM/DD/YYYY'),
        cycle: item.totalLength || endDate.diff(startDate, 'd'),
        startDate: startDate.local().format('MM/DD/YYYY'),
        endDate: endDate.local().format('MM/DD/YYYY'),
        status: item.status,
        lastModifiedDate: moment(item.lastModifiedDate).local().format('MM/DD/YYYY'),
        subscribeBy: item.creatorFullName,
        email: userInfo.userEmail,
        batchName: userInfo.userBatchName,
        confirmation: item.confirmationNumber,
        id: item.questionSubscriptionId,
        subscribeAllClients: item.subscribeAllClients,
      };
    });
  }, [searchResult, clientList]);

  useEffect(() => {
    setPage(1);
  }, [searchContent, sortingCriteria, clientIds, status, selectedBatches]);

  const isfiltered = useMemo(() => {
    return !!(
      searchContent?.length ||
      clientIds?.length ||
      status?.length < filterList?.length ||
      selectedBatches?.options?.length
    );
  }, [searchContent, clientIds, status, selectedBatches]);

  const renderShowIcon = (field: string) => {
    let sortIcon = (
      <span className={styles.hoverIcon} style={{ visibility: 'hidden' }}>
        <ArrowDownOutlined />
      </span>
    );
    if (sortingCriteria.field == field) {
      if (sortingCriteria.isAscending) {
        sortIcon = (
          <ArrowUpOutlined className={styles.showSortIcon} style={{ visibility: 'hidden' }} />
        );
      } else {
        sortIcon = (
          <ArrowDownOutlined className={styles.showSortIcon} style={{ visibility: 'hidden' }} />
        );
      }
    }
    return sortIcon;
  };

  const renderHearderCell = (displayName: string) => {
    const sortCofig = sortableFields.find((i) => i.displayName === displayName);
    function onClickSort(field: string) {
      let isAscending = false;
      if (field === sortingCriteria?.field) {
        isAscending = !sortingCriteria.isAscending;
      }
      setSortingCriteria({ field, isAscending });
    }
    if (sortCofig) {
      return (
        <div className={styles.sortTitle} onClick={() => onClickSort(sortCofig.slug)}>
          {displayName} {renderShowIcon(sortCofig.slug)}
        </div>
      );
    } else {
      return displayName;
    }
  };

  const ColumnList: TableColumnsType<allSubscription> = [
    {
      key: '1',
      title: 'Client',
      dataIndex: 'clients',
      render: (textm) => (
        <div className="columns-tags">
          <TagShowLength
            list={textm}
            maxShow={2}
            prop={{ id: 'clientId', name: 'name' }}
            height={20}
          />
        </div>
      ),
    },
    {
      key: '2',
      title: renderHearderCell('Subscribe on'),
      dataIndex: 'createdDate',
      render: (text) => <span className={styles.italicText}>{text}</span>,
    },
    {
      key: '3',
      title: renderHearderCell('Cycle'),
      dataIndex: 'cycle',
      render: (text) => text + `${~~text < 2 ? ' day' : ' days'}`,
    },
    {
      key: '4',
      title: renderHearderCell('Start Date'),
      dataIndex: 'startDate',
      render: (text) => <span className={styles.italicText}>{text}</span>,
    },
    {
      key: '5',
      title: renderHearderCell('End Date'),
      dataIndex: 'endDate',
      render: (text) => <span className={styles.italicText}>{text}</span>,
    },
    {
      key: '6',
      title: <div>Status</div>,
      dataIndex: 'status',
      render: (text) => (
        <span className={[styles.status, styles[StatusEnum[text]?.replace(' ', '')]].join(' ')}>
          {StatusEnum[text]}
        </span>
      ),
    },
    {
      key: '7',
      title: renderHearderCell('Last Modified'),
      dataIndex: 'lastModifiedDate',
      render: (text) => text,
    },

    {
      key: '8',
      title: renderHearderCell('Subscribe by'),
      dataIndex: 'subscribeBy',
      render: (text) => text,
    },
    {
      key: '10',
      title: renderHearderCell('Email'),
      dataIndex: 'email',
      render: (text) => text,
    },
    {
      key: '11',
      title: renderHearderCell('Batch'),
      dataIndex: 'batchName',
      render: (text) => text,
    },
    {
      key: '9',
      title: renderHearderCell('Confirmation'),
      dataIndex: 'confirmation',
      render: (text) => text,
    },
  ];
  // const [chooseColumn, setChooseColumn] = useState<TableColumnsType<allSubscription>>(
  //   ColumnList.slice(0, 7),
  // );
  const [chooseColumn, setChooseColumn] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7']);
  const { run: onChangeInput } = useDebounceFn(
    (value: string) => {
      setSearchContent(value);
    },
    {
      wait: 500,
    },
  );

  function onDelete(data: any) {
    const param = {
      subscriptionId: data.id,
      user: data.userInfo,
    };
    Modal.confirm({
      getContainer: document.getElementById('allSubscription') as HTMLElement,
      className: styles.deleteModal,
      // icon: <WarningFilled />,
      title: (
        <div className={styles.title}>
          Delete Subscription for {data?.userInfo?.userFirstName} {data?.userInfo?.userLastName}
        </div>
      ),
      content: (
        <div className={styles.content}>
          <div className={styles.bold}>This action cannot be reversed</div>
          <div className={styles.light}>
            {data?.userInfo?.userFirstName} {data?.userInfo?.userLastName} will not be able to
            access question bank anymore, and their subscription history will be removed
            permanently.
          </div>
        </div>
      ),
      maskClosable: true,
      centered: true,
      width: 600,
      onOk: () =>
        deleteSubscription(param)
          .then(() => {
            refreshTable();
            // notification({
            //   key: data.id,
            //   message: 'Subscription Successfully Deleted',
            //   description: `${data?.userInfo?.userFirstName} ${data?.userInfo?.userLastName}’s access to the question bank is removed`,
            //   getContainer() {
            //     return document.getElementById(styles.allSubscription) as HTMLElement;
            //   },
            // });
          })
          .catch((err) => message.error(err?.serviceStatus?.errorMessage || 'ERROR!')),
      okText: 'delete',
      okButtonProps: { className: styles.deleteButton },
    });
  }
  const renderMenu = (item: any) => {
    const menuItems = [
      {
        label: (
          <a
            onClick={() => {
              history.push({ pathname: `/Subscription/Edit/${item.id}`, state: item });
            }}
          >
            Update
          </a>
        ),
        key: 'edit',
      },
      {
        label: <a onClick={() => onDelete(item)}>Delete</a>,
        key: 'delete',
      },
    ];
    return <Menu items={menuItems} />;
  };

  const columns: TableColumnsType<allSubscription> = [
    {
      title: renderHearderCell('Name'),
      dataIndex: 'name',
      // width: 150,
      render: (text) => <div className={styles.tableName}>{text}</div>,
    },
  ];
  const columnsEnd: TableColumnsType<allSubscription> = [
    {
      title: <div>Actions</div>,
      dataIndex: 'id',
      // width: 150,
      render: (text, i) => {
        return (
          <Dropdown
            overlay={renderMenu(i)}
            trigger={['click']}
            getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          >
            <span style={{ marginLeft: 20 }} onClick={(e) => e.preventDefault()}>
              <MoreOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </span>
          </Dropdown>
        );
      },
    },
  ];

  const onChangeColumn = (list: string[]) => {
    setChooseColumn(list);
    // const temp = ColumnList.filter((ite: any) => {
    //   if (list.includes(ite.key as string)) {
    //     return ite;
    //   }
    // });
    // setChooseColumn([...temp] as TableColumnsType<allSubscription>);
    // columns.splice(1, 0, ...temp);
  };

  const onChangeClient = (list: string[]) => {
    setClientIds(list);
  };

  const onChangeTag = (v: string) => {
    if (v === 'all') {
      setStatus((filterList.map((i) => i.slug) as statusType[]) || ['active', 'inactive']);
    } else {
      setStatus([v as statusType]);
    }
  };
  function onChangePage(num: number, size: number) {
    setPage(num);
    setPageSize(size);
  }
  return (
    <div className={styles.allSubscription} id={styles.allSubscription}>
      <div className={styles.searchFilter}>
        <div className={styles.statusFilter}>
          <TagNav
            list={filterList}
            showAll={true}
            label={'filter by'}
            type="radio"
            onChange={onChangeTag}
            prop={{ name: 'displayName', id: 'slug' }}
          />
        </div>
        <SearchInput
          onChangeKeyWord={onChangeInput}
          title="Search Subscription User"
          placeholder="enter name/email to search"
          icon={<SearchOutlined />}
          style={{ marginBottom: 15 }}
        />
      </div>
      <div className={styles.selectList}>
        <SelectChoose
          list={[{ clientId: 'All Client', name: 'All Client' }, ...clientList]}
          label={'Client'}
          prop={{ id: 'clientId', name: 'name' }}
          onChange={onChangeClient}
        />
        <BtachCascader
          selected={selectedBatches}
          onSelectedChange={setSelectedBatches}
          // multiple={true}
          noBatchAssigned={true}
        />
        <SelectChoose
          list={ColumnList}
          label={'Display Column'}
          prop={{ id: 'key', name: 'title' }}
          onChange={onChangeColumn}
          // value={
          //   chooseColumn.map((ite) => {
          //     return ite.key;
          //   }) as string[]
          // }
          value={chooseColumn}
        />
      </div>

      {selectedBatches?.options?.map((item) => (
        <div key={item + 'selected-batches'} className={styles.selectedBatches}>
          {item.name}
          <CloseOutlined
            className={styles.icon}
            onClick={() => {
              setSelectedBatches({
                value: selectedBatches.value?.filter((i) => i !== item.batchId),
                options: selectedBatches.options?.filter((i) => i.batchId !== item.batchId),
              });
            }}
          />
        </div>
      ))}

      <div className={styles.searchTable}>
        {isfiltered && (
          <div className={styles.totalCount}>{searchResult?.totalItemFound} result(s) found</div>
        )}
        <Table
          loading={tableLoading}
          columns={[
            ...columns,
            ...ColumnList.filter((ite: any) => {
              if (chooseColumn.includes(ite.key as string)) {
                return ite;
              }
            }),
            ...columnsEnd,
          ]}
          rowClassName={styles.rowShow}
          rowKey={'id'}
          dataSource={tableSource}
          pagination={{
            position: ['bottomCenter'],
            size: 'small',
            total: searchResult?.totalItemFound,
            showSizeChanger: true,
            onChange: onChangePage,
            current: page,
            pageSize: pageSize,
            pageSizeOptions: [10, 20, 50],
            // showTotal: (total) => `${total}`,
          }}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}
