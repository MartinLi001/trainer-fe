import React, { useState, useEffect, useRef } from 'react';
import { QuestionList, getQuestionDetail } from '@/services/question';
import type { DetailValueType, SearchData, SearchType } from './typeList/index';
import style from './index.less';
import { useParams } from 'umi';
import Low from '@/assets/Low.svg';
import High from '@/assets/High.svg';
import TagShow from '../../components/TagShow';
import Medium from '@/assets/Medium.svg';
import SeeButton from '@/components/SeeButton';
import { Skeleton, Spin } from 'antd';
import CardTitle from '@/components/CardTitle';
// import PageHeader from '@/components/PageHeader';
import Quill from '@/components/Quill';
import TableList from './components/tableList';
// import { DownloadOutlined } from '@ant-design/icons';
import { Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
// import { download } from '@/utils';
import IconFont from '@/components/IconFont';
// import ErrorPage from './components/errorPage';
import { useHistory } from 'umi';
import { SearchModelState, connect, Dispatch, ConnectProps, QuestionDetailModelState } from 'umi';
import PageHeader from '@/components/PageHeader';
import { UploadPreviewQues } from '../AddQuestion/components/PreviewBar';

interface QuestionProps extends ConnectProps {
  moduleSearchList: SearchType;
  detailReducersList: Record<string, DetailValueType>;
  dispatch: Dispatch;
}
const diffcultyList = {
  Easy: '#8FCE28',
  Medium: '#FFB121',
  Hard: '#F67C6B',
};
const FrequencyList = {
  Low: Low,
  Medium: Medium,
  High: High,
};
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
const Question: React.FC<QuestionProps> = ({ moduleSearchList, detailReducersList, dispatch }) => {
  const [questionData, setQuestionData] = useState<DetailValueType>({} as DetailValueType);
  const QuillRef = useRef<any>();
  const QuillRefanswer = useRef<any>();
  const params = useParams();
  const [nowQuestionId, setNowQuestionId] = useState<string>((params as any).id);
  const [showAnswerFlag, setShowAnswerFlag] = useState<boolean>(false);
  const [SearchDataList, setSearchDataList] = useState<SearchData[]>([]);
  const [mightList, setMightList] = useState<SearchData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [linkQues, setLinkQues] = useState<SearchData[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const history = useHistory();

  const answerRender = (falg: boolean) => {
    setShowAnswerFlag(!falg);
    if (!falg) {
      QuillRefanswer.current.setContent(questionData.sampleAnswer.renderedContent);
    } else {
      QuillRefanswer.current.setContent();
    }
  };
  const getQuestionList = (data: SearchType) => {
    QuestionList(data)
      .then((res: any) => {
        setMightList(res.questions);
      })
      .finally(() => {});
  };
  const getDetailValues = (questionid: string) => {
    setLoading(true);
    if (detailReducersList[questionid]) {
      const res = detailReducersList[questionid];
      setQuestionData(res);
      answerRender(true);
      setLoading(false);
      QuillRef.current.setContent(res.description.renderedContent);
      const data: SearchType = {
        pageNum: 0,
        pageSize: 8,
        criteria: [],
        sortCriteria: { field: 'frequency', order: 'desc' },
      };
      data.criteria.push({
        field: 'clients',
        operand: 'or',
        value: null,
        values: res.clients,
      });
      getQuestionList(data);
      setLinkQues(res.linkedQuestions || []);
    } else {
      if (questionid) {
        setNowQuestionId(questionid);
        answerRender(true);
        getQuestionDetail(questionid)
          .then((res: DetailValueType) => {
            setQuestionData(res);
            setLoading(false);
            QuillRef.current.setContent(res.description.renderedContent);
            const data: SearchType = {
              pageNum: 0,
              pageSize: 8,
              criteria: [],
              sortCriteria: { field: 'frequency', order: 'desc' },
            };
            data.criteria.push({
              field: 'clients',
              operand: 'or',
              value: null,
              values: res.clients,
            });
            getQuestionList(data);
            setLinkQues(res.linkedQuestions || []);

            const temp = { ...detailReducersList };
            temp[questionid] = res;
            dispatch({
              type: 'Detail/updateData',
              payload: temp,
            });
          })
          .catch((error) => {
            if (error.code == 422) {
              setLoading(false);
            }
          });
      }
    }
  };
  const columnsLink: ColumnsType<SearchData> = [
    {
      title: 'Title',
      dataIndex: 'name',
      width: '30%',
      render: (text, item) => (
        <div className={style.title} onClick={() => getDetailValues(item.questionId)}>
          {text}
        </div>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (textm) => (
        <div className={style.tags}>
          <TagShow list={textm} />
        </div>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'clients',
      render: (text) => (
        <div className={style.Company}>
          <Tooltip title={text.join(', ')} placement="topLeft">
            {text.join(', ')}
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
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
        return <span style={{ color: color, fontSize: 18, fontWeight: 500 }}>{text}</span>;
      },
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      render: (text) => {
        let Icon = Low;
        Frequency.map((ite) => {
          if (ite.name == text) {
            Icon = ite.Icon;
          }
        });
        return (
          <div className={style.frequency}>
            <img src={Icon} width={20} />
          </div>
        );
      },
    },
  ];

  const SearchTableList = (page?: number, pageSizenum?: number) => {
    setPageSize(pageSizenum || 10);
    setTableLoading(true);
    const searchData: SearchType = { ...moduleSearchList };
    searchData.pageNum = (searchData.pageSize * searchData.pageNum) / 10;
    if (searchData.index) {
      searchData.pageNum = searchData.pageNum + Math.ceil(searchData.index / 10) - 1;
    }
    if (page) {
      setPageNum(page - 1);
      searchData.pageNum = page - 1;
    } else {
      setPageNum(searchData.pageNum);
    }
    // if (pageSizenum) {
    // setPageSize(pageSizenum);
    searchData.pageSize = 10;
    // }
    QuestionList(searchData)
      .then((res) => {
        setSearchDataList(res.questions);
        setTotal(res.totalFound);
      })
      .finally(() => {
        setTableLoading(false);
      });
  };
  useEffect(() => {
    getDetailValues(nowQuestionId);
    SearchTableList();
  }, []);

  // const downLoadFile = async (questionId: string, fileId: string, name: string) => {
  //   if (questionId === '') {
  //     return;
  //   }
  //   const ret = await getFile(questionId, fileId);
  //   download(ret, name);
  // };

  const columns: ColumnsType<SearchData> = [
    {
      title: 'Title',
      dataIndex: 'name',
      width: '60%',
      render: (text, item) => (
        <div className={style.tableTitle} onClick={() => getDetailValues(item.questionId)}>
          {questionData.questionId == item.questionId ? (
            <span style={{ color: '#2875D0' }}>{text} </span>
          ) : (
            text
          )}
        </div>
      ),
    },
    {
      title: 'Clients',
      dataIndex: 'clients',
      // width:'40%',
      render: (text, item) => (
        <div className={style.tableClients}>
          <Tooltip title={text} placement="topLeft">
            {questionData.questionId == item.questionId ? (
              <span style={{ color: '#2875D0' }}>{text} </span>
            ) : (
              text
            )}
          </Tooltip>
        </div>
      ),
    },
  ];
  // const goQuestionList = () => {
  //   history.push(`/question?searchFlag=1`);
  // };
  const editQuestion = () => {
    history.push(`/question/questionadd/${questionData?.questionId}`);
  };
  return (
    <Spin spinning={loading}>
      <PageHeader
        items={[
          { name: 'Question Bank', href: '/question?searchFlag=1' },
          { name: questionData?.name },
        ]}
      />

      {/* <div className={style.pageHeader} onClick={() => goQuestionList()}>
        Question Bank
      </div> */}

      <div className={style.questionDetail}>
        <Skeleton active loading={loading} style={{ width: '50%' }} />
        {!loading && (
          <div className={style.questionDetailLeft}>
            <div className={style.questionDetailTitle}>
              <span className={style.TitleShow}> {questionData?.name}</span>
              <img src={FrequencyList[`${questionData?.frequency}`]} style={{ marginLeft: 25 }} />
              <span
                style={{
                  color: diffcultyList[`${questionData?.difficulty}`],
                  borderColor: diffcultyList[`${questionData?.difficulty}`],
                }}
                className={style.diffculty}
              >
                {questionData?.difficulty}
              </span>
              <div className={style.editQuestion} onClick={editQuestion}>
                <IconFont type="icon-edit-line" style={{ marginRight: 5 }} />
                Edit Question
              </div>
            </div>
            <div className={style.topicTabsShow}>
              <div className={style.TagClinkShow}>
                <span className={style.topic}>{questionData?.topic}</span>
                <TagShow list={questionData?.tags} />
              </div>
              {questionData?.clients && (
                <div className={style.Client}>
                  Client: <span className={style.Clients}>{questionData?.clients.join(', ')}</span>
                </div>
              )}
            </div>

            <div className={style.Descirption}>
              <span className={style.DescirptionName}>Descirption</span>
              <Quill
                ref={QuillRef}
                style={{
                  height: 'auto',
                  backgroundColor: '#fff',
                }}
                id={nowQuestionId}
                readOnly
              />
            </div>
            {questionData?.resources && questionData.resources?.length > 0 && (
              <div className={style.downloadFile}>
                <p className={style.downloadTitle}>Attachment:</p>
                <UploadPreviewQues
                  questionId={questionData.questionId}
                  data={questionData.resources || []}
                  downIcon={true}
                />
                {/* {questionData.resources?.map((ite) => {
                  return (
                    <SeeButton
                      icon={<DownloadOutlined />}
                      key={ite.resourceId}
                      type="ghost"
                      style={{ margin: '5px 5px 0' }}
                      onClick={() =>
                        downLoadFile(questionData.questionId, ite.resourceId, ite.name)
                      }
                    >
                      {' '}
                      {ite.name}{' '}
                    </SeeButton>
                  );
                })} */}
              </div>
            )}
            <div className={style.answer}>
              {questionData?.sampleAnswer?.renderedContent &&
                questionData?.sampleAnswer?.renderedContent != '<p><br></p>' && (
                  <span className={style.answerTitle}>Sample Answer</span>
                )}
              {questionData?.sampleAnswer?.renderedContent &&
                questionData?.sampleAnswer?.renderedContent != '<p><br></p>' && (
                  <SeeButton onClick={() => answerRender(showAnswerFlag)}>
                    {showAnswerFlag ? 'Hide' : 'Show'}
                  </SeeButton>
                )}
              <Quill
                ref={QuillRefanswer}
                style={{
                  height: 'auto',
                  backgroundColor: '#fff',
                }}
                id={nowQuestionId}
                readOnly
              />
            </div>
            {linkQues && linkQues.length > 0 && (
              <div className={style.linkQuestion}>
                <span className={style.linkedQuestionsName}>Linked Question</span>
                <Table
                  showHeader={false}
                  columns={columnsLink}
                  rowKey={'questionId'}
                  dataSource={linkQues}
                  pagination={false}
                />
              </div>
            )}
          </div>
        )}

        <div className={style.questionDetailRight}>
          <div className={style.RightAllTable}>
            <CardTitle
              iconFont={<IconFont type="icon-search-line" />}
              title={'Other Search Results'}
            />
            <div className={style.RightTable}>
              <Table
                columns={columns}
                rowKey={'questionId'}
                loading={tableLoading}
                dataSource={SearchDataList}
                pagination={{
                  position: ['bottomCenter'],
                  size: 'small',
                  showSizeChanger: false,
                  total,
                  onChange: SearchTableList,
                  current: pageNum + 1,
                  pageSize: pageSize,
                }}
              />
            </div>
            <div className={style.RightTableList}>
              <CardTitle title={'You might also want to look at ...'} />
              <TableList
                list={mightList}
                FrequencyList={FrequencyList}
                onChange={getDetailValues}
              />
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

// export default Question;

export default connect(
  ({ Search, Detail }: { Search: SearchModelState; Detail: QuestionDetailModelState }) => ({
    moduleSearchList: Search.data,
    detailReducersList: Detail.data,
  }),
)(Question);
