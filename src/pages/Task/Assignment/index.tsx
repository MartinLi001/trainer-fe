import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import { AssignmentType, ResourcesItem, SubmissionItem } from './typeList';
import { downloadTaskFile, getTaskInfo } from '@/services/course';
import PageHeader, { PageHeaderItemType } from '@/components/PageHeader';
import CardTitle from '@/components/CardTitle';
import IconFont from '@/components/IconFont';
import { date2desc, download, getUserName } from '@/utils';
import {
  Dropdown,
  Empty,
  Form,
  InputNumber,
  Menu,
  message,
  Modal,
  Table,
  Tooltip,
  UploadFile,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UploadPreview } from '@/components/PreviewBar';
import {
  saveGrade,
  deleteResource,
  commentAdd,
  commentUpdate,
  commentDelete,
  ResourceAdd,
} from '@/services/assignment';
import CommentList from './components/CommentList/index';
import SeeButton from '@/components/SeeButton';
import UpFileModal from '@/components/UpFile';
import { RcFile } from 'antd/lib/upload';
import { MoreOutlined } from '@ant-design/icons';
import EditModal from '@/pages/MyBatch/components/EditModal';
import UnlockModal from '@/pages/MyBatch/components/UnlockModal';
import { updateTask, unlockTask } from '@/services/batch';
import { useRequest } from 'ahooks';
import LockTaskModal from '@/components/lockTask';
import AssRefersh from '@/assets/AssRefersh.svg';
import moment from 'moment';
import { useSelector } from 'umi';
import { cloneDeep } from 'lodash';

// import AssignmentGrading from './components/Grading';

