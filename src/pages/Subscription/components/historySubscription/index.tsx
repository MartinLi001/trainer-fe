import styles from './index.less';
import TagNav from '@/components/TagNav';
import SearchInput from '@/components/SearchInput';
import { ArrowDownOutlined, ArrowUpOutlined, SearchOutlined } from '@ant-design/icons';
import { Table, TableColumnsType, message } from 'antd';
// import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { getHistorySubscription } from '@/services/question';
import { useDebounceFn, useRequest } from 'ahooks';
// import { searchDataType } from '../../typeList';
import moment from 'moment';
import TagShowLength from '@/components/TagListShow';
import { criteriaObj } from '../../typeList';

type statusType = 'success' | 'fail' | 'partiallySuccess';
type actionType = 'update' | 'delete' | 'create';

// const sortableFields = [
//   {
//     displayName: 'Subscribe by',
//     slug: 'creatorFullName',
//   },
//   {
//     displayName: 'Size',
//     slug: 'subscriptionItems',
//   },
//   {
//     displayName: 'Start Date',
//     slug: 'startDate',
//   },
//   {
//     displayName: 'End Date',
//     slug: 'endDate',
//   },
//   {
//     displayName: 'Last Modified',
//     slug: 'lastModifiedDate',
//   },
//   {
//     displayName: 'Total Length',
//     slug: 'totalLengthInDays',
//   },
// ];

type FieldType = {
  displayName: string;
  slug: string;
};
interface Props {
  config: {
    sortableFields: FieldType[];
    status?: FieldType[];
    actionTypes?: FieldType[];
  };
  clientList: criteriaObj[];
}

