import type { ProjectGroupsItem, TaskResponse } from '@/pages/Task/interface';
import { date2desc } from '@/utils';
import { useDebounceFn } from 'ahooks';
import { message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useMemo, useState } from 'react';
import type { ConnectState } from 'umi';
import { connect } from 'umi';
import Comment from '../Comment';
import DetailsCardItem from '../DetailsCardItem';
import IconFont from '../IconFont';
import SeeButton from '../SeeButton';
import styles from './index.less';

interface projectGroupsProps {
  data: ProjectGroupsItem[];
  taskInfo: TaskResponse;
  dispatch: any;
}

const ProjectGroups: React.FC<projectGroupsProps> = ({ data, taskInfo, dispatch }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(
    data?.[0]?.projectGroupMembers?.find((item) => item.role === 'Leader')?.firstname || '',
  );
  const [isSelectedLeader, setSelectedLeader] = useState<boolean>(true);
  const [commentInput, setCommentInput] = useState<string>('');

  const commentData = useMemo(
    () => data?.[0]?.peerReviews.find((item) => item.firstname === selectedGroup)?.comments[0],
    [data, selectedGroup],
  );

  const handleOnClick = (isLeader: boolean, firstname: string) => {
    setSelectedGroup(firstname);
    if (!isLeader) {
      setSelectedLeader(false);
    } else {
      setSelectedLeader(true);
    }
  };

  const { run: handleAddComment } = useDebounceFn(
    async () => {
      const params = {
        batchId: taskInfo.batchId,
        taskId: taskInfo.taskId,
        userId: data?.[0]?.projectGroupMembers.find((item) => item.firstname === selectedGroup)
          ?.userId,
        content: commentInput,
        projectGroupId: taskInfo.projectGroups[0].projectGroupId,
      };
      try {
        await dispatch({
          type: 'course/addGroupReviewComment',
          payload: params,
        });
        dispatch({
          type: 'course/getTaskInfo',
          payload: taskInfo.taskId,
        });
        message.success('Updated successfully');
        setCommentInput('');
      } catch (error) {
        message.error('Fail to update');
      }
    },
    {
      wait: 1000,
    },
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <DetailsCardItem title="Group Members" isOnlyTitle={true} />
        <div className={styles.title}>
          <div className={styles.groupTitle}>Group Leader</div>
          {data?.[0]?.projectGroupMembers && (
            <SeeButton
              type={isSelectedLeader ? 'warning' : 'default'}
              className={styles.groupLeader}
              onClick={() =>
                handleOnClick(
                  true,
                  data?.[0]?.projectGroupMembers?.find((item) => item.role === 'Leader')
                    ?.firstname || '',
                )
              }
            >
              <IconFont type="icon-user-3-line" />
              {data[0].projectGroupMembers?.find((item) => item.role === 'Leader')?.firstname +
                ' ' +
                data[0].projectGroupMembers?.find((item) => item.role === 'Leader')?.lastname}
            </SeeButton>
          )}
        </div>
        <div className={styles.groupMemberWrapper}>
          {data?.[0]?.projectGroupMembers &&
            data?.[0]?.projectGroupMembers
              .filter((item) => item.role !== 'Leader')
              .map((item) => {
                return (
                  <SeeButton
                    type={selectedGroup === item.firstname ? 'warning' : 'default'}
                    className={styles.groupMember}
                    key={item.userId}
                    onClick={() => handleOnClick(false, item.firstname)}
                  >
                    <IconFont type="icon-user-3-line" key={item.firstname} />
                    {item.firstname + ' ' + item.lastname}
                  </SeeButton>
                );
              })}
        </div>
      </div>
      <div className={styles.right}>
        <DetailsCardItem
          title={
            commentData
              ? `Peer Review for ${selectedGroup}`
              : `My Peer Review Comment ${selectedGroup}`
          }
        />
        {commentData ? (
          <Comment
            text={commentData?.content || ''}
            author={commentData?.firstname}
            date={date2desc(commentData?.commentDateTime || '')}
          />
        ) : (
          <>
            <DetailsCardItem isOnlyTitle={true} title="comments" />
            <TextArea
              className={styles.textArea}
              value={commentInput}
              onChange={(e) => {
                setCommentInput(e.target.value);
              }}
            />
            <SeeButton
              type="primary"
              disabled={commentInput.length === 0}
              className={styles.save}
              onClick={handleAddComment}
            >
              Save
            </SeeButton>
          </>
        )}
      </div>
    </div>
  );
};

export default connect(({ course }: { course: ConnectState }) => {
  return {
    taskInfo: course.taskInfo,
  };
})<any>(ProjectGroups) as any;
