import { MoreOutlined } from '@ant-design/icons';
import { connect, Dispatch, history, useLocation } from 'umi';
import { useRequest, useUpdateEffect } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import { Dropdown, Input, Menu, message } from 'antd';

import { attendantsType, mockGroupsType, TaskResponse } from '@/pages/Task/mock/typeList';

import { EnumMockStatus } from '../index';
import IconFont from '@/components/IconFont';
import LinkBlock from './components/LinkBlock';
import CardTitle from '@/components/CardTitle';
import SeeButton from '@/components/SeeButton';
import SetTimeBlock from './components/SetTimeBlock';
import Tabs, { TabsItemType } from './components/Tabs';
import SetAbsenteModal from './components/SetAbsenteModal';
import MemberBlock, { AllAbsenteesBlock, IndividualMemberBlock } from './components/MemberBlock';
import { MockEditGroupProps } from '@/pages/Task/components/MockEditGroup';

import { updateMockGroups } from '@/services/mock';
import { updateMockGroup, updateMockShort } from '@/services/batch';

import styles from './index.less';

function NoGroupBlock({
  value = '',
  data,
  onCreateGroup = () => {},
  onInputChange = () => {},
}: {
  value: string;
  data: TaskResponse;
  onCreateGroup: (type: string) => void;
  onInputChange: (value: string) => void;
}) {
  return (
    <div className={styles.noGroup}>
      {!data?.isOneOnOne ? (
        <div>
          <div className={styles.inputTitle}>Enter Group Number</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              value={value}
              type="number"
              min={1}
              // max={10}
              placeholder="1-10"
              size="large"
              style={{ flex: '1', minWidth: 50, marginRight: 10 }}
              onChange={(e) => onInputChange(e.target.value)}
            />
            <SeeButton
              disabled={!value.trim() || +value > 10 || +value < 1}
              type="primary"
              style={{ width: 153 }}
              onClick={() => onCreateGroup('createGroup')}
            >
              Create Group Mock
            </SeeButton>
          </div>
        </div>
      ) : (
        <SeeButton onClick={() => onCreateGroup('createIndividualGroup')}>
          Create Individual Mock
        </SeeButton>
      )}
    </div>
  );
}

interface PropsType {
  show: boolean;
  data: TaskResponse;
  dispatch: Dispatch;
  refresh: () => void;
  onMockGroupAction: (editGroupPageData: {
    show: boolean;
    data: Partial<MockEditGroupProps>;
  }) => void;
}