export default function HistorySubscription(props: Props) {
  const {
    config: {
      sortableFields = [],
      status: filterList = [
        { displayName: 'Success', slug: 'success' },
        { displayName: 'Failed', slug: 'fail' },
        { displayName: 'Partially Completed', slug: 'partiallySuccess' },
      ],
      actionTypes: Partially = [
        { displayName: 'Update', slug: 'update' },
        { displayName: 'Delete', slug: 'delete' },
        { displayName: 'Create', slug: 'create' },
      ],
    },
    clientList,
  } = props;
  const StatusEnum = useMemo(() => {
    enum res {}
    filterList.forEach((item) => {
      res[item.slug.toLocaleLowerCase().replace(' ', '')] = item.displayName;
    });
    return res;
  }, [filterList]);

  const [page, setPage] = useState(1); // 储存和显示以1开始，传给接口以0开始
  const [pageSize, setPageSize] = useState(10);
  const [activeKey, setActiveKey] = useState<string[]>();
  const [sortingCriteria, setSortingCriteria] = useState({
    field: 'creatorFullName',
    isAscending: false,
  });
  const [searchContent, setSearchContent] = useState('');
  const [status, setStatus] = useState<statusType[]>(
    (filterList.map((i) => i.slug) as statusType[]) || ['success', 'fail', 'partiallySuccess'],
  );
  const [action, setAction] = useState<actionType[]>(
    (Partially.map((i) => i.slug) as actionType[]) || ['update', 'delete', 'create'],
  );

  const { data: searchResult, loading: tableLoading } = useRequest(
    () =>
      getHistorySubscription({
        pageNumber: page - 1,
        pageSize: pageSize,
        searchContent: searchContent,
        sortingCriteria: [sortingCriteria],
        status: status,
        actionType: action,
      }),
    {
      refreshDeps: [page, pageSize, searchContent, sortingCriteria, status, action],
      onError: (err: any) => {
        message.error(err?.serviceStatus?.errorMessage || 'ERROR!');
      },
      debounceWait: 1, // 当依赖互相影响时，用来保证参数是最新的
    },
  );

  const tableSource = useMemo(() => {
    return searchResult?.dtos?.map((item: any) => {
      const startDate = moment(item.startDate);
      const endDate = moment(item.endDate);
      return {
        name: `${item.creatorPreferredName || item.creatorFirstName} ${item.creatorLastName.slice(
          0,
          1,
        )}.`,
        size: item.individualSubscriptionHistory?.length,
        clients: item.subscribeAllClients
          ? [{ name: 'All Client' }]
          : item.clients?.map((i: string) => ({
              name: clientList?.find((option) => option.clientId === i)?.name,
              clientId: i,
            })),
        status: item.status,
        action: item.actionType,
        startDate: startDate.local().format('MM/DD/YYYY'),
        cycle: item.totalLength || endDate.diff(startDate, 'd'),
        endDate: endDate.local().format('MM/DD/YYYY'),
        confirmation: item.confirmationNumber,
        id: item.confirmationNumber,
        historyDetail: item.individualSubscriptionHistory,
      };
    });
  }, [searchResult, clientList]);

  useEffect(() => {
    setPage(1);
  }, [searchContent, sortingCriteria, status, action]);

  const isfiltered = useMemo(() => {
    return !!(
      searchContent?.length ||
      status?.length < filterList?.length ||
      action?.length < Partially?.length
    );
  }, [searchContent, status, action]);

  const { run: onChangeInput } = useDebounceFn(
    (value: string) => {
      setSearchContent(value);
    },
    {
      wait: 500,
    },
  );
  // useEffect(() => {
  //   setSearchData(); // 提交报错删掉就好

  //   getHistorySubscription({
  //     pageNumber: 1,
  //     pageSize: 10,
  //     searchContent: searchContent,
  //     sortingCriteria: [],
  //     status: [],
  //     actionType: [],
  //   }).then((res) => {
  //     console.log('%cindex.tsx line:21 res', 'color: #007acc;', res);
  //   });
  // }, []);
  interface DataType {
    key: React.Key;
    name: string;
    platform: string;
    version: string;
    upgradeNum: number;
    creator: string;
    createdAt: string;
  }

  interface ExpandedDataType {
    key: React.Key;
    date: string;
    name: string;
    upgradeNum: string;
  }

  const expandedRowRender = (record: any) => {
    const columns: TableColumnsType<ExpandedDataType> = [
      { title: 'Name', dataIndex: 'subscriberName', key: 'subscriberName' },
      { title: 'Email', dataIndex: 'subscriberEmail', key: 'subscriberEmail' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text) => (
          <span className={[styles.status, styles[StatusEnum[text]]].join(' ')}>
            {StatusEnum[text]}
          </span>
        ),
      },

      {
        title: 'Reason',
        dataIndex: 'reason',
        key: 'reason',
        render: (text) => text || 'na',
      },
    ];
    return (
      <div style={{ marginLeft: 50 }}>
        <Table
          columns={columns}
          dataSource={record?.historyDetail || []}
          pagination={false}
          rowKey={'subscriberEmail'}
        />
      </div>
    );
  };
  const renderShowIcon = (field: string) => {
    let sortIcon = (
      <span className={styles.hoverIcon} style={{ visibility: 'hidden' }}>
        <ArrowDownOutlined />
      </span>
    );
    if (sortingCriteria.field == field) {
      if (sortingCriteria.isAscending) {
        sortIcon = <ArrowUpOutlined />;
      } else {
        sortIcon = <ArrowDownOutlined />;
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
  const columns: TableColumnsType<DataType> = [
    {
      title: renderHearderCell('Subscribe by'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div className={styles.tableName}>{text}</div>,
    },
    {
      title: renderHearderCell('Size'),
      dataIndex: 'size',
      key: 'size',
      render: (text) => <span className={styles.blueText}>{text}</span>,
    },
    {
      title: 'Client',
      dataIndex: 'clients',
      key: 'clients',
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <span
          className={[
            styles.status,
            styles[StatusEnum[text.toLocaleLowerCase()]?.replace(' ', '')],
          ].join(' ')}
        >
          {StatusEnum[text.toLocaleLowerCase()]}
        </span>
      ),
    },
    {
      title: renderHearderCell('Action Type'),
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: renderHearderCell('Start Date'),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => <span className={styles.italicText}>{text}</span>,
    },
    {
      title: renderHearderCell('Cycle'),
      key: 'cycle',
      dataIndex: 'cycle',
      render: (text) => text + `${~~text < 2 ? ' day' : ' days'}`,
    },
    {
      title: renderHearderCell('End Date'),
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => <span className={styles.italicText}>{text}</span>,
    },
    {
      title: renderHearderCell('Confirmation'),
      dataIndex: 'confirmation',
      key: 'confirmation',
    },
  ];

  const onChangeTagFilter = (v: string) => {
    if (v === 'all') {
      setStatus(
        (filterList.map((i) => i.slug) as statusType[]) || ['success', 'fail', 'partiallySuccess'],
      );
    } else {
      setStatus([v as statusType]);
    }
  };
  const onChangeTagAction = (v: string) => {
    if (v === 'all') {
      setAction((Partially.map((i) => i.slug) as actionType[]) || ['update', 'delete', 'create']);
    } else {
      setAction([v as actionType]);
    }
  };
  function onChangePage(num: number, size: number) {
    setPage(num);
    setPageSize(size);
  }
  return (
    <div className={styles.historySubscription}>
      <div className={styles.historySubscriptionTag}>
        <div className={styles.historySubscriptionSelect}>
          <TagNav
            list={filterList}
            showAll={true}
            label={'filter by'}
            type="radio"
            allText="All Status"
            displayMaxLineLength={3}
            onChange={onChangeTagFilter}
            prop={{ id: 'slug', name: 'displayName' }}
          />
          <TagNav
            list={Partially}
            showAll={true}
            label={'Action Type'}
            type="radio"
            displayMaxLineLength={3}
            onChange={onChangeTagAction}
            prop={{ id: 'slug', name: 'displayName' }}
          />
        </div>
        <SearchInput
          onChangeKeyWord={onChangeInput}
          title="Search by Confirmation Number"
          placeholder="enter confirmation number"
          icon={<SearchOutlined />}
          style={{ marginBottom: 15 }}
        />
      </div>
      <div className={styles.historySubscriptionTable}>
        {isfiltered && (
          <div className={styles.totalCount}>{searchResult?.totalItemFound} result(s) found</div>
        )}
        <Table
          loading={tableLoading}
          columns={columns}
          rowClassName={styles.rowShow}
          expandable={{
            expandedRowRender,
            expandedRowKeys: activeKey,
            expandRowByClick: true,
            fixed: 'right',
            expandIcon: ({ expanded }) => (expanded ? '' : ''),
            onExpand: (expanded, record: any) => {
              setActiveKey(expanded ? [record.id] : []);
            },
          }}
          dataSource={tableSource}
          rowKey="id"
          pagination={{
            position: ['bottomCenter'],
            size: 'small',
            total: searchResult?.totalItemFound,
            showSizeChanger: true,
            onChange: onChangePage,
            current: page,
            pageSize: pageSize,
            pageSizeOptions: [10, 20, 50],
          }}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}
