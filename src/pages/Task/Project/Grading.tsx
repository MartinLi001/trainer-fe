import React, { useEffect, useMemo, useState } from 'react';
import { Button, InputNumber, message, Modal, Tooltip } from 'antd';
import style from './Grading.less';
import type { ProjectGroupMemberItem, ProjectGroupsItem } from '../interface';
import { saveGrade } from '@/services/assignment';
import CommentList from '../Assignment/components/CommentList';
import { addGroupComment, removeGroupComment, updateGroupComment } from '@/services/project';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { useModel } from 'umi';

interface Props {
  setTaskData: React.Dispatch<React.SetStateAction<any>>;
  setProjectGroups: React.Dispatch<React.SetStateAction<ProjectGroupsItem[]>>;
  projectGroups: ProjectGroupsItem[];
  taskData: any;
  reloadData?: () => void;
  isBatchTrainer: boolean;
}

export default function ProjectGrading(props: Props) {
  const { initialState } = useModel('@@initialState');
  const {
    setTaskData,
    setProjectGroups,
    projectGroups = [],
    taskData,
    // reloadData,
    isBatchTrainer,
  } = props;
  const [focusGroup, setFocusGroup] = useState<ProjectGroupsItem>();
  const [focusTrainee, setFocusTrainee] = useState<ProjectGroupMemberItem>();
  const [scoreValue, setScoreValue] = useState<number | null>();
  const [groupCommentList, setGroupCommentList] = useState<any>([]);
  const [peerReviewList, setPeerReviewList] = useState<any>([]);
  const meetingLink = useMemo(() => {
    let comments: any[] = [];
    taskData?.submissions?.some((item: any) => {
      if (item.userId === focusTrainee?.userId) {
        comments = item.comments;
        return true;
      }
      return false;
    });
    return comments?.at(-1)?.content ?? '';
  }, [taskData, focusTrainee]);

  useEffect(() => {
    if (focusGroup) {
      // 读取group comment list
      const newFocusGroup = projectGroups.find(
        (item) => item.projectGroupId === focusGroup.projectGroupId,
      );
      setGroupCommentList(newFocusGroup?.comments || []);
      // 检查是否有Peer Review，没有就清空数据
      const checkPeerReview = projectGroups.find(
        (i) => i.projectGroupId === focusGroup.projectGroupId,
      )?.peerReviews;
      if (!checkPeerReview) setPeerReviewList([]);
    } else {
      setFocusGroup(projectGroups?.[0]);
    }
  }, [projectGroups, focusGroup]);

  useEffect(() => {
    // 自动选中组内第一个学员
    setFocusTrainee(focusGroup?.projectGroupMembers?.[0]);
    // // 读取group comment list
    // setGroupCommentList(focusGroup?.comments || []);
  }, [focusGroup]);

  useEffect(() => {
    // 读取score
    const scoreFlag = taskData?.submissions?.some((item: any) => {
      if (item.userId === focusTrainee?.userId) {
        setScoreValue(item.grade ?? null);
        return true;
      }
      return false;
    });
    if (!scoreFlag) setScoreValue(null);
    // 读取peer review list
    const reviewFlag = focusGroup?.peerReviews?.some((item) => {
      if (item.userId === focusTrainee?.userId) {
        setPeerReviewList(item?.comments || []);
        return true;
      }
      return false;
    });
    if (!reviewFlag) setPeerReviewList([]);
  }, [focusTrainee, focusGroup, taskData]);

  function onSaveGrade() {
    saveGrade({
      batchId: taskData.batchId,
      grade: scoreValue,
      taskId: taskData.taskId,
      userId: focusTrainee?.userId,
    }).then(() => {
      // reloadData?.();
      setTaskData((oldData: any) => {
        const newData = cloneDeep(oldData);
        newData.submissions?.some((item: any) => {
          if (item.userId === focusTrainee?.userId) {
            item.grade = scoreValue;
            return true;
          }
          return false;
        });
        return newData;
      });
      // const backupTask = taskData;
      // backupTask?.submissions?.some((item: any) => {
      //   if (item.userId === focusTrainee?.userId) {
      //     item.grade = scoreValue;
      //     return true;
      //   }
      //   return false;
      // });
      // setTaskData(backupTask);
    });
  }

  function addComment(content: string) {
    if (!focusGroup?.projectGroupId) return;
    addGroupComment({
      batchId: taskData.batchId,
      taskId: taskData.taskId,
      projectGroupId: focusGroup.projectGroupId,
      content: content,
    }).then(({ feedback: { commentId } }) => {
      message.success('success');
      // reloadData?.();
      const newGroups = cloneDeep(projectGroups);
      newGroups.some((group) => {
        if (group.projectGroupId === focusGroup.projectGroupId) {
          group.comments = [
            ...(group.comments ?? []),
            {
              content: content,
              commentBy: initialState?.userId,
              commentDateTime: moment(),
              commentId,
            } as any,
          ];
          return true;
        }
        return false;
      });
      setProjectGroups(newGroups);
      setTaskData({ ...taskData, projectGroups: newGroups });
    });
  }

  function deleteComment(commentId: string) {
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
        if (!focusGroup?.projectGroupId) return;
        removeGroupComment({
          batchId: taskData.batchId,
          taskId: taskData.taskId,
          projectGroupId: focusGroup.projectGroupId,
          commentId,
        }).then(() => {
          message.success('success');
          // reloadData?.();
          const newGroups = cloneDeep(projectGroups);
          newGroups.some((group) => {
            if (group.projectGroupId === focusGroup.projectGroupId) {
              group.comments = group.comments?.filter((i) => i.commentId !== commentId);
              return true;
            }
            return false;
          });
          setProjectGroups(newGroups);
          setTaskData({ ...taskData, projectGroups: newGroups });
        });
      },
    });
  }

  function editComment(content: string, commentId: string) {
    if (!focusGroup?.projectGroupId) return;
    updateGroupComment({
      batchId: taskData.batchId,
      taskId: taskData.taskId,
      projectGroupId: focusGroup.projectGroupId,
      commentId,
      content: content,
    }).then(() => {
      message.success('success');
      // reloadData?.();
      const newGroups = cloneDeep(projectGroups);
      newGroups.some((group) => {
        if (group.projectGroupId === focusGroup.projectGroupId) {
          group.comments?.some((i) => {
            if (i.commentId === commentId) {
              i.content = content;
              return true;
            }
            return false;
          });
          return true;
        }
        return false;
      });
      setProjectGroups(newGroups);
      setTaskData({ ...taskData, projectGroups: newGroups });
    });
  }

  const formatName = (member?: ProjectGroupMemberItem) =>
    `${member?.firstName || member?.firstname} ${(member?.lastName || member?.lastname || '').slice(
      0,
      1,
    )}.`;

  const renderGroupList = () => {
    const pickLeader = (group: ProjectGroupsItem) => {
      return group.projectGroupMembers?.find((item) => item.role === 'Leader');
    };
    function checkFocusStatus(id?: string) {
      if (!id) return;
      return focusGroup?.projectGroupId === id;
    }
    function changeFocusGroup(group: ProjectGroupsItem) {
      setFocusGroup(group);
    }
    return projectGroups.map((item) => {
      const leader = pickLeader(item);
      return (
        <Tooltip
          title={`${leader?.firstName || leader?.firstname} ${
            leader?.lastName || leader?.lastname
          }`}
          key={item.projectGroupId + '_grading_group'}
          mouseEnterDelay={0.5}
        >
          <div
            className={`${style.traineeName} ${
              checkFocusStatus(item.projectGroupId) ? style.focus : ''
            }`}
            onClick={() => changeFocusGroup(item)}
          >
            {formatName(leader)}
          </div>
        </Tooltip>
      );
    });
  };
  const renderMemberList = () => {
    function checkFocusMember(id: string) {
      return focusTrainee?.userId === id;
    }
    function changeFocusMember(trainee: ProjectGroupMemberItem) {
      setFocusTrainee(trainee);
    }
    return focusGroup?.projectGroupMembers?.map((item) => (
      <Tooltip
        title={`${item?.firstName || item?.firstname} ${item?.lastName || item?.lastname}`}
        key={item.userId + '_grading_member'}
        mouseEnterDelay={0.5}
      >
        <div
          className={`${style.traineeName} ${checkFocusMember(item.userId) ? style.focus : ''}`}
          onClick={() => changeFocusMember(item)}
        >
          {formatName(item)}
        </div>
      </Tooltip>
    ));
  };
  return (
    <div className={style.wrapper}>
      <div className={style.subtitle}>Groups</div>
      <div className={style.nameList}>{renderGroupList()}</div>
      <div className={style.gradingDetail}>
        <div className={style.left}>
          <div className={style.subtitle}>Submission Link</div>
          {meetingLink ? (
            <a
              href={meetingLink.indexOf('http') > -1 ? meetingLink : 'http://' + meetingLink}
              target="_blank"
              rel="noreferrer"
            >
              {meetingLink}
            </a>
          ) : (
            <span>No submission yet</span>
          )}
          <div className={style.subtitle}>All Members</div>
          <div className={style.nameList}>{renderMemberList()}</div>
          <div className={style.subtitle}>
            <span>Grading for </span>
            <span className={style.blue}>
              {focusTrainee?.firstName || focusTrainee?.firstname}{' '}
              {focusTrainee?.lastName || focusTrainee?.lastname}
            </span>
          </div>
          <div className={style.scoreTitle}>
            Score <span className={style.red}>*</span>
          </div>
          <div className={style.score}>
            <InputNumber
              min={0}
              max={5}
              // stringMode
              step={0.1}
              precision={1}
              placeholder="scale 0-5"
              className={style.input}
              value={scoreValue}
              onChange={setScoreValue}
              disabled={!isBatchTrainer}
            />
            <Button onClick={onSaveGrade} type="primary" disabled={!isBatchTrainer}>
              Save
            </Button>
          </div>
        </div>
        <div className={style.right}>
          <CommentList
            data={groupCommentList}
            addComment={addComment}
            editComment={editComment}
            deleteComment={deleteComment}
            titleText="Group Comment"
            addable={isBatchTrainer}
          />
          {!!peerReviewList?.length && (
            <CommentList
              data={peerReviewList}
              addComment={() => null}
              editComment={() => null}
              titleText="Peer Review"
              addable={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