function MockGroup({ data, show, refresh, dispatch, onMockGroupAction }: PropsType) {
  const { pathname } = useLocation();
  const [groupNumber, setGroupNumber] = useState<string>('');

  const [tabsData, setTabsData] = useState<TabsItemType[]>([]);
  // 选择group trainerId
  const [activeKey, setActiveKey] = useState('');
  // 右上角操作按钮key
  const [actionKey, setActionKey] = useState('');
  // 是否是缺勤视图
  const [isAbsenteeStatus, setAbsenteeStatus] = useState(false);

  // Create Absentee’s Mock Group 操作
  // createAbsenteeAction 创建缺勤分组
  // createGroup 创建普通分组
  // createIndividualGroup 创建一对一分组
  const [toGroupPageActionKey, setToGroupPageActionKey] = useState('');

  useEffect(() => {
    if (!show) {
      setActionKey('');
      setToGroupPageActionKey('');
    }
  }, [show]);

  // 提交score+comment
  const { loading: updateMockGroupLoading, runAsync: updateMockGroupFun } = useRequest(
    updateMockGroup,
    {
      manual: true,
      onSuccess() {
        message.success('update success!');
      },
    },
  );

  const { loading: updateMockShortLoading, run: updateMockShortFun } = useRequest(updateMockShort, {
    manual: true,
    onSuccess() {
      setActionKey('');
      message.success('update success!');
      refresh();
    },
  });

  // 提交score+comment
  const { runAsync: updateMockGroupsFun } = useRequest(updateMockGroups, {
    manual: true,
    onSuccess() {
      message.success('update success!');
    },
  });

  const trainers = useMemo(
    () =>
      data?.mockGroups?.reduce(
        (result, current) => {
          const { firstname, firstName, userId } = current?.host as attendantsType;
          const key = current.mockGroupId as string;
          if (current?.isMakeUpMockGroup) {
            result[0].push({
              label: (
                <span style={{ color: '#0E1E25', fontSize: 14, fontWeight: 500 }}>
                  {firstname ?? firstName}
                  <span style={{ color: '#F14D4F' }}>**</span>
                </span>
              ),
              key,
            });
          } else if (data?.isOneOnOne) {
            if (!result[2].find((item) => item.key === userId)) {
              result[2].push({
                label: firstname ?? firstName,
                key: userId,
              });
            }
          } else {
            result[1].push({
              label: firstname ?? firstName,
              key,
            });
          }

          return result;
        },
        [
          [
            {
              label: (
                <span style={{ color: '#0E1E25', fontSize: 14, fontWeight: 500 }}>
                  N/A <span style={{ color: '#F14D4F' }}>**</span>
                </span>
              ),
              key: 'na',
            },
          ],
          [],
          [],
        ] as TabsItemType[][],
      ),
    [data],
  );

  useUpdateEffect(() => {
    const [abSentTrainer, normalTrainer, oneOnOneTrainer] = trainers ?? [[], [], []];
    if (isAbsenteeStatus) {
      setTabsData(abSentTrainer);
      const hasActiveKey = abSentTrainer.some((item) => item.key === activeKey);
      setActiveKey(hasActiveKey ? activeKey : abSentTrainer[0]?.key);
      return;
    }

    if (data?.isOneOnOne) {
      setTabsData(oneOnOneTrainer);
      const hasActiveKey = oneOnOneTrainer.some((item) => item.key === activeKey);
      setActiveKey(hasActiveKey ? activeKey : oneOnOneTrainer[0]?.key);
      return;
    }

    setTabsData(normalTrainer);
    const hasActiveKey = normalTrainer.some((item) => item.key === activeKey);
    setActiveKey(hasActiveKey ? activeKey : normalTrainer[0]?.key);
  }, [trainers, isAbsenteeStatus]);

  const currentGroup = useMemo(
    () =>
      (data?.mockGroups?.find((group) => group.mockGroupId === activeKey) ?? {}) as mockGroupsType,
    [activeKey, data],
  );

  const menuClick = (type: string) => {
    setActionKey(type);
  };

  const renderMenu = () => {
    let menuItems = [];
    const hasMakeUpGroup = data?.mockGroups?.every((group) => !group.isMakeUpMockGroup);
    if (isAbsenteeStatus) {
      menuItems.push({
        label: 'Edit Absentee Group',
        key: 'editAbsenteeGroup',
        disabled: hasMakeUpGroup, // activeKey === 'na',
      });
    } else {
      menuItems = [
        {
          label: 'Edit Group',
          key: 'editGroup',
        },
      ];

      if (
        !data.isOneOnOne &&
        data?.mockGroups?.some((group) => group.status !== EnumMockStatus.Graded)
      ) {
        menuItems.push({
          label: 'Manage Absentee List',
          key: 'manageAbsenteeList',
        });
      }
    }
    return <Menu onClick={(e) => menuClick(e.key)} items={menuItems} />;
  };

  const renderAttendantsButton = () => {
    if (
      !data.isOneOnOne &&
      data?.attendants?.length &&
      data.attendants.some((user) => user.status === 'Absent' || user.status === 'MakeUp')
    ) {
      if (isAbsenteeStatus) {
        return (
          <div className={styles.otherAction}>
            <SeeButton
              type="primary"
              onClick={() => {
                setActiveKey('');
                setAbsenteeStatus(false);
              }}
            >
              View Attendents
            </SeeButton>
          </div>
        );
      }

      return (
        <div className={styles.otherAction}>
          <SeeButton
            onClick={() => {
              setActiveKey('na');
              setAbsenteeStatus(true);
            }}
          >
            View Absentees
          </SeeButton>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const showEditGroupPage =
      ['editAbsenteeGroup', 'editGroup'].includes(actionKey) ||
      ['createAbsenteeAction', 'createGroup', 'createIndividualGroup'].includes(
        toGroupPageActionKey,
      );
    if (showEditGroupPage) {
      // TODO:根据不同 actionKey 返回对应data
      const { batchId, taskId, isOneOnOne, mockGroups = [], attendants = [] } = data;
      const groupPageData: Partial<MockEditGroupProps> = {
        taskId,
        batchId,
      };

      let otherData = {};

      switch (toGroupPageActionKey) {
        case 'createIndividualGroup':
          otherData = {
            createByIndividual: true,
          };
          break;

        case 'createAbsenteeAction':
          otherData = {
            data,
            attendants,
            mockGroups,
          };
          break;
        case 'createGroup':
          otherData = {
            initNumber: +groupNumber as number,
          };
          break;

        default:
          break;
      }

      switch (actionKey) {
        case 'editGroup':
          otherData = {
            data,
            createByIndividual: isOneOnOne,
            mockGroups,
          };
          break;

        case 'editAbsenteeGroup':
          otherData = {
            data,
            attendants,
            mockGroups,
          };
          break;

        default:
          break;
      }

      onMockGroupAction({
        show: true,
        data: {
          ...groupPageData,
          ...otherData,
        },
      });
    }
  }, [toGroupPageActionKey, actionKey]);

  const goDetailPage = (oneOnOneTraineeGroupId?: string) => {
    if (data.isLocked) {
      message.error('You need to unlock this mock first');
      return;
    }

    if (!Object.values(data.questions ?? {})?.length) {
      message.error('You need add mock questions first');
      return;
    }

    const temp = JSON.parse(localStorage.getItem('pageHeaderItems') ?? '[]');
    localStorage.setItem(
      'pageHeaderItems',
      JSON.stringify([
        ...temp,
        {
          name: data?.name,
          href: pathname,
        },
      ]),
    );

    const isMybatch = pathname.startsWith('/myBatch');
    history.push(
      `${isMybatch ? '/myBatch' : '/Category/Batches'}/ShortAnswerMock/${data.taskId}/group/${
        oneOnOneTraineeGroupId ?? currentGroup.mockGroupId
      }`,
    );
  };

  const AllAbsentTrainees = useMemo(() => {
    if (isAbsenteeStatus) {
      if (activeKey === 'na') {
        // return data?.mockGroups?.reduce((result, group) => {
        //   if (group.status === 'isMakeUpMockGroup') {
        //     result.push(...(group.trainees as attendantsType[]));
        //   }
        //   return result;
        // }, [] as attendantsType[]);
        return data?.attendants?.filter((trainee) => trainee.status === 'Absent');
      }

      return data?.mockGroups?.find((group) => group.mockGroupId === activeKey)
        ?.trainees as attendantsType[];
    }

    return [];
  }, [isAbsenteeStatus, activeKey, data]);

  return (
    <>
      <CardTitle
        title={
          data?.isOneOnOne && data.mockGroups
            ? 'Individual Mock Groups -  click trainee to enter '
            : 'Mock Group'
        }
        iconFont={<IconFont type="icon-group-line" />}
        extra={
          data?.mockGroups ? (
            <Dropdown overlay={renderMenu()} trigger={['click']}>
              <span style={{ marginLeft: 20 }} onClick={(e) => e.preventDefault()}>
                <MoreOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
              </span>
            </Dropdown>
          ) : null
        }
      />

      <div
        className={styles.shortAnswerMockTopRightContent}
        style={data.mockGroups && { padding: 20 }}
      >
        {Object.keys(data?.mockGroups ?? {}).length > 0 ? (
          <div className={styles.blockWrap}>
            <div className={styles.tabContent}>
              <span className={styles.tabLabel}>Trainer:</span>
              <Tabs
                className={styles.tabs}
                data={tabsData}
                activeKey={activeKey}
                onChange={(item) => setActiveKey(item.key)}
              />
              {renderAttendantsButton()}
            </div>

            {!isAbsenteeStatus && !data.isOneOnOne && (
              <div className={styles.timeContent}>
                <SetTimeBlock
                  loading={updateMockGroupLoading}
                  mockGroup={currentGroup}
                  onSave={(startTime) => {
                    updateMockGroupFun({
                      taskId: data.taskId,
                      batchId: data.batchId,
                      mockGroup: {
                        ...currentGroup,
                        host: (currentGroup?.host as attendantsType)?.userId,
                        startTime,
                        viewableQuestionIds: currentGroup?.viewableQuestionIds ?? [],
                      },
                    }).then((res) => {
                      const newGroups = data.mockGroups?.map((group) => {
                        if (group.mockGroupId === res.mockGroupId) {
                          return {
                            ...group,
                            startTime,
                          };
                        }
                        return group;
                      });
                      dispatch({
                        type: 'Mock/updateMockGroups',
                        payload: newGroups,
                      });
                    });
                  }}
                />
              </div>
            )}

            <div className={styles.member}>
              {isAbsenteeStatus ? (
                <AllAbsenteesBlock
                  data={data}
                  isAll={activeKey === 'na'}
                  trainees={AllAbsentTrainees}
                  onCreateAbsent={() => setToGroupPageActionKey('createAbsenteeAction')}
                />
              ) : data?.isOneOnOne ? (
                <IndividualMemberBlock
                  loading={updateMockShortLoading}
                  data={data}
                  goDetailPage={goDetailPage}
                  activeKey={activeKey}
                  onSave={(resultGroups, editGroup, startTime) => {
                    updateMockGroupsFun({
                      taskId: data.taskId,
                      batchId: data.batchId,
                      isOneOnOne: true,
                      mockGroups: resultGroups,
                    }).then(() => {
                      const tempGroups = data.mockGroups?.map((group) => {
                        if (group.mockGroupId === editGroup.mockGroupId) {
                          return {
                            ...group,
                            startTime,
                          };
                        }
                        return group;
                      });
                      dispatch({
                        type: 'Mock/updateMockGroups',
                        payload: tempGroups,
                      });
                    });
                  }}
                />
              ) : (
                <MemberBlock mockGroup={currentGroup} data={data} />
              )}
            </div>

            {activeKey !== 'na' && (
              <div className={styles.link}>
                <LinkBlock
                  loading={updateMockGroupLoading}
                  // mockGroup={currentGroup}
                  data={data}
                  activeKey={activeKey}
                  onSave={(editGroup: mockGroupsType) => {
                    const tempGroups = data.mockGroups?.map((group) => {
                      const currentId = data?.isOneOnOne
                        ? (group.host as attendantsType)?.userId
                        : group.mockGroupId;
                      if (currentId === activeKey) {
                        return {
                          ...group,
                          meetingLink: editGroup.meetingLink,
                        };
                      }
                      return group;
                    });

                    const newGroup = data.mockGroups?.find((group: mockGroupsType) => {
                      if (data?.isOneOnOne) {
                        return (group.host as attendantsType)?.userId === activeKey;
                      }
                      return group.mockGroupId === activeKey;
                    }) as mockGroupsType;

                    const traineeIds = newGroup.trainees?.map((trainee) => trainee.userId);

                    updateMockGroupFun({
                      taskId: data.taskId,
                      batchId: data.batchId,
                      mockGroup: {
                        ...newGroup,
                        meetingLink: editGroup.meetingLink,
                        host: (newGroup?.host as attendantsType)?.userId,
                        trainees: undefined,
                        traineeIds,
                        viewableQuestionIds: editGroup.viewableQuestionIds ?? [],
                      },
                    }).then(() => {
                      dispatch({
                        type: 'Mock/updateMockGroups',
                        payload: tempGroups,
                      });
                    });
                  }}
                />
              </div>
            )}

            {!data?.isOneOnOne && (
              <SeeButton
                type="primary"
                disabled={
                  (isAbsenteeStatus && activeKey === 'na') || !currentGroup.trainees?.length
                }
                onClick={() => goDetailPage()}
              >
                Enter This Group
              </SeeButton>
            )}
          </div>
        ) : (
          Object.keys(data).length > 0 &&
          !data.mockGroups && (
            <NoGroupBlock
              data={data}
              value={groupNumber}
              onCreateGroup={setToGroupPageActionKey}
              onInputChange={setGroupNumber}
            />
          )
        )}
      </div>

      <SetAbsenteModal
        loading={updateMockShortLoading}
        open={actionKey === 'manageAbsenteeList'}
        data={data}
        onCancel={() => setActionKey('')}
        onSave={(users) => {
          updateMockShortFun({
            ...data,
            attendants: users,
          });
        }}
      />
    </>
  );
}

export default connect()(MockGroup);
