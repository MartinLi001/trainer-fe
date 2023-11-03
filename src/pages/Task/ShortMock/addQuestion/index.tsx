import React, { useState, useEffect } from 'react';
import { Input, Table, Tooltip, Spin, message } from 'antd';
import {
  QuestionList,
  getTopicsList,
  getClients,
  getTags,
  getClientsSearch,
  getTagsSearch,
  getQuestionDetail,
} from '@/services/question';
import type { ListItem } from '@/pages/Question/Componts/FlexNav';
import DropDownSelect, { DropListItem } from '@/pages/Question/Componts/DropDownSelect';
import PageHeader from '@/components/PageHeader';
import type { ColumnsType } from 'antd/es/table';
import DropDownTag from '@/pages/Question/Componts/DropDownTag';
import type {
  criteriaObj,
  TagType,
  ClientsType,
  SearchType,
  SearchData,
} from '@/pages/Question/typeList';
import TagShow from '@/components/TagShow';
import Low from '@/assets/Low.svg';
import High from '@/assets/High.svg';
import Medium from '@/assets/Medium.svg';
import { useDebounce, useRequest, useUpdateEffect } from 'ahooks';
import styles from './index.less';
import { CheckOutlined, CloseOutlined, MenuOutlined, SearchOutlined } from '@ant-design/icons';
// import { useHistory } from 'umi';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import DropDown from './components/DropDown';
import QuestionShow from './components/showQuestion';
import DetailShow from './components/quesDetailShow';
import IconFont from '@/components/IconFont';
import { DetailValueType } from '@/pages/AddQuestion/typeList';
import SeeButton from '@/components/SeeButton';
import { history } from 'umi';
import { MockModelState, Loading, connect, ConnectProps } from 'umi';
import { TaskResponse } from '@/pages/Task/mock/typeList';
import { saveAndDeleteQuestions } from '@/services/question';
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
const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));
interface ShortMockProps extends ConnectProps {
  data: TaskResponse;
}
const Question: React.FC<ShortMockProps> = ({ data: mockData }) => {
  const [tagList, setTagList] = useState<TagType[]>([]);
  const [topicsList, setTopicsList] = useState<ListItem[]>([]);
  const [topicsValue, setTopicsValue] = useState<string>('');
  const [clientList, setClientList] = useState<ClientsType[]>([]);
  const [SearchDataList, setSearchDataList] = useState<SearchData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [total, setTotal] = useState<number>(0);
  const [SearchList, setSearchList] = useState<SearchType>({
    pageNum: 0,
    pageSize: 100,
    criteria: [],
    sortCriteria: { field: 'sequenceNumber', order: 'asc' },
  });
  const [inputvalue, setInputValue] = useState<criteriaObj[]>([]);
  const debouncedValue = useDebounce(inputvalue, { wait: 1000 });
  const [diffcultytype, setDiffcultytype] = useState<DropListItem>({});
  const [frequencytype, setFrequencytype] = useState<DropListItem>({});
  const [tagSearchType, setTagSearchType] = useState<string[]>([]);
  const [cliSearchType, setCliSearchType] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [chooseList, setChooseList] = useState<string[]>([]);
  const [chooseQuestion, setChooseQuestion] = useState<DetailValueType[]>([]);
  const [nowQuestion, setNowQuestion] = useState<DetailValueType>();
  const [showQuestionVisible, setShowQuestionVisible] = useState<boolean>(false);
  const [detailShowVisible, setDetailShowVisible] = useState<boolean>(false);
  const [detailQuestion, setDetailQuestion] = useState<DetailValueType>();
  const { loading: updateQuestionsLoading, runAsync: updateQuestions } = useRequest(
    saveAndDeleteQuestions,
    {
      manual: true,
    },
  );
  // const history = useHistory();
  const getQuestionList = (data: SearchType) => {
    console.log(
      '%cindex.tsx line:91 topicsList',
      'color: #007acc;',
      topicsList,
      chooseList,
      chooseQuestion,
    );
    if (!pageLoading) setLoading(true);
    QuestionList(data)
      .then((res: any) => {
        setSearchDataList(res.questions);
        // setTotal(res.totalFound);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        setPageLoading(false);
      });
  };
  useEffect(() => {
    async function fetch() {
      const toplist = await getTopicsList();
      setTopicsList(toplist);
      const talist = await getTags();
      const cllist = await getClients();
      getQuestionList(SearchList);
      setTagList(talist.tags);
      setClientList(cllist);
    }
    console.log('%cindex.tsx line:140 data', 'color: #007acc;', mockData);
    setChooseList(mockData.questionOrders);

    fetch();
  }, []);
  useUpdateEffect(() => {
    const temp = SearchList;
    const a = [...SearchList.criteria];
    const tempb = a.filter((ite) => {
      return !(ite.value == '' || (!ite.value && ite.values.length == 0));
    });
    temp.criteria = tempb;
    getQuestionList(temp);
  }, [SearchList]);

  useUpdateEffect(() => {
    const tempB = { ...SearchList };
    const a = [...SearchList.criteria];
    const temp = a.filter((ite) => {
      return !['tags', 'clients', 'name'].includes(ite.field);
    });
    tempB.criteria = [...temp, ...debouncedValue];
    setSearchList({ ...tempB });
  }, [debouncedValue]);

  const onChoose = (id: string, flag: boolean) => {
    setLoading(true);
    getQuestionDetail(id)
      .then((res: DetailValueType) => {
        let temp = [...chooseList];
        let tempP = [...chooseQuestion];
        res.linkedQuestions = [];
        res.followUps = [];
        res.weight = 1;
        if (res.linkedQuestionIds && res.linkedQuestionIds.length > 0) {
          res.linkedQuestionIds.map((ite) => {
            getQuestionDetail(ite).then((item) => {
              res.linkedQuestions?.push(item);
              res.followUps?.push(item);
            });
          });
        }
        if (!flag) {
          temp.push(res.questionId);
          tempP.push(res);
        } else {
          temp = temp.filter((ite) => {
            return ite != id;
          });
          tempP = tempP.filter((ite) => {
            return ite.questionId != id;
          });
        }
        setChooseList([...temp]);
        setChooseQuestion([...tempP]);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onSaveChange = (value: DetailValueType) => {
    const tempP = [...chooseQuestion];
    tempP.map((item, i) => {
      if (item.questionId == value.questionId) {
        tempP.splice(i, 1, value);
      }
    });
    setChooseQuestion([...tempP]);
    setNowQuestion(value);
  };

  const showDetailQuestion = (id: string) => {
    getQuestionDetail(id).then((res: DetailValueType) => {
      res.linkedQuestions = [];
      res.weight = 1;
      if (res.linkedQuestionIds && res.linkedQuestionIds.length > 0) {
        const temp: Promise<DetailValueType>[] = [];
        res.linkedQuestionIds.map((ite) => {
          temp.push(getQuestionDetail(ite));
        });
        Promise.all(temp).then((result) => {
          setDetailQuestion({
            ...res,
            linkedQuestions: result,
          });
        });
      } else {
        setDetailQuestion({ ...res });
      }
      setDetailShowVisible(true);
    });
  };

  const columns: ColumnsType<SearchData> = [
    {
      title: 'Title',
      dataIndex: 'name',
      width: '40%',
      render: (text, item) => (
        <div className={styles.columnsTitle} onClick={() => showDetailQuestion(item.questionId)}>
          {text}
        </div>
      ),
    },
    {
      title: 'topic',
      dataIndex: 'topic',
      render: (textm, item) => (
        <div className={styles.columnsTags} onClick={() => showDetailQuestion(item.questionId)}>
          <TagShow list={[textm]} />
        </div>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'clients',
      render: (text, item) => (
        <div className={styles.columnsCompany} onClick={() => showDetailQuestion(item.questionId)}>
          <Tooltip title={text} placement="topLeft">
            {text}
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      render: (text, item) => {
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
        return (
          <span
            className={styles.opint}
            style={{ color: color, fontSize: 14, fontWeight: 500 }}
            onClick={() => showDetailQuestion(item.questionId)}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      render: (text, item) => {
        let Icon = Low;
        Frequency.map((ite) => {
          if (ite.name == text) {
            Icon = ite.Icon;
          }
        });
        return (
          <span className={styles.opint} onClick={() => showDetailQuestion(item.questionId)}>
            {' '}
            <img src={Icon} width={20} />
          </span>
        );
      },
    },
    {
      dataIndex: '',
      render: (text, i) => (
        <span>
          {chooseList.includes(i.questionId) ? (
            <span
              style={{
                backgroundColor: '#E9F5D4',
                borderRadius: 100,
                padding: 8,
                width: 32,
                height: 32,
              }}
            >
              <CheckOutlined style={{ fontWeight: 800, fontSize: 16, color: '#76AC1E' }} />
            </span>
          ) : (
            <span
              onClick={() => onChoose(i.questionId, chooseList.includes(i.questionId))}
              style={{
                backgroundColor: '#F8F9FC',
                borderRadius: 100,
                padding: 7,
                cursor: 'pointer',
              }}
            >
              <IconFont type="icon-add-line" style={{ fontWeight: 800, fontSize: 18 }} />
            </span>
          )}
        </span>
      ),
    },
  ];
  const DragHandle = SortableHandle(() => (
    <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
  ));
  const Choosecolumns: ColumnsType<DetailValueType> = [
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      // @ts-ignore
      render: () => <DragHandle />,
    },
    {
      title: 'Title',
      dataIndex: 'name',
      render: (text, i) => (
        <div className={styles.columnsTitle}>
          <span
            className={styles.columnsTitleText}
            onClick={() => {
              setNowQuestion(i);
              setShowQuestionVisible(true);
            }}
          >
            {text}
          </span>{' '}
          <IconFont
            type="icon-delete-bin-line"
            className={styles.Icon}
            onClick={() => onChoose(i.questionId, true)}
          />
        </div>
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

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(chooseQuestion.slice(), oldIndex, newIndex).filter(
        (el: DetailValueType) => !!el,
      );
      console.log('Sorted items: ', newData);
      setChooseQuestion(newData);
    }
  };
  const DraggableContainer = (props: SortableContainerProps) => (
    // @ts-ignore
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = chooseQuestion.findIndex((x) => x.questionId === restProps['data-row-key']);
    // @ts-ignore
    return <SortableItem index={index} {...restProps} />;
  };
  const saveAndQuestions = () => {
    const submitQuestion = {
      batchId: mockData.batchId,
      taskId: mockData.taskId,
      questionOrders: [
        ...mockData.questionOrders,
        ...chooseQuestion.map((ite) => {
          return ite.questionId;
        }),
      ],
      questions: [...chooseQuestion],
      removedQuestionIds: null,
    };
    updateQuestions(submitQuestion).then(() => {
      message.success('add Success!');
      history.goBack();
    });
  };
  return (
    <>
      <Spin spinning={pageLoading} size="large">
        <PageHeader
          items={[
            ...JSON.parse(localStorage.getItem('pageHeaderItems') ?? '[]'),
            {
              name: 'Add Question',
            },
          ]}
        />
        <div className={styles.chooseQuestion}>
          <div className={styles.QuestionList}>
            <div className={styles.QuestionListTag}>
              <div className={styles.QuestionListTagSearch}>
                <div className={styles.downList}>
                  <DropDown
                    list={topicsList}
                    value={topicsValue}
                    onChange={(e) => {
                      setTopicsValue(e);
                      onChangeSearch('topic', e);
                    }}
                  />
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
                </div>
                <div className={styles.downList}>
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
              </div>
              <div className={styles.QuestionListSearch}>
                <span style={{ width: 240, marginBottom: 4 }}> Enter keyword to search </span>
                <Input
                  placeholder="Enter here..."
                  style={{ maxWidth: 240 }}
                  prefix={<SearchOutlined />}
                  onChange={(e) => onChangeKeyWord(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.tagShow}>
              <div className={styles.tagShowNav}>
                {topicsValue && (
                  <div className={styles.tagShowList} key={topicsValue}>
                    {topicsValue}
                    <CloseOutlined
                      onClick={() => {
                        setTopicsValue('');
                        onChangeSearch('topic', '');
                      }}
                      style={{ marginLeft: 5, fontSize: 10, marginBottom: 1 }}
                    />
                  </div>
                )}
                {tagSearchType.map((ite, index) => {
                  return (
                    <div className={styles.tagShowList} key={index}>
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
                    <div className={styles.tagShowList} key={index}>
                      {' '}
                      {ite}{' '}
                      <CloseOutlined
                        onClick={() => deleteTag('cli', index)}
                        style={{ marginLeft: 5, fontSize: 10, marginBottom: 1 }}
                      />
                    </div>
                  );
                })}
                {JSON.stringify(diffcultytype) != '{}' && (
                  <div className={styles.tagShowList} style={{ color: `${diffcultytype?.color}` }}>
                    {' '}
                    {diffcultytype?.name}{' '}
                    <CloseOutlined
                      onClick={() => deleteSelect('difficulty')}
                      style={{ marginLeft: 5, color: '#0e1e25', fontSize: 10, marginBottom: 1 }}
                    />
                  </div>
                )}
                {JSON.stringify(frequencytype) != '{}' && (
                  <div className={styles.tagShowList}>
                    <img src={frequencytype.Icon} width={20} style={{ marginRight: 3 }} />{' '}
                    {frequencytype?.name}{' '}
                    <CloseOutlined
                      onClick={() => deleteSelect('frequency')}
                      style={{ marginLeft: 5, color: '#0e1e25', fontSize: 10, marginBottom: 1 }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.questionTable}>
              <Table
                loading={loading}
                showHeader={false}
                columns={columns}
                rowKey={'questionId'}
                dataSource={SearchDataList}
                pagination={false}
              />
            </div>
          </div>

          <div className={styles.chooseList}>
            <span className={styles.chooseNumber}>
              {' '}
              {chooseList.length - (mockData.questionOrders.length || 0)} selected{' '}
            </span>
            <div className={styles.chooseTable}>
              <Table
                pagination={false}
                dataSource={chooseQuestion}
                showHeader={false}
                columns={Choosecolumns}
                rowKey={'questionId'}
                components={{
                  body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow,
                  },
                }}
              />
            </div>

            <div className={styles.saveButton}>
              <SeeButton style={{ marginRight: 10 }} onClick={() => history.goBack()}>
                Cancel
              </SeeButton>
              <SeeButton
                type="primary"
                onClick={() => saveAndQuestions()}
                loading={updateQuestionsLoading}
                disabled={chooseList.length - (mockData.questionOrders.length || 0) == 0}
              >
                Add Questions
              </SeeButton>
            </div>
          </div>
          {showQuestionVisible && (
            <QuestionShow
              visible={showQuestionVisible}
              question={nowQuestion}
              onClose={() => {
                setShowQuestionVisible(false);
              }}
              onSave={(value) => onSaveChange(value)}
            />
          )}
          {detailShowVisible && (
            <DetailShow
              visible={detailShowVisible}
              question={detailQuestion}
              onClose={() => {
                setDetailShowVisible(false);
              }}
            />
          )}
        </div>
      </Spin>
    </>
  );
};

// export default Question;
export default connect(({ Mock, loading }: { Mock: MockModelState; loading: Loading }) => ({
  ...Mock,
  loading: loading.models.Mock,
}))(Question);
