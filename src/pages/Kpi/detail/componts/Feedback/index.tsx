import React, { useEffect, useState } from 'react';
import styles from './index.less';
import CardTitle from '@/components/CardTitle';
import { Col, Dropdown, Menu, message, Modal, Row, Spin } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import FeedBackModal from '../FeedBackModal';
import FeedBackDetail from '../FeedBackDetail';
import { addSummary, updateSummary, deleteSummary } from '@/services/kpi';
import { FeedbackType } from '../../typeList';
import { date2desc } from '@/utils';
import moment from 'moment';
import Empty from '@/components/KpiEmpty';

interface Props {
  list: FeedbackType[];
  batchId: string;
  traineeId: string;
  getData: () => void;
}

export default function Feedback({ list, traineeId, getData }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalValue, setModalValue] = useState<FeedbackType>({} as FeedbackType);
  const userId = localStorage.getItem('userId') as string;
  const [dataList, setDataList] = useState<FeedbackType[]>();

  useEffect(() => {
    setLoading(false);
    const temp = [...(list || [])];
    temp.sort((a, b) => {
      const dataA = moment(a.createdDateTime);
      const dataB = moment(b.createdDateTime);
      if (dataA > dataB) {
        return 1;
      } else {
        return -1;
      }
    });
    setDataList([...temp]);
  }, [list]);

  const editOrSaveFeed = (data: FeedbackType) => {
    const dataValue = {
      userId: traineeId,
      summary: { ...data },
    };
    if (data.summaryId) {
      updateSummary(dataValue).then(() => {
        message.success('update Success');
        getData();
      });
    } else {
      addSummary(dataValue)
        .then(() => {
          message.success('Added feedback successfully');
          getData();
        })
        .catch(() => {
          message.warning('Failed to add feedback');
        });
    }
    setModalValue({} as FeedbackType);
    setOpenModal(false);
  };

  const editFeed = (value: FeedbackType) => {
    setModalValue({ ...value });
    setOpenModal(true);
  };
  const deleteFeed = (value: FeedbackType) => {
    Modal.confirm({
      title: 'Delete FeedBacK',
      content: (
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, lineHeight: '26px' }}>
            Are you sure of deleting the feedback?
          </p>
          <p>This action CANNOT be undone.</p>
        </div>
      ),
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk() {
        const submitData = {
          userId: traineeId,
          summaryId: value.feedbackId,
        };
        deleteSummary(submitData)
          .then(() => {
            message.success('delete success');
            getData();
          })
          .catch(() => {
            message.warning('Failed to delete feedback');
            deleteFeed(value);
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const renderMenu = (item: FeedbackType) => {
    const menuItems = [
      {
        label: <a onClick={() => editFeed(item)}>edit</a>,
        key: 'edit',
      },
      {
        label: <a onClick={() => deleteFeed(item)}>delete</a>,
        key: 'delete',
      },
    ];
    return <Menu items={menuItems} />;
  };
  return (
    <div className={styles.Feedback}>
      <Spin spinning={loading}>
        <CardTitle
          title={
            <div>
              Feedback <PlusOutlined onClick={() => setOpenModal(true)} />{' '}
            </div>
          }
        />
        <div className={styles.FeedbackContent}>
          {list && list.length > 0 ? (
            <div className={styles.contentAll}>
              <Row>
                {(dataList || []).map((item, index) => {
                  return (
                    <Col span={12}>
                      <div className={styles.FeedBackCard}>
                        <CardTitle
                          title={`Training Feedback ${index + 1}`}
                          extra={
                            item.userId === userId ? (
                              <Dropdown overlay={renderMenu(item)} trigger={['click']}>
                                <span
                                  style={{ marginLeft: 20 }}
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <MoreOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
                                </span>
                              </Dropdown>
                            ) : (
                              ''
                            )
                          }
                        />
                        <div className={styles.overall}>
                          <div className={styles.title}>
                            <div className={styles.byOther}>
                              Overall Feedback by{' '}
                              <span style={{ color: '#2875D0' }}>
                                {item.reviewer?.firstName} {item.reviewer?.lastName}
                              </span>
                            </div>
                            <div className={styles.commData}>
                              {date2desc(moment.utc(item?.createdDateTime).local().format() || '')}
                            </div>
                          </div>
                          <div className={styles.detail}>{item.overall}</div>
                        </div>
                        <FeedBackDetail data={item.details} />
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </Spin>
      {openModal && (
        <FeedBackModal
          visible={openModal}
          data={modalValue}
          onClose={() => {
            setModalValue({} as FeedbackType);
            setOpenModal(false);
          }}
          onOk={(e) => editOrSaveFeed(e)}
          userId={userId}
        />
      )}
    </div>
  );
}
