import { useRequest } from 'ahooks';
import { Col, message, Modal, Row, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MockState, ConnectProps, Loading, connect, Dispatch, BatchState, useModel } from 'umi';
import { TaskResponse } from '../typeList';
import { questionType } from '@/pages/Task/mock/typeList';

import QuestionListBlock from '@/pages/Task/ShortMock/GroupDetail/components/QuestionListBlock';
import DetailListBlock from '@/pages/Task/ShortMock/GroupDetail/components/DetailListBlock';
import DescriptionItem from '@/pages/Task/ShortMock/GroupDetail/components/DescriptionItem';
import SubmitedBlock from './components/SubmitedBlock';
import CodeMirror, { LanguageConfig } from '@/components/CodeMirror';
import PageHeader from '@/components/PageHeader';
import FixedWidget from './components/FixedWidget';
import { UploadPreview } from '@/components/PreviewBar';
import ReOpenModal from '../components/reOpenlistModal';
import SeeButton from '@/components/SeeButton';
import { updateMockStatus } from '@/services/mock';
import { putMockResult, reopenList } from '@/services/batch';

import styles from './index.less';
import { cloneDeep } from 'lodash';
const { confirm } = Modal;

interface ShortMockProps extends ConnectProps {
  taskId: string;
  type?: string;
  loading: boolean;
  batchData: API.AllBatchType;
  codingMockData: TaskResponse;
  dispatch: Dispatch;
}

