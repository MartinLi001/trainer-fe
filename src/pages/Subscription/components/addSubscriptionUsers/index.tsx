import IconFont from '@/components/IconFont';
import { getSearchUser } from '@/services/people';
import { CloseOutlined, SolutionOutlined } from '@ant-design/icons';
import { Input, message, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { useMemo, useState } from 'react';
import styles from './index.less';
import cx from 'classnames';
import SeeButton from '@/components/SeeButton';
import BatchCascader, { SelectedBatchType } from '../BatchCascader';
import type {
  addSubscriptionUsersTableRowType,
  SelectedUserType,
  usersSearchResultUserType,
} from '../../typeList';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { cloneDeep } from 'lodash';

interface Props {
  initUsers: SelectedUserType[];
  confirmToBack: (v?: SelectedUserType[]) => void;
}
export default function AddSubscriptionUsers({ initUsers, confirmToBack }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<SelectedUserType[]>(initUsers || []); // 已选择的学员列表
  const [selectedBatches, setSelectedBatches] = useState<SelectedBatchType>({});
  const [searchInputValue, setSearchInputValue] = useState(''); // 搜索框的数据
  // const [searchText, setSearchText] = useState('');
  const { data: UserResult, loading: tableLoading } = useRequest(
    () =>
      getSearchUser({
        status: '',
        clients: [],
        tags: [{ name: 'role', value: 'Trainee' }].concat(
          selectedBatches?.options?.map((i) => ({ name: 'batchName', value: i.name })) || [],
        ),
        accountIds: [],
        listInactive: false,
        pageNum: 0,
        // pageSize: Infinity, // todo
        companies: [],
        searchContent: searchInputValue,
      }),
    {
      refreshDeps: [selectedBatches, searchInputValue],
      onError: (err: any) => {
        message.error(err?.serviceStatus?.errorMessage || 'ERROR!');
      },
      debounceWait: 500,
    },
  );
  const userData = useMemo(() => {
    const data: addSubscriptionUsersTableRowType[] = UserResult?.users?.map(
      (item: usersSearchResultUserType) => ({
        key: item.userId,
        userId: item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
        preferredName: item.preferredName,
        email: item.email,
        batchId: item.tags?.find((tag) => tag.name === 'batchId')?.value,
        batchName: item.tags?.find((tag) => tag.name === 'batchName')?.value,
        batchAddedDate: item.batchAddedDate,
      }),
    );
    return data || [];
  }, [UserResult]);

  const columns: ColumnsType<addSubscriptionUsersTableRowType> = [
    {
      key: 'legalName',
      title: 'Legal Name',
      render: (text, record) => {
        return <span className={styles.heavyText}>{record.firstName + ' ' + record.lastName}</span>;
      },
    },
    {
      dataIndex: 'preferredName',
      title: 'Preferred Name',
      render: (text) => <span className={styles.heavyText}>{text}</span>,
    },
    {
      dataIndex: 'email',
      title: 'Email',
    },
    {
      dataIndex: 'batchName',
      title: 'Batch',
    },
    {
      dataIndex: 'batchAddedDate',
      title: 'Batch Start',
      render(text) {
        if (text) return moment(text).format('MM-DD-YYYY');
        else return;
      },
    },
  ];

  const renderSelectedCard = (user: SelectedUserType) => (
    <div className={styles.card} key={user.userId + 'card'}>
      <IconFont type="icon-user-3-line" className={styles.icon} />
      <span className={styles.text}>
        {`${user.userFirstName} ${user.userLastName}`}
        {user.userPreferredName ? ` (${user.userPreferredName})` : ''}
      </span>
      <IconFont
        type="icon-delete-bin-line"
        className={styles.delete}
        onClick={() => {
          setSelectedUsers(selectedUsers.filter((item) => item.userId !== user.userId));
        }}
      />
    </div>
  );

  function deleteBatch(batchId: string) {
    setSelectedBatches((data) => {
      return {
        value: (data.value as string[])?.filter((item) => item[item.length - 1] !== batchId),
        options: data.options?.filter((item) => item.batchId !== batchId),
      };
    });
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>
          <SolutionOutlined className={styles.icon} />
          Add Subscription Users
        </div>
        <div className={styles.options}>
          <div className={styles.filter}>
            <BatchCascader selected={selectedBatches} onSelectedChange={setSelectedBatches} />
          </div>
          <div className={styles.search}>
            <div className={styles.text}>Search User</div>
            <Input
              size="large"
              placeholder="enter name or email"
              prefix={<IconFont type="icon-search-line" />}
              onChange={(e) => setSearchInputValue(e.target.value)}
            />
          </div>
        </div>
        {selectedBatches?.options?.map((item) => (
          <span className={styles.selectedBatch} key={item.batchId + 'selected'}>
            {item.name}
            <CloseOutlined className={styles.icon} onClick={() => deleteBatch(item.batchId)} />
          </span>
        ))}
      </div>
      <div className={styles.table}>
        <Table
          columns={columns}
          dataSource={userData}
          rowSelection={{
            selectedRowKeys: selectedUsers.map((item) => item.userId),
            onSelect: (record, selected) => {
              const temp = cloneDeep(selectedUsers);
              if (selected) {
                temp.push({
                  userId: record.userId,
                  userFirstName: record.firstName,
                  userLastName: record.lastName,
                  userPreferredName: record.preferredName,
                  userEmail: record.email,
                  userBatchId: record.batchId,
                  userBatchName: record.batchName,
                });
              } else {
                const index = temp.findIndex((i) => i.userId === record.userId);
                temp.splice(index, 1);
              }
              setSelectedUsers(temp);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              let temp: SelectedUserType[] = [];
              if (selected) {
                temp = cloneDeep(selectedUsers);
                changeRows.forEach((item) => {
                  temp.push({
                    userId: item.userId,
                    userFirstName: item.firstName,
                    userLastName: item.lastName,
                    userPreferredName: item.preferredName,
                    userEmail: item.email,
                    userBatchId: item.batchId,
                    userBatchName: item.batchName,
                  });
                });
              } else {
                selectedUsers.forEach((item) => {
                  if (!changeRows.some((i) => i.userId === item.userId)) {
                    temp.push(item);
                  }
                });
              }
              setSelectedUsers(temp);
            },
          }}
          loading={tableLoading}
          rowClassName={styles.row}
          pagination={{
            position: ['bottomCenter'],
            size: 'small',
            pageSizeOptions: [10, 20, 50],
          }}
          sticky
        />
      </div>
      <div className={styles.selected}>
        <div className={styles.list}>{selectedUsers.map((item) => renderSelectedCard(item))}</div>
        <div className={cx(styles.total, selectedUsers?.length ? styles.blue : styles.grey)}>
          {selectedUsers?.length} Selected
        </div>
        <div className={styles.buttons}>
          <SeeButton type="ghost" onClick={confirmToBack}>
            Back
          </SeeButton>
          <SeeButton
            type="primary"
            disabled={!selectedUsers?.length}
            onClick={() => confirmToBack(selectedUsers)}
          >
            Confirm
          </SeeButton>
        </div>
      </div>
    </div>
  );
}
