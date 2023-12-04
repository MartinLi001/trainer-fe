import React, { useEffect, useMemo, useState } from 'react';
import style from './index.less';
import { history, useLocation } from 'umi';
import {
  trainerAdd,
  traineeAdd,
  searchTrainers,
  searchTrainees,
} from '@/services/people';
import { message, Table } from 'antd';
import { useParams } from 'umi';
import SearchInput from '@/components/SearchInput';
import { PeopleType, searchdataType } from '../typeList';
import { ColumnsType } from 'antd/es/table';
import { CheckOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import SeeButton from '@/components/SeeButton';
import PageHeader from '@/components/PageHeader';
import { connect, ConnectProps, Dispatch } from 'umi';
import { useDebounceFn } from 'ahooks';

interface MyBatchProps extends ConnectProps {
  data: API.AllBatchType;
  dispatch: Dispatch;
}
function AddPeople({ data: batchDetailData }: MyBatchProps) {
  const { type, batchId, batchName } = useParams<{
    type: string;
    batchId: string;
    batchName: string;
  }>();
  const { pathname, query } = useLocation<any>();
  const [data, setData] = useState<PeopleType[]>();
  const [total, setTotal] = useState<number>(0);
  const [pageShow, setPageShow] = useState({
    pageNum: 1,
    pageSize: 10,
  });
  const [selectList, setSelectList] = useState<string[]>([]);
  const [selectData, setSelectData] = useState<PeopleType[]>([]);
  const [count, setCount] = useState<number>(0);
  const [searchContent, setSearchContent] = useState<string | null>(null);

  const searchdata = {
    accountIds: [],
    clients: [],
    companies: [],
    listInactive: false,
    searchContent: null,
    pageNum: 0,
    pageSize: 100,
    sortCriteria: null,
    status: '',
    // tags: [{ name: 'role', value: type }],
  } as searchdataType;

  const onChangePage = (page: number, pageSize: number, name?: string) => {
    setPageShow({
      pageNum: page,
      pageSize: pageSize,
    });
    searchdata.pageNum = page - 1;
    searchdata.pageSize = pageSize;
    // searchdata.searchContent = name || null;
    searchdata.searchContent = name ?? searchContent; // 传了就用传的,不传就用旧的
    (type === 'Trainee' ? searchTrainees(searchdata) : searchTrainers(searchdata)).then(
      (res: any) => {
        setData(res.users);
        setTotal(res.totalUserFound);
      },
    );
  };
  useEffect(() => {
    if (type == 'Trainee') {
      // setSelectData(batchDetailData.trainees)
      const temp = (batchDetailData.trainees || []).map((ite: PeopleType) => {
        return ite.userId;
      });
      setSelectList([...temp]);
      setCount(temp.length);
    } else {
      // setSelectData(batchDetailData.trainers)
      const temp = (batchDetailData.trainers || []).map((ite: PeopleType) => {
        return ite.userId;
      });
      setSelectList([...temp]);
      setCount(temp.length);
    }
    onChangePage(1, 10);
  }, []);

  const { run: SearchList } = useDebounceFn(
    (value: string) => {
      setSearchContent(value);
      onChangePage(1, pageShow.pageSize, value);
    },
    { wait: 500 },
  );
  const tableChoose = (userId: string, flag: boolean, item: PeopleType) => {
    let temp = [...selectList];
    let tempData = [...(selectData || [])];
    if (flag) {
      temp = temp.filter((ite) => {
        return ite != userId;
      });
      tempData = tempData.filter((ie) => {
        return ie.userId != userId;
      });
    } else {
      temp.push(userId);
      tempData.push(item);
    }
    setSelectList([...temp]);
    setSelectData([...tempData]);
  };

  const columns: ColumnsType<PeopleType> = [
    {
      title: <div className={style.tableName}>Name</div>,
      dataIndex: 'firstName',
      key: 'name',
      render: (text, item) => (
        <div className={style.NameShow}>
          {text} {item.lastName} {item.preferredName ? `(${item.preferredName})` : ''}
        </div>
      ),
    },
    {
      title: <div className={style.tableName}>email</div>,
      dataIndex: 'email',
      key: 'email',
      render: (text) => <div className={style.EmialShow}>{text}</div>,
    },
    {
      // title: 'email',
      dataIndex: 'userId',
      key: 'userId',
      width: 150,
      render: (text, item) => {
        let flag = false;
        if (type == 'Trainee') {
          // 如果是添加学员,检查该学员是否已被添加到任一batch中
          flag = !!item.tags?.find((i) => i.name === 'batchId')?.value;
        } else {
          // 如果是添加教师,检查当前batch是否已添加
          flag = selectList.includes(text);
        }
        return (
          <>
            {flag ? (
              <div
                className={style.TableChoose}
                // onClick={() => tableChoose(text, flag, item)}
              >
                <CheckOutlined style={{ marginRight: 4 }} />
                {'Added'}
              </div>
            ) : (
              <div className={style.TableUnChoose} onClick={() => tableChoose(text, flag, item)}>
                <PlusOutlined style={{ marginRight: 4 }} />
                {'Add'}
              </div>
            )}
          </>
        );
      },
    },
  ];
  const columnsSelect: ColumnsType<PeopleType> = [
    {
      dataIndex: 'firstName',
      key: 'name',
      render: (text, item) => (
        <div className={style.NameShow}>
          {text} {item.lastName}
        </div>
      ),
    },
    {
      dataIndex: 'email',
      key: 'email',
      render: (text) => <div className={style.EmialShow}>{text}</div>,
    },
    {
      dataIndex: 'userId',
      key: 'userId',
      width: 150,
      render: (text, item) => <DeleteOutlined onClick={() => tableChoose(text, true, item)} />,
    },
  ];

  const goBack = () => {
    const isMybatch = pathname.startsWith('/myBatch');
    history.push({
      pathname: isMybatch ? '/myBatch' : '/Category/Batches/tasks',
      query: {
        type: 'People',
        ...query,
        ...(batchId ? { batchId } : {}),
      },
    });
  };
  const saveAddPeople = () => {
    const adddata = {
      batchId,
      persons: selectData,
    };
    if (type == 'Trainee') {
      traineeAdd(adddata)
        .then(() => {
          message.success('add success!');
          goBack();
        })
        .catch((error) => {
          message.warning(error.serviceStatus.errorMessage);
        });
    } else {
      trainerAdd(adddata).then(() => {
        message.success('add success!');
        goBack();
      });
    }
  };

  const pageHeaderConfig = useMemo(() => {
    const isMybatch = pathname.startsWith('/myBatch');
    if (isMybatch) {
      return [
        {
          name: batchName,
          href: `/myBatch?type=People&batchId=${batchId}`,
        },
        {
          name: 'People',
          href: `/myBatch?type=People&batchId=${batchId}`,
        },
        {
          name: `Add ${type}`,
        },
      ];
    }

    return [
      {
        name: batchName,
        href: `/Category/Batches/tasks?categoryName=${query.categoryName}&batchId=${batchId}&type=People`,
      },
      {
        name: 'People',
        href: `/Category/Batches/tasks?categoryName=${query.categoryName}&batchId=${batchId}&type=People`,
      },
      {
        name: `Add ${type}`,
      },
    ];
  }, [type]);

  return (
    <>
      <PageHeader items={pageHeaderConfig} />
      <div className={style.AddPeoplePage}>
        <div className={style.SearchTitile}>
          <SearchInput
            onChangeKeyWord={SearchList}
            title={'Enter Name/Email to Search'}
            placeholder="i.e. place holder"
          />
        </div>

        <div className={style.century}>
          <div className={style.SearchList}>
            <Table
              columns={columns}
              dataSource={data}
              rowKey={'userId'}
              pagination={{
                position: ['bottomCenter'],
                size: 'small',
                current: pageShow.pageNum,
                total,
                showSizeChanger: false,
                onChange: onChangePage,
              }}
            />
          </div>
          <div className={style.ChooseList}>
            <Table
              columns={columnsSelect}
              dataSource={selectData}
              showHeader={false}
              title={() => (
                <div className={style.SelectNumber}>{selectList.length - count} Selected</div>
              )}
              rowKey={'userId'}
              pagination={false}
            />
            <div className={style.buttonADD}>
              <SeeButton type="default" onClick={() => history.goBack()}>
                Cancel
              </SeeButton>
              <SeeButton
                type="primary"
                style={{ marginLeft: 36 }}
                onClick={() => saveAddPeople()}
                disabled={selectList.length - count == 0}
              >
                Add
              </SeeButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// export default AddPeople;

export default connect(({ Batch }: { Batch: API.AllBatchType }) => ({
  ...Batch,
}))(AddPeople);