function CodingMockDetails({ codingMockData, batchData, loading, dispatch }: ShortMockProps) {
  const { initialState } = useModel('@@initialState');
  const codeRef = useRef<any>();
  const FixedWidgetRef = useRef<any>();
  const [activeQuestionId, setActiveQuestionId] = useState(codingMockData?.questionOrders?.[0]);
  const [activeTraineeId, setActiveTraineeId] = useState<string>('');
  const [reopenVisible, setReopenVisible] = useState<boolean>(false);

  // 更改mock 状态 start/end
  const { loading: putMockStatusLoading, run: putMockStatusFun } = useRequest(updateMockStatus, {
    manual: true,
    onSuccess() {
      message.success('update success!');
      // getMockData();
    },
  });

  // 打分
  const { loading: putMockResultLoading, runAsync: putMockResultFun } = useRequest(putMockResult, {
    manual: true,
    onSuccess() {
      message.success('update success!');
      // getMockData();
    },
  });

  const { loading: reopenLoading, runAsync: reOpenlistApi } = useRequest(reopenList, {
    manual: true,
  });

  const getMockData = () => {
    dispatch({
      type: 'Mock/getTaskDetail',
      payload: codingMockData.taskId,
    });
  };

  const getBatchData = () => {
    dispatch({
      type: 'Batch/getBatchDetail',
      payload: codingMockData.batchId,
    });
  };

  const trainerHasPromise = batchData.trainers?.some(
    (trainer: any) => trainer.userId === initialState?.userId,
  );

  const getValues = async (callBack: any) => {
    const values = await FixedWidgetRef.current?.getFieldsValue();
    const {
      score,
      comment = {
        content: '',
      },
    } = currentTrainee;
    if (
      values &&
      !isNaN(+values.score) &&
      values.score !== '' &&
      values.score !== null &&
      (Number(score) !== Number(values.score) || comment.content !== values.content) &&
      trainerHasPromise
    ) {
      onSaveScore(values, callBack);
      return;
    }
    callBack?.();
  };

  useEffect(() => {
    getMockData();
    getBatchData();
  }, []);

  const onChangeQuestion = async (questionId: string) => {
    getValues(() => setActiveQuestionId(questionId));
  };

  const currentQuestion = useMemo(() => {
    if (!activeQuestionId) return {} as questionType;

    return codingMockData?.questions?.[activeQuestionId];
  }, [activeQuestionId, codingMockData]);

  const currentTrainee = useMemo(() => {
    return (codingMockData?.questions?.[activeQuestionId]?.results?.[activeTraineeId] ??
      batchData?.trainees?.find((trainee: any) => trainee.userId === activeTraineeId) ??
      {}) as any;
  }, [activeTraineeId, activeQuestionId, codingMockData]);

  useEffect(() => {
    const { userAnswer } = currentTrainee ?? {};
    console.log(userAnswer?.content,'=====userAnswer?.content')
    codeRef.current?.setValue(userAnswer?.content ?? '');
    codeRef.current?.setOption(userAnswer?.language ?? 'Java');
  }, [codingMockData, activeQuestionId, currentTrainee]);

  const [submitTrainees, unsubmitTrainees] = useMemo(() => {
    if (!currentQuestion) return [[], []];
    let submitResult: any = [],
      unSubmitResult: any = [];
    if (currentQuestion?.results) {
      const submitUserIds = Object.keys(currentQuestion?.results);
      batchData?.trainees?.map((trainee: any) => {
        if (
          submitUserIds.includes(trainee.userId) &&
          currentQuestion?.results[trainee?.userId]?.userAnswer
        ) {
          submitResult.push(trainee);
        } else {
          unSubmitResult.push(trainee);
        }
      });
    } else {
      unSubmitResult = batchData.trainees;
    }
    return [submitResult, unSubmitResult];
  }, [currentQuestion]);

  useEffect(() => {
    setActiveTraineeId(submitTrainees?.[0]?.userId ?? unsubmitTrainees?.[0]?.userId);
  }, []);

  const changeMockStatus = (status: string) => {
    confirm({
      title: `Do you Want to ${status} this mock?`,
      onOk() {
        dispatch({
          type: 'Mock/updateData',
          payload: { ...codingMockData, status: status === 'End' ? 'Graded' : 'In progress' },
        });
        const { taskId, batchId } = codingMockData;
        putMockStatusFun({
          taskId,
          batchId,
          status: status === 'End' ? 'Graded' : 'In progress',
        });
      },
    });
  };

  const onSaveScore = useCallback(
    (data, callBack) => {
      if (batchData?.trainees?.every((trainee: any) => trainee.userId !== currentTrainee?.userId)) {
        message.error(
          'This trainee is no longer in the current batch. Editing score is not allowed',
        );
        return;
      }
      const { taskId, batchId } = codingMockData;
      putMockResultFun({
        taskId,
        batchId,
        results: {
          [currentQuestion.questionId]: [
            {
              ...currentTrainee,
              score: data.score,
              comment: {
                content: data.content,
              },
              userAnswer: undefined,
              questionId: currentQuestion.questionId,
            },
          ],
        },
      }).then(() => {
        callBack?.();
        // getMockData();
        const oldData = cloneDeep(codingMockData);
        const oldResults = oldData?.questions?.[activeQuestionId]?.results || {};
        if (oldResults[activeTraineeId]) {
          oldResults[activeTraineeId].score = +data.score;
          oldResults[activeTraineeId].comment = {
            ...(oldResults[activeTraineeId].comment || {}),
            content: data.content,
          };
        }
        // oldResults[activeTraineeId || 'error'] = {
        //   ...(oldResults[activeTraineeId] || {}),
        //   score: data.score,
        //   comment: {
        //     content: data.content,
        //   },
        // } as any;
        // console.log('ssssssss', codingMockData, oldData);
        dispatch({
          type: 'Mock/updateData',
          payload: oldData,
        });
      });
    },
    [codingMockData, currentQuestion, currentTrainee],
  );
  return (
    <>
      <PageHeader
        items={[
          ...JSON.parse(localStorage.getItem('pageHeaderItems') ?? '[]'),
          {
            name: 'details',
          },
        ]}
        extra={
          trainerHasPromise ? (
            <>
              {codingMockData.status === 'Created' && (
                <SeeButton
                  type="primary"
                  loading={putMockStatusLoading}
                  onClick={() => changeMockStatus('Start')}
                >
                  Start Mock Now
                </SeeButton>
              )}

              {codingMockData.status === 'In progress' && (
                <SeeButton
                  type="danger"
                  loading={putMockStatusLoading}
                  onClick={() => changeMockStatus('End')}
                >
                  End Mock Now
                </SeeButton>
              )}

              {codingMockData.status === 'Graded' && (
                <SeeButton onClick={() => setReopenVisible(true)}>Manage Reopenning</SeeButton>
              )}
            </>
          ) : null
        }
      />
      <Spin spinning={loading || putMockResultLoading}>
        <div className={styles.detailsWrap}>
          <SubmitedBlock
            currentQuestion={currentQuestion}
            activeTrainee={currentTrainee}
            unsubmitTrainees={unsubmitTrainees}
            submitTrainees={submitTrainees}
            onRefresh={() => getMockData()}
            onChange={(trainee) => {
              getValues(() => setActiveTraineeId(trainee.userId));
            }}
          />

          <QuestionListBlock
            data={codingMockData}
            activeTrainee={currentTrainee}
            onChange={onChangeQuestion}
            activeKey={activeQuestionId}
          />

          <Row gutter={24}>
            <Col flex="1 1 320px">
              <DescriptionItem title="Question Name" content={currentQuestion?.name} />
              <DetailListBlock currentQuestion={currentQuestion} />
            </Col>
            <Col flex="1 1 300px" className={styles.codeWrapStyle}>
              <UploadPreview
                data={currentTrainee?.userAnswer?.attachments}
                downIcon
                taskId={codingMockData.taskId}
                colNumber={12}
              />
              {currentTrainee?.userAnswer ? (
                <CodeMirror
                  ref={codeRef}
                  options={{ readOnly: true }}
                  height={600}
                  {...currentTrainee.userAnswer}
                />
              ) : (
                <div className={styles.noSubmit}>NO SUBMISSION YET</div>
              )}
            </Col>
          </Row>
          <FixedWidget
            ref={FixedWidgetRef}
            currentTrainee={currentTrainee}
            currentQueston={currentQuestion}
            onSave={onSaveScore}
            saveButtonDisable={!trainerHasPromise}
            loading={putMockResultLoading}
          />
        </div>
      </Spin>
      <ReOpenModal
        peopleList={batchData}
        visible={reopenVisible}
        openList={codingMockData.reopenList}
        onClose={() => {
          setReopenVisible(false);
        }}
        loading={reopenLoading}
        onOk={(values: string[]) => {
          const { reopenList, batchId, taskId } = codingMockData;
          const reopenSubmit = {
            addList: values.filter((ite) => {
              return !reopenList.includes(ite);
            }),
            removeList: reopenList?.filter((ite) => {
              return !values.includes(ite);
            }),
          };
          dispatch({
            type: 'Mock/updateData',
            payload: { ...codingMockData, reopenList: values },
          });
          reOpenlistApi({
            ...reopenSubmit,
            batchId,
            taskId,
          }).then(() => {
            message.success('reopen success');
            setReopenVisible(false);
            // getMockData();
          });
        }}
      />
    </>
  );
}

export default connect(
  ({ Mock, Batch, loading }: { Mock: MockState; Batch: BatchState; loading: Loading }) => ({
    codingMockData: Mock.data,
    batchData: Batch.data,
    loading: loading.models.Mock,
  }),
)(CodingMockDetails);
