import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { getKpiMock, getKpiProjects } from '@/services/kpi';
import CardTitle from '@/components/CardTitle';
import {
  commentsType,
  DetailShowType,
  mocksType,
  personType,
  projectsType,
  questionType,
  taskType,
} from '../../typeList';
import { message, Modal, Spin } from 'antd';
import QuestionShow from '../questionShow';
import CommentList from '../CommentList';
import { commentUpdate, commentDelete, mockCommentUpdate } from '@/services/assignment';
import { removeGroupComment, updateGroupComment } from '@/services/project';
import ShowCommentList from '../showComment';
import TextArea from 'antd/lib/input/TextArea';
import SeeButton from '@/components/SeeButton';
import Empty from '@/components/KpiEmpty';

interface Props {
  list: string[];
  batchId: string;
  traineeId: string;
  type: string;
}

export default function DetailShow({ list, type, batchId, traineeId }: Props) {
  const [detailData, setDetailData] = useState<DetailShowType>({} as DetailShowType);
  const [nowTask, setNowTask] = useState<number>(0);
  const [nowTaskValue, setNowTaskValue] = useState<mocksType | projectsType>(
    {} as mocksType | projectsType,
  );
  // const userId = localStorage.getItem('userId') as string;
  const [nowMockData, setNowMockData] = useState<taskType>({} as taskType);
  const [nowMock, setNowMock] = useState<string>('');
  const [nowQuestion, setNowQuestion] = useState<string>();
  const [nowQuestionData, setNowQuestionData] = useState<questionType>({} as questionType);
  const [loading, setLoading] = useState<boolean>(false);
  const [personMap, setPersonMap] = useState<Record<string, personType>>({});
  const [nowProjectComment, setNowProjectComment] = useState<commentsType>({} as commentsType);
  const [content, setContent] = useState<string>('');

  const chooseMock = (index: string, ite: taskType) => {
    setNowMock(index);
    setNowMockData(ite);
    if (Object.getOwnPropertyNames(ite).length == 0) {
      setNowQuestion('');
      setNowQuestionData({} as questionType);
    } else {
      setNowQuestion(ite.questionDetails[0]?.questionId || '');
      setNowQuestionData(ite.questionDetails[0] || {});
    }
  };
  const chooseTask = (task: mocksType | projectsType, index: number) => {
    setNowTask(index);
    setNowTaskValue(task);
    setNowProjectComment({} as commentsType);
    setContent('');
    if (type == 'Mock') {
      if ((task as mocksType).codingMock.length > 0) {
        chooseMock('c0', (task as mocksType).codingMock[0]);
      } else if ((task as mocksType).shortAnswerMock.length > 0) {
        chooseMock('s0', (task as mocksType).shortAnswerMock[0]);
      } else {
        chooseMock('xxx', {} as taskType);
      }
    }
  };

  const getDetail = () => {
    setLoading(true);
    if (type == 'Mock') {
      const search = {
        batchId,
        traineeId,
        tasksList: [...list],
      };
      getKpiMock(search).then((res) => {
        res.data = res.mocks;
        setDetailData(res);
        setLoading(false);
        chooseTask(res.mocks[0], 0);
        setPersonMap(res.personMap);
      });
    } else {
      const search = {
        batchId,
        traineeId,
        tasks: [...list],
      };
      getKpiProjects(search).then((res) => {
        res.data = res.projects;
        setDetailData(res);
        setLoading(false);
        chooseTask(res.projects[0], 0);
        setPersonMap(res.personMap);
      });
    }
  };
  useEffect(() => {
    if (list) getDetail();
  }, [list]);

  const editProjectComment = (data: commentsType, typeEdit: string) => {
    const temp = { ...detailData };
    const tempTask = temp.data[nowTask] as projectsType;
    if (typeEdit === 'delete') {
      tempTask.comments = (tempTask.comments || []).filter((ite) => {
        return ite.commentId != data.commentId;
      });
    } else {
      tempTask.comments = (tempTask.comments || []).map((ite) => {
        if (ite.commentId == data.commentId) {
          return data;
        } else {
          return ite;
        }
      });
    }
    setNowTaskValue({ ...tempTask });
    temp.data[nowTask] = tempTask;
    setDetailData({ ...temp });
    setNowProjectComment({} as commentsType);
    setContent('');
  };

  const editComment = (value: string, data: commentsType, taskId: string) => {
    data.content = value;
    if (data.projectGroupId) {
      const subData = {
        batchId,
        taskId,
        userId: traineeId,
        content: value,
        commentId: data.commentId,
        projectGroupId: data.projectGroupId,
      };
      updateGroupComment(subData)
        .then((res) => {
          message.success('edit success');
          const newData = {
            ...res.feedback,
            projectGroupId: data.projectGroupId,
          };
          editProjectComment(newData, 'edit');
        })
        .catch(() => {
          message.error('Failed to update comment');
        });
    } else {
      const subData = {
        batchId,
        taskId,
        userId: traineeId,
        content: value,
        commentId: data.commentId,
      };
      commentUpdate(subData)
        .then(() => {
          editProjectComment(data, 'edit');
          message.success('edit success');
        })
        .catch(() => {
          message.error('Failed to update comment');
        });
    }
  };
  const deleteComment = (data: commentsType, taskId: string) => {
    if (data.projectGroupId) {
      const subData = {
        batchId,
        taskId,
        userId: traineeId,
        commentId: data.commentId,
        projectGroupId: data.projectGroupId,
      };
      Modal.confirm({
        title: 'Delete Comment',
        content: (
          <div>
            <p style={{ fontSize: 16, fontWeight: 600, lineHeight: '26px' }}>
              Are you sure of deleting the comment?
            </p>
            <p>This action CANNOT be undone.</p>
          </div>
        ),
        okText: 'Delete',
        cancelText: 'Cancel',
        okButtonProps: { danger: true },
        onOk() {
          // editProjectComment(data,'delete')
          removeGroupComment(subData).then(() => {
            message.success('delete success');
            editProjectComment(data, 'delete');
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      const subData = {
        batchId,
        taskId,
        userId: traineeId,
        commentId: data.commentId,
      };
      Modal.confirm({
        title: 'Delete Comment',
        content: (
          <div>
            <p style={{ fontSize: 16, fontWeight: 600, lineHeight: '26px' }}>
              Are you sure of deleting the comment?
            </p>
            <p>This action CANNOT be undone.</p>
          </div>
        ),
        okText: 'Delete',
        cancelText: 'Cancel',
        okButtonProps: { danger: true },
        onOk() {
          commentDelete(subData).then(() => {
            message.success('delete success');
            editProjectComment(data, 'delete');
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };
  const onChangValue = (e: any) => {
    setContent(e.target.value);
  };

  const editMockcomment = (data: commentsType) => {
    const temp = { ...detailData };
    const tempTask = temp.data[nowTask] as mocksType;
    const tempQuestion = { ...nowQuestionData };
    tempQuestion.comment = data;
    setNowQuestionData({ ...tempQuestion });
    if (nowMock.slice(0, 1) == 's') {
      tempTask.shortAnswerMock[nowMock.slice(1)].questionDetails[nowQuestion] = tempQuestion;
    } else {
      tempTask.codingMock[nowMock.slice(1)].questionDetails[nowQuestion] = tempQuestion;
    }
    temp.data[nowTask] = tempTask;
    setDetailData({ ...temp });
  };
  const editCommentMock = (value: string, data: commentsType, taskId: string) => {
    data.content = value;
    const subData = {
      batchId,
      taskId,
      questionId: nowQuestionData.questionId,
      traineeId,
      content: value,
      commentId: data.commentId,
    };
    mockCommentUpdate(subData)
      .then(() => {
        message.success('edit success');
        editMockcomment(data);
      })
      .catch(() => {
        message.error('Failed to update comment');
      });
  };
  const deleteCommentMock = (data: commentsType, taskId: string) => {
    const subData = {
      batchId,
      taskId,
      traineeId,
      content: '',
      questionId: nowQuestionData.questionId,
      commentId: data.commentId,
    };
    Modal.confirm({
      title: 'Delete Comment',
      content: (
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, lineHeight: '26px' }}>
            Are you sure of deleting the comment?
          </p>
          <p>This action CANNOT be undone.</p>
        </div>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk() {
        mockCommentUpdate(subData).then(() => {
          message.success('delete success');
          editMockcomment({ ...data, content: '' });
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <div className={styles.DetailShow}>
      <Spin spinning={loading}>
        <CardTitle title={`${type} `} />
        <div className={styles.DetailShowContent}>
          {list && list?.length > 0 ? (
            <div className={styles.detailAll}>
              <div className={styles.DetailShowTop}>
                <div className={styles.DetailShowTopLeft}>
                  {(detailData.data || []).map((ite, index) => {
                    return (
                      <div
                        className={styles.showSpan + ` ${nowTask == index ? styles.spanNow : ''}`}
                        onClick={() => {
                          chooseTask(ite, index);
                        }}
                      >
                        {index + 1}
                      </div>
                    );
                  })}
                  <span className={styles.topName}>
                    {type === 'Mock'
                      ? nowMockData?.taskName
                      : (nowTaskValue as projectsType)?.taskName}
                  </span>
                </div>
                {type == 'Mock' && (
                  <div className={styles.mockShowList}>
                    {((nowTaskValue as mocksType)?.codingMock || []).map((item, i) => {
                      return (
                        <div
                          className={
                            styles.showSpan + ` ${nowMock == `c${i}` ? styles.spanNow : ''}`
                          }
                          onClick={() => {
                            chooseMock(`c${i}`, item);
                          }}
                        >
                          {' '}
                          code{i + 1}
                        </div>
                      );
                    })}
                    {((nowTaskValue as mocksType)?.shortAnswerMock || []).map((item, i) => {
                      return (
                        <div
                          className={
                            styles.showSpan + ` ${nowMock == `s${i}` ? styles.spanNow : ''}`
                          }
                          onClick={() => {
                            chooseMock(`s${i}`, item);
                          }}
                        >
                          {' '}
                          short{i + 1}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {type == 'Mock' && (
                <div className={styles.questionShow}>
                  Question
                  {(nowMockData?.questionDetails || []).map((ite, i) => {
                    return (
                      <div
                        className={
                          styles.quesiotnChoose +
                          ` ${nowQuestion == ite.questionId ? styles.quesiotnChooseNow : ''}`
                        }
                        onClick={() => {
                          setNowQuestion(ite.questionId);
                          setNowQuestionData(ite);
                        }}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className={styles.Score}>
                {' '}
                Score :{' '}
                <span className={styles.scoredetail}>
                  {(nowTaskValue as projectsType)?.score ?? nowQuestionData.score ?? '0'}
                </span>
              </div>

              <div className={styles.detailConent}>
                <div className={styles.showLeft}>
                  {type == 'Mock' ? (
                    <div className={styles.mock}>
                      <QuestionShow question={nowQuestionData} taskId={nowMockData.taskId} />
                    </div>
                  ) : (
                    <div className={styles.projects}>
                      {(nowTaskValue as projectsType)?.isGroupProject ? (
                        <CommentList
                          dataList={(nowTaskValue as projectsType)?.traineeComments ?? []}
                          titleText={'Trainees’ Comment'}
                          addable={false}
                          editComment={(value: string, data: commentsType) =>
                            editComment(value, data, (nowTaskValue as projectsType).taskId)
                          }
                          deleteComment={(data: commentsType) =>
                            deleteComment(data, (nowTaskValue as projectsType).taskId)
                          }
                          peopleList={personMap}
                        />
                      ) : (
                        <ShowCommentList
                          dataList={(nowTaskValue as projectsType)?.comments ?? []}
                          titleText={'Individual Project Comments'}
                          peopleList={personMap}
                          editComment={(e) => {
                            setNowProjectComment(e);
                            setContent(e.content);
                          }}
                          editKey={nowProjectComment?.commentId ?? ''}
                          deleteComment={(data: commentsType) =>
                            deleteComment(data, (nowTaskValue as projectsType).taskId)
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className={styles.showRight}>
                  {(nowTaskValue as projectsType)?.isGroupProject ? (
                    <CommentList
                      dataList={(nowTaskValue as projectsType)?.trainerComments ?? []}
                      titleText={'Trainers’ Comment'}
                      addable={false}
                      editComment={(value: string, data: commentsType) =>
                        editComment(value, data, (nowTaskValue as projectsType).taskId)
                      }
                      deleteComment={(data: commentsType) =>
                        deleteComment(data, (nowTaskValue as projectsType).taskId)
                      }
                      peopleList={personMap}
                    />
                  ) : (
                    <>
                      {type == 'Project' && nowProjectComment?.commentId && (
                        <div className={styles.editComment}>
                          <div className={styles.EditTitle}> {`Edit Comment`}</div>
                          <TextArea
                            // defaultValue={nowProjectComment.content}
                            value={content}
                            onChange={(e) => onChangValue(e)}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                          />
                          <div className={styles.commentSave}>
                            <SeeButton
                              onClick={() => {
                                setNowProjectComment({} as commentsType);
                                setContent('');
                              }}
                              style={{ marginRight: 10 }}
                            >
                              Cancel
                            </SeeButton>
                            <SeeButton
                              type="primary"
                              onClick={() =>
                                editComment(
                                  content,
                                  nowProjectComment,
                                  (nowTaskValue as projectsType).taskId,
                                )
                              }
                            >
                              Save
                            </SeeButton>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {type == 'Mock' && (
                    <CommentList
                      dataList={nowQuestionData.comment ? [nowQuestionData.comment] : []}
                      titleText={'Trainers’ Comment'}
                      addable={false}
                      editComment={(value: string, data: commentsType) =>
                        editCommentMock(value, data, nowMockData.taskId)
                      }
                      deleteComment={(data: commentsType) =>
                        deleteCommentMock(data, nowMockData.taskId)
                      }
                      peopleList={personMap}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </Spin>
    </div>
  );
}
