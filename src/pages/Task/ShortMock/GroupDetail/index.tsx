import { useParams, history, connect } from 'umi';
import { useRequest, useUpdateEffect } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Col, message, Row, Select, Spin } from 'antd';

import SeeButton from '@/components/SeeButton';
import PageHeader from '@/components/PageHeader';
import QuestionListBlock from './components/QuestionListBlock';
import { GradeFormAvalible, GradeFormUnAvalible } from './components/GradeTableBlock';
import SubmitedBlock from './components/SubmitedBlock';
import DescriptionItem from './components/DescriptionItem';
import DetailListBlock from './components/DetailListBlock';

import { getShortMockDetail, putMockResult, updateMockGroup } from '@/services/batch';
import { EnumMockStatus } from '../index';
import { attendantsType, mockGroupsType, questionType } from '@/pages/Task/mock/typeList';

import styles from './index.less';
import moment from 'moment';
import { cloneDeep } from 'lodash';

// 随机选择user
// const randomUser = (trainee: any[]) => {
//   return parseInt((Math.random() * (trainee.length + 1)).toString(), 10);
// };

function GroupDetail({ data: batchDetails }: { data: API.AllBatchType }) {
  const { taskId, groupId } = useParams<{ taskId: string; groupId: string }>();
  const [activeQuestionId, setActiveQuestionId] = useState('');
  const [assignSelectKey, setAssignSelectKey] = useState('all');
  const [gradingData, setGradingData] = useState([]);
  const [selectUser, setSelectUser] = useState<any>({});
  const QuestionListBlockRef = useRef<any>();
  const [groupGraded, setGroupGraded] = useState(false); // 组中是否有已经给当前选中的question打过分的，true有，false全都没打分

  // 获取详情
  const { loading, data, run, refresh, mutate } = useRequest(getShortMockDetail, {
    manual: true,
  });

  // 更改grading
  const { loading: putMockResultLoading, run: putMockResultFun } = useRequest(putMockResult, {
    manual: true,
    onSuccess() {
      message.success('save success!');
      // refresh();
    },
    onError(error) {
      if ((error as any).serviceStatus?.errorMessage?.includes(`doesn't exist in batch`)) {
        message.error(
          'This trainee is no longer in the current batch. Editing score is not allowed',
        );
      }
    },
  });

  // 提交score+comment
  const { loading: updateMockGroupLoading, run: updateMockGroupFun } = useRequest(updateMockGroup, {
    manual: true,
    onSuccess() {
      message.success('update success!');
      refresh();
    },
    onError(error) {
      if ((error as any).serviceStatus?.errorMessage?.includes(`doesn't exist in batch`)) {
        message.error(
          'This trainee is no longer in the current batch. Editing score is not allowed',
        );
      }
    },
  });

  // 更新mock status
  const { loading: updateMockGroupStatusLoading, run: updateMockGroupStatusFun } = useRequest(
    updateMockGroup,
    {
      manual: true,
      onSuccess() {
        message.success('update success!');
        // refresh();
      },
    },
  );

  useEffect(() => {
    run(taskId);
  }, []);

  useEffect(() => {
    if (!activeQuestionId) setActiveQuestionId(data?.questionOrders[0]);
  }, [data]);

  // 当前题
  const currentQuestion = useMemo(
    () => data?.questions[activeQuestionId] as questionType,
    [data, activeQuestionId],
  );

  // 当前组信息
  const {
    trainees = [],
    viewableQuestionIds = [],
    status,
    isOneOnOne,
    host,
    currentMockGroup,
    // attendants = [],
  } = useMemo(() => {
    const mockGroup = (data?.mockGroups?.find(
      ({ mockGroupId }: mockGroupsType) => mockGroupId === groupId,
    ) ?? {}) as mockGroupsType;

    return {
      ...mockGroup,
      trainees: mockGroup?.trainees?.filter((item) => {
        return (
          data.attendants?.find((user: any) => user.userId === item.userId)?.status !== 'Absent'
        );
      }),
      isOneOnOne: data?.isOneOnOne,
      currentMockGroup: mockGroup,
    };
  }, [activeQuestionId, data]);

  // 已经提交和未提交trainee + 是否已有提交
  const {
    hasSubmit = false,
    submitTrainees = [],
    unsubmitTrainees = [],
  } = useMemo(() => {
    if (!trainees) return {};

    const results = currentQuestion?.results ?? {};
    const currentQuestionHasSubmit = Object.keys(results).some(
      (userId) =>
        !!results[userId].userAnswer && trainees.find((trainee) => trainee?.userId === userId),
    );

    return trainees?.reduce(
      (traineeObj, current) => {
        if (Object.keys(results).includes(current.userId) && results[current.userId]?.userAnswer) {
          traineeObj.submitTrainees.push(current);
        } else {
          traineeObj.unsubmitTrainees.push(current);
        }

        return traineeObj;
      },
      {
        submitTrainees: [],
        unsubmitTrainees: [],
        hasSubmit: currentQuestionHasSubmit,
      } as any,
    );
  }, [currentQuestion, trainees]);

  // 当前题 make 状态
  const makeStatusIsUnavailable = useMemo(
    () => viewableQuestionIds.includes(activeQuestionId),
    [activeQuestionId, viewableQuestionIds],
  );

  // 此方法现在只用于更新gradingData，已将掺杂的其他操作转移到触发动作处。移动如下：
  // 1. 判断组中是否有至少一个已打分 -> currentQuestion更新的useUpdateEffect
  // 2. 更新‘assign to’ select key -> currentQuestion更新的useUpdateEffect、‘assign to’ Select onChange
  // 传入的userId的isBonus为true，其他为false
  // 若userId==='all',则所有isBonus都为false
  // 若不传，直接读取接口中的isBonus数据
  const createGradeTableData = (userId?: string) => {
    const currentResults = currentQuestion?.results;
    const resultData = trainees?.reduce((results, trainee) => {
      const alredySetData = currentResults?.[trainee.userId];
      let otherFields;
      if (userId) {
        otherFields = {
          isBonus: userId === 'all' ? false : userId !== trainee.userId,
        };
        // setAssignSelectKey(makeStatusIsUnavailable ? 'all' : userId);
      } else {
        otherFields = {
          isBonus: alredySetData?.isBonus ?? false,
        };
      }
      results?.push({
        comment: {
          content: alredySetData?.comment?.content ?? '',
        },
        // @ts-ignore
        firstname: trainee.firstName,
        questionId: activeQuestionId,
        userId: trainee.userId,
        score: isNaN(alredySetData?.score ?? NaN) ? '' : alredySetData?.score?.toFixed(1) ?? '',
        ...otherFields,
      });

      return results;
    }, [] as any);

    setGradingData(resultData);
  };

  const [circleNum, setCircleNum] = useState(0);
  useUpdateEffect(() => {
    let graded = false; // 用于记录本组是否有已打分的学员
    const notBonusTrainees: attendantsType[] = []; // 用于记录所有已打分且非附加分的学员
    let assignToUserId = 'all'; // 自动assign to的学员id，默认assign to all
    // 开始逐个检查学员的打分情况
    trainees.forEach((trainee) => {
      const result = currentQuestion?.results?.[trainee.userId];
      // 若该学员已打分，则标记graded为true
      if (result?.score) {
        graded = true;
      }
      // 若该学员已打分且分数不是附加分，则记录到notBonusTrainees中
      if (result && !result?.isBonus) {
        notBonusTrainees.push(result);
      }
    });
    // 若该组中没有打过分，则自动轮流assign to一名学员
    // notBonusTrainees.length===0表示：1. 组中都未打分。 2. 组中全是附加分，
    // 理论上不会出现情况2，但是为了兼容之前的脏数据，所以另专门设置graded来表示是否打过分。
    if (!graded || notBonusTrainees.length < 1) {
      assignToUserId = trainees[circleNum]?.userId ?? 'all';
      createGradeTableData(assignToUserId);
      setCircleNum((circleNum + 1) % trainees.length);
    }
    // 若只有一个非附加分，则assign to这个非附加分的学员，
    else if (notBonusTrainees.length === 1) {
      assignToUserId = notBonusTrainees[0].userId ?? 'all';
      createGradeTableData(assignToUserId); // 其实这里不用传userId，createGradeTableData会读取接口中的数据，这里传了兼容保险..
    }
    // 其他情况即上次打分时选择了assign to all，除此之外不可能有两个及以上学员都是非附加分。
    else {
      createGradeTableData();
    }
    setGroupGraded(graded);
    setAssignSelectKey(makeStatusIsUnavailable ? 'all' : assignToUserId);
    // 以下是旧逻辑
    // // 如果已经设置过的或者没有设置过的 不用传 userId
    // if (trainees.some((item) => currentQuestion?.results?.[item.userId])) {
    //   // if (currentQuestion?.results) {
    //   createGradeTableData();
    //   return;
    // }
    // setCircleNum((circleNum + 1) % trainees.length);
    // createGradeTableData(trainees[circleNum]?.userId ?? 'all');
  }, [currentQuestion]);

  // 更改是否可提交状态方法
  const onMakeSubmisson = (isAvailable: boolean, startOrEnd = false) => {
    const tempViewableQuestionIds = viewableQuestionIds.concat([]);
    if (!startOrEnd) {
      if (isAvailable) {
        tempViewableQuestionIds.push(activeQuestionId);
        setAssignSelectKey('all');
      } else {
        const index = tempViewableQuestionIds.findIndex((id) => id === activeQuestionId);
        tempViewableQuestionIds.splice(index, 1);
      }
    }

    updateMockGroupFun({
      taskId: data.taskId,
      batchId: data.batchId,
      mockGroup: {
        ...currentMockGroup,
        host: (currentMockGroup?.host as attendantsType)?.userId,
        traineeIds: trainees.map((trainee) => trainee.userId),
        viewableQuestionIds: startOrEnd ? [] : tempViewableQuestionIds,
      },
    });
  };

  const onChangeMockStatus = (groupStatus: EnumMockStatus) => {
    mutate((oldData: any) => {
      const newData = cloneDeep(oldData);
      newData?.mockGroups?.some((group: any) => {
        if (group.mockGroupId === currentMockGroup.mockGroupId) {
          group.status = groupStatus;
          return true;
        }
        return false;
      });
      return newData;
    });
    updateMockGroupStatusFun({
      taskId: data.taskId,
      batchId: data.batchId,
      mockGroup: {
        ...currentMockGroup,
        status: groupStatus,
        host: (currentMockGroup?.host as attendantsType)?.userId,
        traineeIds: trainees.map((trainee) => trainee.userId),
        viewableQuestionIds: currentMockGroup.viewableQuestionIds ?? [],
      },
    });
  };

  const onGradeFormUnAvalibleSave = ({
    userResult,
    selectUser: currentUser,
  }: {
    userResult: attendantsType;
    selectUser: any;
  }) => {
    if (batchDetails?.trainees?.every((trainee: any) => trainee.userId !== currentUser?.userId)) {
      message.error('This trainee is no longer in the current batch. Editing score is not allowed');
      return;
    }
    const apiData = {
      batchId: data.batchId,
      taskId: data.taskId,
      results: {
        [currentQuestion.questionId as string]: [
          {
            ...userResult,
            questionId: currentQuestion.questionId,
          },
        ],
      },
    };
    mutate((oldData: any) => {
      const oldResults = oldData?.questions?.[activeQuestionId]?.results || {};
      oldData.questions[activeQuestionId].results = { ...oldResults };
      oldData.questions[activeQuestionId].results[currentUser?.userId] = {
        ...userResult,
        score: Number(userResult.score),
      };
      return oldData;
    });
    putMockResultFun(apiData);
  };

  // 渲染make assignment 按钮
  const renderMakeButton = (isUnavailable: boolean) => {
    if (isUnavailable)
      return (
        <SeeButton
          type="warning"
          loading={updateMockGroupLoading}
          // disabled={status === EnumMockStatus.Graded}
          onClick={() => onMakeSubmisson(false)}
        >
          Make Unavailable for Submission
        </SeeButton>
      );
    return (
      <SeeButton
        // disabled={status === EnumMockStatus.Graded}
        loading={updateMockGroupLoading}
        onClick={() => onMakeSubmisson(true)}
      >
        Make Available for Submission
      </SeeButton>
    );
  };

  const renderHeaderExtraButton = () => {
    if ((host as attendantsType)?.userId === localStorage.userId) {
      if (status === EnumMockStatus.Created)
        return (
          <SeeButton
            type="primary"
            loading={updateMockGroupStatusLoading}
            onClick={() => onChangeMockStatus(EnumMockStatus.Inprogress)}
          >
            Start Mock Now
          </SeeButton>
        );
      if (status === EnumMockStatus.Inprogress)
        return (
          <SeeButton
            type="danger"
            loading={updateMockGroupStatusLoading}
            onClick={() => onChangeMockStatus(EnumMockStatus.Graded)}
          >
            End Mock Now
          </SeeButton>
        );
    }
    return;
  };

  // assign to user 下拉框选项
  const selectOptions = useMemo(() => {
    const defaultOption = [
      {
        firstName: 'Assign to All',
        userId: 'all',
      },
    ];

    return makeStatusIsUnavailable ? defaultOption : [...defaultOption, ...(trainees ?? [])];
  }, [activeQuestionId, data]);

  // if (loading) {
  //   return <Spin style={{ marginLeft: '50%', marginTop: '20%' }} />;
  // }
  return (
    <Spin spinning={loading} style={{ marginTop: 200 }}>
      <div className={styles.header}>
        <PageHeader
          items={[
            ...JSON.parse(localStorage.getItem('pageHeaderItems') ?? '[]'),
            {
              name: 'details',
            },
          ]}
          extra={
            <div className={styles.headerExtra}>
              <SeeButton type="ghost" onClick={() => history.goBack()}>
                {data?.isOneOnOne ? 'Select Another Trainee' : 'Enter Another Group'}
              </SeeButton>
              {renderHeaderExtraButton()}
            </div>
          }
        />
      </div>

      <div className={styles.pageConent}>
        <Row>
          <Col>
            <QuestionListBlock
              data={data}
              activeTrainee={
                Object.keys(selectUser).length > 0
                  ? selectUser
                  : submitTrainees[0] ?? unsubmitTrainees[0]
              }
              onChange={(v) => {
                QuestionListBlockRef.current?.saveGrading?.();
                setActiveQuestionId(v);
              }}
              activeKey={activeQuestionId}
              trainees={trainees}
            />
          </Col>
        </Row>
        <Row gutter={[36, 0]}>
          <Col flex="1 1 400px">
            {/* question name */}
            <DescriptionItem title="Question Name" content={currentQuestion?.name} />

            {/* Assign to */}
            <DescriptionItem
              title={isOneOnOne ? '' : 'Assign to'}
              content={
                <>
                  {!isOneOnOne && (
                    <Select
                      defaultValue="all"
                      style={{ width: 135, marginRight: 8 }}
                      bordered={false}
                      fieldNames={{
                        label: 'firstName',
                        value: 'userId',
                      }}
                      value={assignSelectKey}
                      onChange={(v) => {
                        setAssignSelectKey(v);
                        createGradeTableData(v);
                      }}
                      options={selectOptions}
                      disabled={status === EnumMockStatus.Graded && groupGraded}
                    />
                  )}

                  {renderMakeButton(makeStatusIsUnavailable)}
                </>
              }
            />

            {(hasSubmit || makeStatusIsUnavailable) && !isOneOnOne && (
              <SubmitedBlock
                ref={QuestionListBlockRef}
                disabled={
                  (currentMockGroup?.host as attendantsType)?.userId !== localStorage.userId
                }
                selectUser={
                  Object.keys(selectUser).length > 0
                    ? selectUser
                    : submitTrainees[0] ?? unsubmitTrainees[0]
                }
                setSelectUser={setSelectUser}
                loading={putMockResultLoading}
                unsubmitTrainees={unsubmitTrainees}
                submitTrainees={submitTrainees}
                results={{ ...(currentQuestion?.results ?? {}) }}
                onRefresh={refresh}
                onSave={onGradeFormUnAvalibleSave}
              />
            )}

            <DetailListBlock
              makeStatusIsUnavailable={makeStatusIsUnavailable}
              trainees={trainees}
              isOneOnOne={isOneOnOne}
              currentQuestion={currentQuestion}
              onRefresh={refresh}
            />
          </Col>

          {loading ? (
            <></>
          ) : isOneOnOne ? (
            <GradeFormUnAvalible
              disabled={(currentMockGroup?.host as attendantsType)?.userId !== localStorage.userId}
              loading={putMockResultLoading}
              selectUser={trainees[0] ?? {}}
              results={currentQuestion?.results ?? {}}
              onSave={onGradeFormUnAvalibleSave}
            />
          ) : (
            !hasSubmit &&
            !makeStatusIsUnavailable && (
              <GradeFormAvalible
                disabled={
                  (currentMockGroup?.host as attendantsType)?.userId !== localStorage.userId
                }
                loading={putMockResultLoading}
                dataSource={gradingData}
                onSave={({ table }: any) => {
                  const filterTable = table?.filter((dataItem: any) => {
                    if (dataItem?.score || dataItem?.comment?.content) return true;
                    else return false;
                  });
                  const newApiData = filterTable.map((dataItem: any) => {
                    const originData: any =
                      gradingData.find(
                        (dataSourceItem: any) => dataSourceItem.userId === dataItem.userId,
                      ) ?? {};

                    const {
                      firstName: firstname,
                      lastName: lastname,
                      preferredName,
                    } = JSON.parse(localStorage.userInfo ?? '{}');
                    return {
                      ...dataItem,
                      comment: {
                        ...(originData.comment ?? {}),
                        ...(dataItem.comment ?? {}),
                        commentBy: localStorage.userId,
                        commentDateTime: moment().utc().format(),
                        firstname,
                        lastname,
                        preferredName,
                      },
                    };
                  });

                  mutate((oldData: any) => {
                    const oldResults = oldData?.questions?.[activeQuestionId]?.results || {};
                    oldData.questions[activeQuestionId].results = { ...oldResults };
                    for (const item of newApiData) {
                      oldData.questions[activeQuestionId].results[item.userId] = {
                        ...item,
                        score:
                          oldData.questions[activeQuestionId].results[item.userId]?.score ||
                          item.score
                            ? +item.score
                            : undefined,
                      };
                    }
                    return oldData;
                  });

                  putMockResultFun({
                    batchId: data.batchId,
                    taskId: data.taskId,
                    results: {
                      [activeQuestionId]: newApiData,
                    },
                  });
                }}
              />
            )
          )}
        </Row>
      </div>
    </Spin>
  );
}

export default connect(({ Batch }: { Batch: API.AllBatchType }) => ({
  ...Batch,
}))(GroupDetail);