interface AssignmentProps {
  taskId: string;
  type?: string;
  pageHeaderItems: PageHeaderItemType[];
}
interface ScoreProps {
  value: number | string;
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
const Assignment: React.FC<AssignmentProps> = ({ taskId, pageHeaderItems }) => {
  const [data, setData] = useState<AssignmentType>({} as AssignmentType);
  const [tableData, setTableData] = useState<SubmissionItem[]>([]);
  const [showType, setShowType] = useState<boolean>(true);
  const [listData, setListData] = useState<SubmissionItem>({} as SubmissionItem);
  const [form] = Form.useForm();
  const [upLoadFileVisible, setUpLoadFileVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [unlockModalVisible, setUnlockModalVisible] = useState<boolean>(false);
  const [lockModalVisible, setLockModalVisible] = useState<boolean>(false);

  const { loading: unlockLoading, runAsync: unlockTaskFun } = useRequest(unlockTask, {
    manual: true,
  });

  const { loading: upfileLoading, runAsync: upLoadFileListFun } = useRequest(ResourceAdd, {
    manual: true,
  });
  const { Batch } = useSelector((state) => state) as any;
  const isBatchTrainer = useMemo(
    () => Batch?.data?.trainers?.some((i: any) => i.userId === localStorage.userId),
    [Batch],
  );

  const getAssignmentData = async (userId?: string) => {
    const assignmentData = (await getTaskInfo(taskId)) as AssignmentType;
    setData(assignmentData);
    setTableData(assignmentData.submissions || []);
    if (userId) {
      assignmentData.submissions?.map((ite) => {
        if (ite.userId == userId) setListData(ite);
      });
    }
  };
  useEffect(() => {
    getAssignmentData();
  }, []);

  const onChangeSorce = (value: string, userId: string) => {
    let inValue = Number(value).toFixed(1);
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
    setData(newData);
    setTableData(newData.submissions || []);
    if (listData.userId) {
      newData.submissions?.map((ite) => {
        if (ite.userId == listData.userId) setListData(ite);
      });
    }
    //#endregion
    saveGrade(tarchData).then(() => {
      message.success('edit success');
      // getAssignmentData(listData.userId);
      form.resetFields(); // 更新之后清空score input中的数字
    });
  };
  const onChooseOnly = (item: SubmissionItem) => {
    setShowType(false);
    setListData(item);
  };
  const onDownResource = async (file: ResourcesItem) => {
    const ret = await downloadTaskFile(data.taskId, file.resourceId);
    download(ret, file.name);
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
          <span>
            {moment(text).format(' hh:mm A MMM D YYYY')}{' '}
            {text > data.endDateTime && <span style={{ color: '#FFB121' }}>(Late)</span>}
          </span>
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
          value={item.grade ?? '0.0-5.0'}
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

  const renderTag = (title: string, value: string) => {
    if (!title || !value) return;
    return (
      <div className={styles.textBlock}>
        <div className={styles.title}> {title}</div>
        <div className={styles.value}>{value}</div>
      </div>
    );
  };
  const renderLine = (
    title: string,
    value: string | number,
    backColor?: string,
    color?: string,
  ) => {
    if (!title || !value) return;
    return (
      <div className={styles.textLine}>
        <div className={styles.title}> {title}</div>
        <div
          className={styles.value}
          style={{ backgroundColor: backColor || '#FFF', color: color }}
        >
          {value}
        </div>
      </div>
    );
  };

  const onRemove = (file: ResourcesItem) => {
    const submitData = {
      batchId: data.batchId,
      taskId: data.taskId,
      resourceId: file.resourceId,
      path: file.downloadLink,
    };
    deleteResource(submitData).then(() => {
      message.success('delete success');
      // getAssignmentData();
      setData((oldData: any) => {
        const newData = cloneDeep(oldData);
        newData.resources = oldData.resources.filter((i: any) => i.resourceId !== file.resourceId);
        return newData;
      });
    });
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
      // getAssignmentData(listData.userId);
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
          // getAssignmentData(listData.userId);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const onFinish = (values: any) => {
    onChangeSorce(values.Score, listData.userId);
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
      // getAssignmentData(listData.userId);
    });
  };
  const upLoadFileList = (fileList: UploadFile[]) => {
    const values = {
      batchId: data.batchId,
      taskId: data.taskId,
    };
    const formData = new FormData();
    if (fileList.length) {
      fileList.forEach((file) => {
        formData.append('files', file as RcFile);
      });
    }
    formData.append('task', JSON.stringify({ ...values }));
    upLoadFileListFun(formData).then(() => {
      message.success('upload success');
      setUpLoadFileVisible(false);
      getAssignmentData();
    });
  };
  const editDataSub = (values: any) => {
    console.log('%cindex.tsx line:340 values', 'color: #007acc;', values);
    if (values.endDateTime) {
      values.endDateTime = values.endDateTime.format();
    }
    if (values.startDateTime) {
      values.startDateTime = values.startDateTime.format();
    }
    const submitData = {
      ...values,
      batchId: data.batchId,
      taskId: data.taskId,
    };

    updateTask(submitData).then(() => {
      message.success('update success');
      // getAssignmentData();
      setData((oldData: any) => {
        return { ...oldData, ...values };
      });
      setEditModalVisible(false);
    });
  };

  const menuClick = (type: string) => {
    if (type == 'edit') {
      setEditModalVisible(true);
    }
    if (type == 'unlock') {
      setUnlockModalVisible(true);
    }
    if (type == 'lock') {
      setLockModalVisible(true);
    }
  };
  const renderMenu = () => {
    const menuItems = [
      {
        label: 'Edit Task',
        key: 'edit',
      },
    ];

    if (data.isLocked) {
      menuItems.unshift({
        label: 'Unlock Task',
        key: 'unlock',
      });
    }
    if (!data.isLocked) {
      menuItems.unshift({
        label: 'Lock Task',
        key: 'lock',
      });
    }
    return <Menu onClick={(e) => menuClick(e.key)} items={menuItems} />;
  };
  return (
    <>
      <PageHeader
        items={[
          ...pageHeaderItems,
          {
            name: data.name,
          },
        ]}
      />
      <div className={styles.assignment}>
        <div className={styles.assignmentTop}>
          <div className={styles.assignmentTopLeft}>
            <CardTitle
              title={`${data?.type || 'Assignment'} Information`}
              iconFont={<IconFont type="icon-information-line" />}
              extra={
                <Dropdown overlay={renderMenu()} trigger={['click']}>
                  <span style={{ marginLeft: 20 }} onClick={(e) => e.preventDefault()}>
                    <MoreOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
                  </span>
                </Dropdown>
              }
            />
            <div className={styles.assignmentTopLeftContent}>
              {renderTag(`${data?.type || 'Assignment'} Title`, data.name)}
              {renderLine('Day', data.priority, '#F3FAFF', '#1D355E')}
              {renderLine('Start Date', date2desc(data.startDateTime), '#F3FAFF', '#1D355E')}
              {renderLine('End Date', date2desc(data.endDateTime), '#F3FAFF', '#1D355E')}
              {renderTag('Description', data.description)}
              {renderTag('Instruction', data.instruction)}
              {!data.enableLateSubmission
                ? renderLine('Late Submission', 'Disabled', '#EBECF0', '#1D355E')
                : renderLine('Late Submission', 'Enabled', '#F4FBEA', '#76AC1E')}
            </div>
          </div>
          <div className={styles.assignmentTopRight}>
            <CardTitle
              title="Resources"
              iconFont={<IconFont type="icon-file-zip-line" />}
              extra={
                <span
                  className={styles.icon}
                  onClick={() => {
                    setUpLoadFileVisible(true);
                  }}
                >
                  <IconFont type="icon-add-line" />
                </span>
              }
            />
            <div className={styles.assignmentTopRightContent}>
              {data?.resources ? (
                <UploadPreview
                  data={data.resources}
                  downIcon
                  taskId={taskId}
                  // onDown={(e: ResourcesItem) => onDownResource(e)}
                  onRemove={(e: ResourcesItem) => onRemove(e)}
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </div>
        </div>
        <div className={styles.assignmentTable}>
          <CardTitle title="Grading" iconFont={<IconFont type="icon-draft-line" />}>
            <img
              src={AssRefersh}
              onClick={() => {
                getAssignmentData(listData.userId).then(() => {
                  message.success('refersh success');
                });
              }}
            ></img>
          </CardTitle>
          <div className={styles.assignmentTableContent}>
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
                      <UploadPreview data={listData.resources} downIcon taskId={taskId} />
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
        </div>
      </div>
      {/* {upLoadFileVisible && ( */}
      <UpFileModal
        visible={upLoadFileVisible}
        onClose={() => setUpLoadFileVisible(false)}
        onOk={upLoadFileList}
        loading={upfileLoading}
      />
      {/* )} */}
      {editModalVisible && (
        <EditModal
          data={data}
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
          }}
          onOk={editDataSub}
        />
      )}
      {unlockModalVisible && (
        <UnlockModal
          visible={unlockModalVisible}
          loading={unlockLoading}
          onClose={() => {
            setUnlockModalVisible(false);
          }}
          onOk={(values) => {
            unlockTaskFun({
              ...values,
              batchId: data.batchId,
              taskId: data.taskId,
            }).then(() => {
              message.success('unlock success');
              setUnlockModalVisible(false);
              // getAssignmentData();
              setData((oldData: any) => {
                return {
                  ...oldData,
                  startDateTime: values.startDateTime,
                  endDateTime: moment(values.startDateTime).add(oldData.duration, 'h'),
                  isLocked: false,
                };
              });
            });
          }}
        />
      )}
      {lockModalVisible && (
        <LockTaskModal
          batchId={data.batchId}
          taskId={data.taskId}
          visible={lockModalVisible}
          onClose={() => {
            setLockModalVisible(false);
          }}
          onOk={() => {
            // getAssignmentData();
            setData((oldData: any) => {
              return { ...oldData, isLocked: true };
            });
            setLockModalVisible(false);
          }}
        />
      )}
    </>
  );
};

export default Assignment;
