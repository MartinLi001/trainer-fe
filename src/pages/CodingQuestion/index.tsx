import React, { useState, useEffect } from 'react';
import { Input, Table, Tooltip, Spin, message, Dropdown, Menu, Modal } from 'antd';
import {
  QuestionList,
  getTopicsList,
  getClients,
  getTags,
  getClientsSearch,
  getTagsSearch,
  removeQuesiton,
} from '@/services/question';
// import { searchCodingQuestions } from '@/services/coding';
import type { ListItem } from './Componts/FlexNav';
import FlexNav from './Componts/FlexNav';
import DropDownSelect, { DropListItem } from './Componts/DropDownSelect';
// import PageHeader from '@/components/PageHeader';
import type { ColumnsType } from 'antd/es/table';
import DropDownTag from './Componts/DropDownTag';
import type { criteriaObj, TagType, ClientsType, SearchType, SearchData } from './typeList';
import TagShow from '../../components/TagShow';
import Low from '@/assets/Low.svg';
import High from '@/assets/High.svg';
import Medium from '@/assets/Medium.svg';
import Page422error from '@/assets/Page422error.svg';
import { useDebounce, useUpdateEffect } from 'ahooks';
// import CodeMirror from '@/components/CodeMirror';
import './index.less';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClearOutlined,
  CloseOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { ConnectProps, useHistory, useLocation } from 'umi';
import { SearchCodingModelState, connect, Dispatch } from 'umi';
import SeeButton from '@/components/SeeButton';
import { roundingOff } from '@/utils';
import IconFont from '@/components/IconFont';
import { AuButton } from '@aurora-ui-kit/core';

// import { filter } from 'lodash';

interface QuestionProps extends ConnectProps {
  moduleSearchList: SearchType;
  dispatch: Dispatch;
}

const diffcultyList = [
  {
    name: 'Easy',
    color: '#8FCE28',
  },
  {
    name: 'Medium',
    color: '#FFB121',
  },
  {
    name: 'Hard',
    color: '#F67C6B',
  },
];
const Frequency = [
  {
    name: 'Low',
    color: '#8FCE28',
    Icon: Low,
  },
  {
    name: 'Medium',
    color: '#FFB121',
    Icon: Medium,
  },
  {
    name: 'High',
    color: '#F67C6B',
    Icon: High,
  },
];

