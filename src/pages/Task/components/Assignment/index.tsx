// 疑似废弃
import React, { useRef, useState, useMemo, useEffect } from 'react';
import styles from './index.less';
import DetailsTitle, { IconType } from '@/components/DetailsTitle';
import type { CommentItem, ResourcesItem, TaskResponse } from '@/pages/Task/interface';
import type { RcFile } from 'antd/lib/upload';
import DetailsCardItem from '@/components/DetailsCardItem';
import { Empty, Input, message, Radio, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import { useDebounceFn } from 'ahooks';
import type { RadioChangeEvent, UploadFile } from 'antd';
import Comment from '@/components/Comment';
import SeeButton from '@/components/SeeButton';
import DetailsDownload from '@/components/DetailsDownload';
import DetailsUpload, { UploadPreview } from '@/components/PreviewBar';
import { date2desc } from '@/utils';
import type { Loading } from 'umi';
import type { ConnectState } from '@/models/course';
import PageHeader from '@/components/PageHeader';
import { submitAssignment } from '@/services/course';

const { TextArea } = Input;
interface AssignmentProps {
  taskId: string;
  taskInfo: TaskResponse;
  dispatch: any;
  type?: string;
  loading: boolean;
}

const Assignment: React.FC<AssignmentProps> = ({
  taskId,
  taskInfo: data,
  dispatch,
  type = 'Assignment',
  loading,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const userInfo = JSON.parse(localStorage.userInfo ?? '{}');
  const firstName = userInfo?.firstName;
  const [LeftcommentInput, setLeftCommentInput] = useState<string>('');
  const [RightcommentInput, setRightCommentInput] = useState<string>('');
  const [commentVisible, setCommentVisible] = useState<boolean>(false);
  const [radioValue, setRadioValue] = useState('recent');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const ref = useRef<any>();

  useEffect(() => {
    dispatch({
      type: 'course/getTaskInfo',
      payload: taskId,
    });
  }, [dispatch, taskId]);

  const { run: handleAddComment } = useDebounceFn(
    async () => {
      const params = {
        batchId: data.batchId,
        taskId: data.taskId,
        userId: userInfo.userId,
        content: RightcommentInput,
      };
      try {
        setSaveLoading(true);
        await dispatch({
          type: 'course/addComment',
          payload: params,
        });
        dispatch({
          type: 'course/getTaskInfo',
          payload: taskId,
        });
        message.success('Updated successfully');
        setSaveLoading(false);
        setCommentVisible(false);
        setRightCommentInput('');
      } catch (error) {
        setSaveLoading(false);
        message.error('Fail to update');
      }
    },
    {
      wait: 500,
    },
  );

  const onChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
  };

  const submit = async () => {
    setSubmitLoading(true);
    const formData = new FormData();
    formData.append(
      'assignment',
      JSON.stringify({
        batchId: data.batchId,
        taskId: data.taskId,
        comment: LeftcommentInput,
      }),
    );
    if (fileList.length) {
      fileList.forEach((file) => {
        formData.append('files', file as RcFile);
      });
    }

    submitAssignment(formData)
      .then(() => {
        message.success('Submitted successfully');
        setLeftCommentInput('');
        ref.current?.onSetFileList([]);
      })
      .finally(() => {
        setSubmitLoading(false);
        dispatch({
          type: 'course/getTaskInfo',
          payload: taskId,
        });
      });
  };

  const beforeUpload = (FileList: RcFile[]) => {
    setFileList(FileList);
  };

  const allowSubmit = useMemo(
    () => data.enableLateSubmission || new Date() < new Date(data.endDateTime),
    [data],
  );

  const commentList = useMemo(() => {
    if (data && data.submissions) {
      const list = [...data.submissions[0].comments].reverse();
      return radioValue === 'all' ? list : list.slice(0, 3);
    }

    return [];
  }, [data, radioValue]);

  return (
    <>
      <Spin spinning={loading}>
        <PageHeader
          title={[
            data.type,
            data.startDateTime && moment(data.startDateTime).format('MMMM Do YYYY'),
          ]}
        />
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.left}>
              <DetailsTitle type={IconType.Info} text={`${type} Information`} />
              <div className={styles.leftContent}>
                <DetailsCardItem
                  title={`${type == 'Assignment' ? 'Assignment Title' : 'Project Name'}`}
                  desc={data.name}
                />
                <div className={styles.date}>
                  <DetailsCardItem
                    title="Start Date"
                    desc={moment(data.startDateTime).format('DD/MM/YYYY')}
                    style={{ marginRight: 78 }}
                  />
                  <DetailsCardItem
                    title="End Date"
                    desc={moment(data.endDateTime).format('DD/MM/YYYY')}
                  />
                </div>
                <DetailsCardItem title="Description" desc={data.description} />
              </div>
            </div>
            <div className={styles.right}>
              <DetailsTitle type={IconType.File} text="Resources" />
              <div className={styles.rightContent}>
                {data.resources ? (
                  data.resources.map((item: ResourcesItem) => {
                    return (
                      <DetailsDownload
                        key={item.resourceId}
                        taskId={data.taskId}
                        resourceId={item.resourceId}
                        title={item.name}
                      />
                    );
                  })
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <DetailsTitle type={IconType.Upload} text="Submission" />
            {allowSubmit ? (
              <div className={styles.bottomContent}>
                <div className={styles.left}>
                  <DetailsCardItem
                    style={{ marginBottom: 23 }}
                    title="Submit Assignment"
                    desc="Previous submission will be over written"
                  />
                  <UploadPreview data={fileList} onRemove={ref.current?.onRemove} />
                  <DetailsUpload
                    ref={ref}
                    disabled={!allowSubmit}
                    beforeUpload={beforeUpload}
                    accept={'.pdf,.zip'}
                  />
                  <br />
                  <DetailsCardItem
                    isOnlyTitle={true}
                    title="Submission Comments"
                    style={{ marginTop: 24 }}
                  />
                  <TextArea
                    className={styles.textArea}
                    value={LeftcommentInput}
                    onChange={(e) => {
                      setLeftCommentInput(e.target.value);
                    }}
                  />
                  <SeeButton
                    type="primary"
                    className={styles.button}
                    onClick={submit}
                    disabled={!allowSubmit || LeftcommentInput.length === 0}
                    loading={submitLoading}
                  >
                    Submit Assignment
                  </SeeButton>
                </div>
                <div className={styles.right}>
                  {data.submissions?.[0]?.resources && (
                    <div className={styles.rightTitle}>
                      <DetailsCardItem
                        isOnlyTitle={true}
                        title="Previous Submission"
                        style={{ marginBottom: 24 }}
                      />
                      {data.enableLateSubmission && new Date() > new Date(data.endDateTime) && (
                        <DetailsCardItem
                          isOnlyTitle={true}
                          title="LATE SUBMISSION"
                          style={{ marginBottom: 24 }}
                          isTitleRed={true}
                        />
                      )}
                    </div>
                  )}
                  {data.submissions?.[0]?.resources &&
                    data.submissions[0].resources.map((item: ResourcesItem) => {
                      return (
                        <DetailsDownload
                          key={item.resourceId}
                          title={item.name}
                          taskId={data.taskId}
                          resourceId={item.resourceId}
                          desc={date2desc(data.submissions?.[0].submittedDateTime || '')}
                        />
                      );
                    })}
                  {data.submissions && (
                    <>
                      <div className={styles.title}>
                        <DetailsCardItem title="Submitted Comments" isOnlyTitle={true} />
                        <Radio.Group onChange={onChange} value={radioValue}>
                          <Radio value={'recent'}>Most Recent</Radio>
                          <Radio value={'all'}>All</Radio>
                        </Radio.Group>
                      </div>
                      <div className={styles.allComments}>
                        {commentList.map((item: CommentItem) => {
                          return (
                            <Comment
                              date={date2desc(item.commentDateTime)}
                              key={item.commentId}
                              text={item.content}
                              author={firstName}
                            />
                          );
                        })}
                      </div>
                      <SeeButton
                        type="primary"
                        className={styles.add}
                        onClick={() => setCommentVisible(true)}
                      >
                        Add
                      </SeeButton>
                      {commentVisible && (
                        <>
                          <DetailsCardItem isOnlyTitle={true} title="comments" />
                          <TextArea
                            className={styles.textArea}
                            value={RightcommentInput}
                            onChange={(e) => {
                              setRightCommentInput(e.target.value);
                            }}
                          />
                          <SeeButton
                            className={styles.cancel}
                            onClick={() => setCommentVisible(false)}
                          >
                            Cancel
                          </SeeButton>
                          <SeeButton
                            type="primary"
                            disabled={RightcommentInput.length === 0}
                            className={styles.save}
                            onClick={handleAddComment}
                            loading={saveLoading}
                          >
                            Save
                          </SeeButton>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.bottomContent}>
                <DetailsCardItem
                  isTitleRed={true}
                  title="NO SUBMISSION ACCEPTED AT THIS TIME"
                  desc="The assignment has passed the deadline"
                />
              </div>
            )}
          </div>
        </div>
      </Spin>
    </>
  );
};

export default connect(({ course, loading }: { course: ConnectState; loading: Loading }) => {
  return {
    taskInfo: course.taskInfo,
    loading: loading.effects['course/getTaskInfo'],
  };
})<any>(Assignment) as any;
