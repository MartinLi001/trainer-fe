import IconFont from '@/components/IconFont';
import { UploadPreview } from '@/components/PreviewBar';
import SeeButton from '@/components/SeeButton';
import { commentAdd, commentDelete, commentUpdate, saveGrade } from '@/services/assignment';
import { downloadTaskFile } from '@/services/course';
import { date2desc, download, getUserName } from '@/utils';
import { Form, InputNumber, message, Modal, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useEffect, useState } from 'react';
import { AssignmentType, ResourcesItem, SubmissionItem } from '../../typeList';
import CommentList from '../CommentList';
import styles from './index.less';
import { cloneDeep } from 'lodash';
import moment from 'moment';

interface Props {
  reload: (userId: string, callback: any) => void;
  data: AssignmentType;
  tableData: SubmissionItem[];
  taskId: string;
  isBatchTrainer: boolean;
  setData: (v: any) => void;
  setTableData?: (v: any) => void;
}
interface ScoreProps {
  value: number;
  onTitleChange: (value: string) => void;
  changeShow?: boolean;
}

const ScoreTitle = ({ value, onTitleChange, changeShow }: ScoreProps) => {
  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(value);
  useEffect(() => {
    setEditingTitle(value);
  }, [value]);

  const onEditing = useCallback(() => {
    if (changeShow) setEditing(true);
  }, [editing]);

  const onEndEditing = useCallback(
    (e) => {
      console.log('%cindex.tsx line:53 e', 'color: #007acc;', e);
      setEditing(false);
      // setEditingTitle(e.target.value)
      onTitleChange(e.target.value);
    },
    [editing],
  );

  return (
    <div>
      {editing && (
        <InputNumber
          min={1}
          max={5}
          defaultValue={editingTitle}
          stringMode
          step={0.1}
          precision={1}
          onBlur={onEndEditing}
        />
      )}
      {!editing && <SeeButton onClick={onEditing}>{editingTitle}</SeeButton>}
    </div>
  );
};