const Question: React.FC<QuestionProps> = ({ moduleSearchList, dispatch }) => {
  const [questiongList, setQuestion] = useState<ListItem[]>([]);
  const [topicValue, setTopicValue] = useState<string>('');
  const [tagList, setTagList] = useState<TagType[]>([]);
  const [clientList, setClientList] = useState<ClientsType[]>([]);
  const [SearchDataList, setSearchDataList] = useState<SearchData[]>([]);
  const [showPage, setShowPage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  // const codeRef = useRef<any>();

  const [SearchList, setSearchList] = useState<SearchType>({
    pageNum: 0,
    pageSize: 10,
    criteria: [],
    sortCriteria: { field: 'sequenceNumber', order: '' },
  });
  const [inputvalue, setInputValue] = useState<criteriaObj[]>([]);
  const debouncedValue = useDebounce(inputvalue, { wait: 1000 });
  const [diffcultytype, setDiffcultytype] = useState<DropListItem>({});
  const [frequencytype, setFrequencytype] = useState<DropListItem>({});
  const [tagSearchType, setTagSearchType] = useState<string[]>([]);
  const [cliSearchType, setCliSearchType] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [inputSearchValue, setInputSearchValue] = useState<string>('');

  const {
    query: { searchFlag },
  } = useLocation() as any;

  const history = useHistory();
  const getQuestionList = (data: SearchType) => {
    if (!pageLoading) setLoading(true);
    // searchCodingQuestions(data)
    QuestionList(data)
      .then((res: any) => {
        setSearchDataList(res.questions);
        setTotal(res.totalFound);
        setLoading(false);
      })
      .catch((error) => {
        if (error.code == 422) {
          setShowPage(true);
        }
      })
      .finally(() => {
        setLoading(false);
        setPageLoading(false);
      });
  };
  useEffect(() => {
    let temp = {
      pageNum: 0,
      pageSize: 10,
      criteria: [],
      sortCriteria: { field: 'sequenceNumber', order: '' },
    } as SearchType;
    if (searchFlag == '1' && JSON.stringify(moduleSearchList) != '{}') {
      temp = { ...moduleSearchList };
    }
    setSearchList({ ...temp });
    (temp.criteria || []).map((ite: criteriaObj) => {
      if (ite.field == 'topic') {
        setTopicValue(ite.value || '');
      }
      if (ite.field == 'tags') {
        setTagSearchType(ite.values || []);
      }
      if (ite.field == 'clients') {
        setCliSearchType(ite.values || []);
      }
      if (ite.field == 'name') {
        setInputSearchValue(ite.value || '');
      }
      if (ite.field == 'difficulty') {
        let temptag = {};
        diffcultyList.map((item) => {
          if (item.name == ite.value) {
            temptag = item;
          }
        });
        setDiffcultytype(temptag || {});
      }
      if (ite.field == 'frequency') {
        let tempcli = {};
        Frequency.map((item) => {
          if (item.name == ite.value) {
            tempcli = item;
          }
        });
        setFrequencytype({ ...tempcli });
      }
    });
    getTopicsList().then((res) => {
      setQuestion(res);
    });
    getClients().then((res) => {
      setClientList(res);
    });
    getTags().then((res) => {
      setTagList(res.tags);
    });
  }, [searchFlag]);
  useUpdateEffect(() => {
    const temp = SearchList;
    const a = [...SearchList.criteria];
    const tempb = a.filter((ite) => {
      return !(ite.value == '' || (!ite.value && ite.values.length == 0));
    });
    tempb.push({
      field: 'category',
      value: '2',
      values: [],
      operand: 'and',
    });
    temp.criteria = tempb;
    getQuestionList(temp);
  }, [SearchList]);

  useUpdateEffect(() => {
    const tempB = { ...SearchList };
    const a = [...SearchList.criteria];
    const temp = a.filter((ite) => {
      let filterField = ['tags', 'clients', 'name'];
      // 若clearall时清空了diffculty和frequency
      if (!diffcultytype?.name && !frequencytype?.name) {
        // 那么此时把SearchList中的diffculty和frequency也一并清除
        filterField = filterField.concat(['difficulty', 'frequency']);
      }
      return !filterField.includes(ite.field);
    });
    tempB.criteria = [...temp, ...debouncedValue];
    tempB.pageNum = 0;
    setSearchList({ ...tempB });
  }, [debouncedValue]);

  const questionDetail = (id: string, index: number) => {
    const QuestionSearch = { ...SearchList, index: index };
    dispatch({
      type: 'Search/updateData',
      payload: QuestionSearch,
    });
    history.push(`/coding/${id}`);
  };

  const sortTitle = (field: string) => {
    const tempB = { ...SearchList };
    let orderflag = 'asc';
    if (SearchList.sortCriteria.field == field) {
      if (SearchList.sortCriteria.order == 'asc') {
        orderflag = 'desc';
      } else if (SearchList.sortCriteria.order == 'desc') {
        orderflag = '';
      } else {
        orderflag = 'asc';
      }
    } else {
      orderflag = 'asc';
    }
    const sortCriteria = {
      field,
      order: orderflag,
    };
    tempB.sortCriteria = sortCriteria;
    setSearchList({ ...tempB });
  };
  const renderShowIcon = (field: string) => {
    if (SearchList.sortCriteria.field == field) {
      if (SearchList.sortCriteria.order == 'asc') {
        return <ArrowUpOutlined />;
      } else if (SearchList.sortCriteria.order == 'desc') {
        return <ArrowDownOutlined />;
      } else {
        return (
          <span className="hoverIcon">
            {' '}
            <ArrowUpOutlined />{' '}
          </span>
        );
      }
    } else {
      return (
        <span className="hoverIcon">
          {' '}
          <ArrowUpOutlined />{' '}
        </span>
      );
    }
  };
  const deleteQuestion = (id: string) => {
    Modal.confirm({
      title: 'Delete Coding Puzzle',
      content: (
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, lineHeight: '26px', margin: '16px 0' }}>
            All data associated with this puzzle will be deleted as well.
          </p>
          <p>Please confirm before deleting a Coding puzzle entry as it is not reversible.</p>
        </div>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, style: { borderRadius: 3 } },
      cancelButtonProps: { style: { borderRadius: 3 } },
      onOk() {
        return removeQuesiton({ questionId: id }).then(() => {
          const refreshParam = SearchList;
          if (SearchDataList?.length === 1) {
            refreshParam.pageNum = SearchList.pageNum ? SearchList.pageNum - 1 : 0;
            setSearchList(refreshParam);
          }
          getQuestionList(refreshParam);
          message.success('delete Success!');
        });
      },
      icon: <IconFont type="icon-a-iconerror" style={{ color: '#F14D4F' }} />,
      width: 600,
      centered: true,
    });
  };
  const editQuestion = (id: string, name: string) => {
    history.push(`/coding/coder?questionId=${id}&questionName=${name}`);
  };

  const renderMenu = (item: SearchData) => {
    const menuItems = [
      {
        label: (
          <a onClick={() => editQuestion(item.questionId, item.name)}>
            <IconFont type="icon-edit-line" /> Edit
          </a>
        ),
        key: 'edit',
      },
      {
        label: (
          <a onClick={() => deleteQuestion(item.questionId)}>
            <IconFont type="icon-delete-bin-line" /> Delete
          </a>
        ),
        key: 'delete',
      },
    ];
    return <Menu items={menuItems} />;
  };
  const columns: ColumnsType<SearchData> = [
    {
      title: (
        <div className="title-Sort" onClick={() => sortTitle('sequenceNumber')}>
          Title {renderShowIcon('sequenceNumber')}{' '}
        </div>
      ),
      dataIndex: 'name',
      width: '30%',
      render: (text, item, index) => (
        <div className="columns-title" onClick={() => questionDetail(item.questionId, index)}>
          {text}
        </div>
      ),
      // sorter: (a, b) => {
      //   if (a < b) {
      //     return -1;
      //   } else {
      //     return 1;
      //   }
      // },
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (textm, record) => (
        <div className="columns-tags">
          {/* <TagShow list={textm} /> */}
          <Tooltip title={textm.join(', ')} placement="topLeft">
            {textm?.map((item: any) => (
              <span key={item + record.questionId} className="tag-item">
                {item}
              </span>
            ))}
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'clients',
      render: (text) => (
        <div className="columns-Company">
          <Tooltip title={text.join(', ')} placement="topLeft">
            {text.join(', ')}
          </Tooltip>
        </div>
      ),
    },
    {
      title: (
        <div onClick={() => sortTitle('difficulty')} className="title-Sort">
          Difficulty {renderShowIcon('difficulty')}
        </div>
      ),
      dataIndex: 'difficulty',
      width: 150,
      render: (text) => {
        let color = '#8FCE28';

        switch (text) {
          case 'Easy':
            color = '#8FCE28';
            break;
          case 'Medium':
            color = '#FFB121';
            break;
          case 'Hard':
            color = '#F67C6B';
            break;
        }
        return <div style={{ color: color, fontSize: 18, fontWeight: 500 }}>{text}</div>;
      },
      // sorter: (a, b) => {
      //   let tempa = '0';
      //   let tempb = '0';
      //   switch (a.difficulty) {
      //     case 'Easy':
      //       tempa = '0';
      //       break;
      //     case 'Medium':
      //       tempa = '1';
      //       break;
      //     case 'Hard':
      //       tempa = '2';
      //       break;
      //   }
      //   switch (b.difficulty) {
      //     case 'Easy':
      //       tempb = '0';
      //       break;
      //     case 'Medium':
      //       tempb = '1';
      //       break;
      //     case 'Hard':
      //       tempb = '2';
      //       break;
      //   }
      //   if (tempa < tempb) {
      //     return -1;
      //   } else {
      //     return 1;
      //   }
      // },
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Pass Rate',
      dataIndex: 'passRate',
      width: 150,
      render: (text) => {
        return <div>{Number.isFinite(text) ? `${roundingOff(text, 2)}%` : 'na'}</div>;
      },
    },
    {
      title: (
        <div
          style={{ textAlign: 'center' }}
          onClick={() => sortTitle('frequency')}
          className="title-Sort"
        >
          Frequency {renderShowIcon('frequency')}
        </div>
      ),
      dataIndex: 'frequency',
      width: 150,
      render: (text) => {
        let Icon = Low;
        Frequency.map((ite) => {
          if (ite.name == text) {
            Icon = ite.Icon;
          }
        });
        return (
          <div className="colums-frequency">
            <img src={Icon} width={20} />
          </div>
        );
      },
    },
    {
      title: 'Actions',
      dataIndex: '',
      render: (text, i) => (
        <Dropdown overlay={renderMenu(i)} trigger={['click']} placement="bottomRight">
          <span style={{ marginLeft: 20 }} onClick={(e) => e.preventDefault()}>
            <MoreOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
          </span>
        </Dropdown>
      ),
    },
  ];
  const searchMap = (data: criteriaObj) => {
    const temp = SearchList;
    SearchList.criteria.map((ite, index) => {
      if (ite.field == data.field) {
        temp.criteria.splice(index, 1);
      }
    });
    temp.criteria.push(data);
    temp.pageNum = 0;
    setSearchList({ ...temp });
  };
  const onChangeSearchList = (data: criteriaObj) => {
    const temp = inputvalue;
    temp?.map((ite, index) => {
      if (ite.field == data.field) {
        temp.splice(index, 1);
      }
    });
    temp.push(data);
    setInputValue([...temp]);
  };
  const onChangeKeyWord = (e: string) => {
    const Keyword = {
      field: 'name',
      value: e,
      values: [],
      operand: 'and',
    };
    onChangeSearchList(Keyword);
  };

  const onChangeSearch = (type: string, e: string) => {
    if (type == 'difficulty') {
      let temptag = {};
      diffcultyList.map((item) => {
        if (item.name == e) {
          temptag = item;
        }
      });
      setDiffcultytype({ ...temptag });
    }
    if (type == 'frequency') {
      let tempcli = {};
      Frequency.map((item) => {
        if (item.name == e) {
          tempcli = item;
        }
      });
      setFrequencytype({ ...tempcli });
    }
    const temp = {
      field: type,
      value: e,
      values: [],
      operand: 'and',
    };
    searchMap(temp);
  };
  const onChangeTag = (list: string[], label: string) => {
    if (label === 'Tags') {
      const tag = {
        field: 'tags',
        operand: 'and',
        value: null,
        values: list,
      };
      setTagSearchType(list);
      onChangeSearchList(tag);
    } else {
      const cli = {
        field: 'clients',
        operand: 'and',
        value: null,
        values: list,
      };
      setCliSearchType(list);
      onChangeSearchList(cli);
    }
  };
  const deleteTag = (type: string, value: number) => {
    if (type == 'tag') {
      const temptag = tagSearchType;
      temptag?.splice(value, 1);
      setTagSearchType([...temptag]);
      const tag = {
        field: 'tags',
        operand: 'and',
        value: null,
        values: temptag,
      };
      onChangeSearchList(tag);
    }
    if (type == 'cli') {
      const tempcli = cliSearchType;
      tempcli?.splice(value, 1);
      const cli = {
        field: 'clients',
        operand: 'and',
        value: null,
        values: tempcli,
      };
      onChangeSearchList(cli);
      setCliSearchType([...tempcli]);
    }
  };
  const deleteSelect = (type: string) => {
    if (type == 'difficulty') {
      setDiffcultytype({});
    }
    if (type == 'frequency') {
      setFrequencytype({});
    }
    const temp = {
      field: type,
      value: '',
      values: [],
      operand: 'and',
    };
    searchMap(temp);
  };
  const searchSlect = (key: string, label: string) => {
    if (!key || key == '') {
      getTags().then((res: any) => {
        setTagList(res.tags);
      });
      getClients().then((res: any) => {
        setClientList(res);
      });
    } else {
      if (label === 'Tags') {
        getTagsSearch({ term: key }).then((res: any) => {
          setTagList(res.tags);
        });
      } else {
        getClientsSearch({ term: key }).then((res: any) => {
          setClientList(res);
        });
      }
    }
  };
  const onChangePage = (page: number, pageSize: number) => {
    const data = SearchList;
    data.pageNum = page - 1;
    data.pageSize = pageSize;
    setSearchList({ ...data });
  };
  const addNewQuestion = () => {
    history.push(`/coding/add/new`);
  };
  const renderClear = () => {
    if (
      tagSearchType.length > 0 ||
      cliSearchType.length > 0 ||
      JSON.stringify(diffcultytype) != '{}' ||
      JSON.stringify(frequencytype) != '{}'
    ) {
      return (
        <span
          className="Clear_ALl"
          onClick={() => {
            //   deleteSelect('difficulty');
            //   deleteSelect('frequency');
            setDiffcultytype({});
            setFrequencytype({});

            setTagSearchType([]);
            setCliSearchType([]);
            let temp = inputvalue;
            temp = temp?.filter((ite) => {
              if (ite.field == 'tags' || ite.field == 'clients') {
                return;
              }
              return ite;
            });
            setInputValue([...temp]);
          }}
        >
          Clear All <ClearOutlined />
        </span>
      );
    }
  };
  return (
    <div className="codingWrapper">
      <Spin spinning={pageLoading} size="large">
        <div className="codingHeader">
          <IconFont type="icon-a-Iconscode" className="icon" />
          Coding Puzzle
        </div>
        <div className="codingExtraDescription">
          Manage Coding Puzzles for Drill users, you can add new questions, create sample answers,
          and define test cases for all supported languages.
        </div>
        <div className="codingSourceActionBox">
          <Input
            placeholder="search questions"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              setInputSearchValue(e.target.value);
              onChangeKeyWord(e.target.value);
            }}
            value={inputSearchValue}
          />
          <AuButton
            className="codingAddButton"
            prefix={<PlusOutlined />}
            // type="primary"
            onClick={addNewQuestion}
          >
            Add
          </AuButton>
        </div>
        <div className="codingTopics">
          {questiongList && questiongList.length > 0 && (
            <FlexNav
              // label="Filter by Topics"
              list={questiongList}
              prop={{ name: 'topic', id: 'topic' }}
              onChange={(e) => {
                setTopicValue(e);
                onChangeSearch('topic', e);
              }}
              value={topicValue}
            />
          )}
        </div>
        <div className="codingFilterBox">
          <DropDownTag
            list={[
              {
                label: 'Tags',
                list: tagList,
              },
              {
                label: 'Clients',
                list: clientList,
              },
            ]}
            onChange={onChangeTag}
            search={searchSlect}
            value={{ tag: [...tagSearchType], cli: [...cliSearchType] }}
          />
          <DropDownSelect
            list={diffcultyList}
            label="Difficulty"
            onChange={(e) => {
              onChangeSearch('difficulty', e);
            }}
            value={diffcultytype}
          />
          <DropDownSelect
            list={Frequency}
            label="Frequency"
            IconShow={true}
            value={frequencytype}
            onChange={(e) => {
              onChangeSearch('frequency', e);
            }}
          />
        </div>
        <div className="tagShow-nav">
          {tagSearchType.map((ite, index) => {
            return (
              <div className="tagShow-list " key={index}>
                {' '}
                {ite}{' '}
                <CloseOutlined
                  onClick={() => deleteTag('tag', index)}
                  style={{ marginLeft: 5, fontSize: 10, marginBottom: 1 }}
                />
              </div>
            );
          })}
          {cliSearchType.map((ite, index) => {
            return (
              <div className="tagShow-list " key={index}>
                {' '}
                {ite}{' '}
                <CloseOutlined
                  onClick={() => deleteTag('cli', index)}
                  style={{ marginLeft: 5, fontSize: 10, marginBottom: 1 }}
                />
              </div>
            );
          })}
          {/* {renderClear()} */}
          {JSON.stringify(diffcultytype) != '{}' && (
            <div className="tagShow-list " style={{ color: `${diffcultytype?.color}` }}>
              {' '}
              {diffcultytype?.name}{' '}
              <CloseOutlined
                onClick={() => deleteSelect('difficulty')}
                style={{ marginLeft: 5, color: '#0e1e25', fontSize: 10, marginBottom: 1 }}
              />
            </div>
          )}
          {JSON.stringify(frequencytype) != '{}' && (
            <div className="tagShow-list ">
              <img src={frequencytype.Icon} width={20} style={{ marginRight: 3 }} />{' '}
              {frequencytype?.name}{' '}
              <CloseOutlined
                onClick={() => deleteSelect('frequency')}
                style={{ marginLeft: 5, color: '#0e1e25', fontSize: 10, marginBottom: 1 }}
              />
            </div>
          )}
          {renderClear()}
        </div>

        <div className="codingTable">
          <Table
            loading={loading}
            columns={columns}
            rowKey={'questionId'}
            dataSource={SearchDataList}
            pagination={{
              position: ['bottomCenter'],
              size: 'small',
              total,
              showSizeChanger: true,
              onChange: onChangePage,
              current: SearchList.pageNum + 1,
              pageSize: SearchList.pageSize,
              // pageSizeOptions:[5,10,20,50]
            }}
            scroll={{ x: true }}
          />
        </div>
        {showPage && (
          <div className="page422">
            <div className={'subscriptDialog'}>
              <div className="subscriptDialog-hearder">
                Sorry, please subscribe to view this page{' '}
              </div>
              <div className="subscriptDialog-content">
                Please contact your administrator to request for the access to this page.
              </div>
              <img src={Page422error} />
            </div>
          </div>
        )}
      </Spin>
    </div>
  );
};

// export default Question;

export default connect(({ Search }: { Search: SearchCodingModelState }) => ({
  moduleSearchList: Search.data,
}))(Question);