export default function AssignmentGrading({
  // reload,
  data,
  tableData,
  taskId,
  isBatchTrainer,
  setData,
  setTableData,
}: Props) {
  const [showType, setShowType] = useState<boolean>(true);
  const [listData, setListData] = useState<SubmissionItem>({} as SubmissionItem);
  const [form] = Form.useForm();
  const onChooseOnly = (item: SubmissionItem) => {
    setShowType(false);
    setListData(item);
  };
  const onDownResource = async (file: ResourcesItem) => {
    const ret = await downloadTaskFile(data.taskId, file.resourceId);
    download(ret, file.name);
  };
  const onChangeSorce = (value: string, userId: string) => {
    let inValue = (+value)?.toFixed(1);
    if (Number(value) > 5) inValue = '5';
    const tarchData = {
      batchId: data.batchId,
      grade: inValue,
      taskId: data.taskId,
      userId,
    };
    //#region 即时更新
    const newData = cloneDeep(data);
    newData.submissions?.some((item: any) => {
      if (item.userId === userId) {
        item.grade = +inValue;
        return true;
      }
      return false;
    });
    setData?.(newData);
    setTableData?.(newData.submissions || []);
    if (listData.userId) {
      newData.submissions?.map((ite) => {
        if (ite.userId == listData.userId) setListData(ite);
      });
    }
    //#endregion
    saveGrade(tarchData).then(() => {
      message.success('edit success');
      //   getAssignmentData(listData.userId);
      // reload?.(listData.userId, setListData);
      form.resetFields(); // 更新之后清空score input中的数字
    });
  };
  const onFinish = (values: any) => {
    onChangeSorce(values.Score, listData.userId);
  };
  const addComment = (value: string) => {
    const subData = {
      batchId: data.batchId,
      taskId: data.taskId,
      userId: listData.userId,
      content: value,
    };
    //#region 即时更新
    const newData = cloneDeep(data);
    newData.submissions?.some((item) => {
      if (item.userId === listData.userId) {
        item.comments = [
          ...(item.comments ?? []),
          {
            content: value,
            commentBy: localStorage.userId,
            commentDateTime: moment(),
            commentId: moment().toString(),
          } as any,
        ];
        setListData(item);
        return true;
      }
      return false;
    });
    setData(newData);
    setTableData(newData.submissions || []);
    //#endregion
    commentAdd(subData).then(() => {
      message.success('add seccess');
      //   getAssignmentData(listData.userId);
      // reload?.(listData.userId, setListData);
    });
  };
  const editComment = (value: string, commentId: string) => {
    const subData = {
      batchId: data.batchId,
      taskId: data.taskId,
      userId: listData.userId,
      content: value,
      commentId,
    };
    //#region 即时更新
    const newData = cloneDeep(data);
    newData.submissions?.some((item) => {
      if (item.userId === listData.userId) {
        item.comments?.some((i) => {
          if (i.commentId === commentId) {
            i.content = value;
            return true;
          }
          return false;
        });
        setListData(item);
        return true;
      }
      return false;
    });
    setData(newData);
    setTableData(newData.submissions || []);
    //#endregion
    commentUpdate(subData).then(() => {
      message.success('edit success');
      //   getAssignmentData(listData.userId);
      // reload?.(listData.userId, setListData);
    });
  };
  const deleteComment = (commentId: string) => {
    const subData = {
      batchId: data.batchId,
      taskId: data.taskId,
      userId: listData.userId,
      commentId,
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
        //#region 即时更新
        const newData = cloneDeep(data);
        newData.submissions?.some((item) => {
          if (item.userId === listData.userId) {
            item.comments = item.comments?.filter((i) => i.commentId !== commentId);
            setListData(item);
            return true;
          }
          return false;
        });
        setData(newData);
        setTableData(newData.submissions || []);
        //#endregion
        commentDelete(subData).then(() => {
          message.success('delete success');
          //   getAssignmentData(listData.userId);
          // reload?.(listData.userId, setListData);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const columns: ColumnsType<SubmissionItem> = [
    {
      title: <div className={styles.tableTitle}>Name</div>,
      dataIndex: 'firstname',
      key: 'firstname',
      render: (_, item) => {
        const values = getUserName(item as any);
        return (
          <Tooltip placement="top" title={getUserName(item as any, true)}>
            {showType ? (
              item.submittedDateTime ? (
                <div
                  className={`${styles.tableName} ${styles.submittedName}`}
                  onClick={() => onChooseOnly(item)}
                >
                  {values}
                </div>
              ) : (
                <div className={styles.tableName}>{values}</div>
              )
            ) : (
              <div className={` ${styles.tableName} ${styles.showName}`}>{values}</div>
            )}
          </Tooltip>
        );
      },
      sorter: (a, b) => {
        const nameA = getUserName(a as any).toLocaleLowerCase();
        const nameB = getUserName(b as any).toLocaleLowerCase();
        return nameA.localeCompare(nameB);
      },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: <div className={styles.tableTitle}>Submission Time</div>,
      dataIndex: 'submittedDateTime',
      key: 'submittedDateTime',
      render: (text) =>
        text ? (
          <span>{date2desc(text)}</span>
        ) : (
          <div className={styles.Unsubmitted}>Unsubmitted</div>
        ),
      sorter: (a, b) => {
        if (a.submittedDateTime < b.submittedDateTime) {
          return -1;
        } else {
          return 1;
        }
      },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: <div className={styles.tableTitle}>Submission</div>,
      dataIndex: 'resources',
      key: 'resources',
      render: (text) => (
        <div className={styles.tableResources}>
          {text && text.length > 0 ? (
            <>
              <span
                onClick={() => {
                  {
                    text.map((file: ResourcesItem) => {
                      onDownResource(file);
                    });
                  }
                }}
              >
                <IconFont type="icon-download-line" style={{ fontSize: 19 }} />
              </span>
              <span style={{ color: '#FFB121' }}> {` ( ${text.length}files )`}</span>{' '}
            </>
          ) : (
            'no'
          )}{' '}
        </div>
      ),
    },
    {
      title: <div className={styles.tableTitle}>Score</div>,
      dataIndex: 'grade',
      key: 'grade',
      width: 120,
      render: (text, item) => (
        <ScoreTitle
          value={text || '0.0-5.0'}
          onTitleChange={(e) => onChangeSorce(e, item.userId)}
          changeShow={isBatchTrainer}
        />
      ),
      sorter: (a, b) => {
        if (Number(a.grade) < Number(b.grade)) {
          return -1;
        } else {
          return 1;
        }
      },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: <div className={styles.tableTitle}>Comment</div>,
      dataIndex: 'comments',
      key: 'comments',
      render: (text) => (
        <div className={styles.tableComments}>{text && text.length ? text.length : 'na'}</div>
      ),
    },
  ];
  return (
    <div className={styles.assignmentTableContentWrap}>
      <Table
        columns={columns}
        dataSource={showType ? tableData : [listData]}
        pagination={false}
        rowKey="userId"
      />
      {!showType && (
        <div className={styles.assignmentTableContentDetail}>
          <div className={styles.detailsLeft}>
            <div className={styles.detailsLeftName}>
              Grading for
              <span className={styles.detailsLeftNamePeople}>
                {' '}
                {listData.firstname + ' ' + listData.lastname}
              </span>
            </div>
            <div className={styles.detailsLeftResource}>
              <span className={styles.resourcesName}>Trainee’s Submission</span>
              <div className={styles.resourceList}>
                <UploadPreview
                  data={listData.resources}
                  downIcon
                  taskId={taskId}
                  // onDown={(e: ResourcesItem) => onDownResource(e)}
                />
                {listData.resources?.length > 0 && (
                  <div className={styles.resourceListData}>
                    {date2desc(listData.submittedDateTime)}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.detailsScore}>
              <Form layout={'inline'} form={form} onFinish={onFinish}>
                <Form.Item
                  label="Score"
                  name="Score"
                  rules={[{ required: true, message: 'Please input Score!' }]}
                >
                  <InputNumber
                    min={1}
                    max={5}
                    stringMode
                    step={0.1}
                    precision={1}
                    placeholder="scale 0-5"
                  />
                </Form.Item>
                <Form.Item>
                  <SeeButton type="primary" htmlType="submit" disabled={!isBatchTrainer}>
                    Save
                  </SeeButton>
                </Form.Item>
              </Form>
            </div>
            <SeeButton
              className={styles.backButton}
              onClick={() => {
                setShowType(true);
                setListData({} as SubmissionItem);
              }}
            >
              Back to List
            </SeeButton>
          </div>
          <div className={styles.detailsRight}>
            <CommentList
              data={listData.comments}
              addComment={addComment}
              editComment={editComment}
              deleteComment={deleteComment}
              addable={isBatchTrainer}
            />
          </div>
        </div>
      )}
    </div>
  );
}
