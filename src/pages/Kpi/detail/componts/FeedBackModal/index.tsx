import { Col, Form, Input, Modal, Row } from 'antd';
import style from './index.less';
import { useEffect, useState } from 'react';
import SeeButton from '@/components/SeeButton';
import TextArea from 'antd/lib/input/TextArea';
import { FeedbackType, Feeddetails } from '../../typeList';
import FeedBackDetail from '../FeedBackDetail';

export interface deleteModal {
  visible: boolean;
  data: FeedbackType;
  onClose: () => void;
  onOk: (data: FeedbackType) => void;
  userId: string;
}
function FeedBackModal({ visible, onClose, data, onOk, userId }: deleteModal) {
  const [form] = Form.useForm();
  const [detailName, setDetailName] = useState<string>('');
  const [detailValue, setDetailValue] = useState<string>('');
  const [detailList, setDetailList] = useState<Feeddetails[]>([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '');
  const [editIndex, setEditIndex] = useState<Feeddetails>({} as Feeddetails);

  useEffect(() => {
    setDetailList(data.details || []);
    form.setFieldsValue(data);
  }, [data]);

  const onFinish = (values: any) => {
    const temp = {
      overall: values.overall,
      details: [...detailList],
      userId,
      summaryId: data.feedbackId || data.summaryId || '',
    };
    onOk(temp);
  };

  const clearAll = () => {
    setDetailName('');
    setDetailValue('');
    setEditIndex({} as Feeddetails);
  };
  const deleteFeedDetail = (index: number) => {
    const temp = [...detailList];
    temp.splice(index, 1);
    setDetailList([...temp]);
  };
  const editFeedDetail = (feed: Feeddetails, index: number) => {
    setDetailName(feed.name);
    setDetailValue(feed.value);
    const temp = [...detailList];
    temp.splice(index, 1);
    if (Object.getOwnPropertyNames(editIndex).length != 0) {
      temp.push({ ...editIndex });
    }
    setDetailList([...temp]);
    setEditIndex(feed);
  };

  const SaveDetail = () => {
    const temp = [...detailList];
    temp.push({
      name: detailName,
      value: detailValue,
    });
    setDetailList([...temp]);
    clearAll();
  };

  return (
    <>
      <Modal
        title={
          <div className={style.modalTitle}>
            {data.overall ? `Edit ` : 'Add '}Feedback for{' '}
            <span style={{ color: '#2875D0' }}>
              {userInfo?.firstName || ''}
              {userInfo?.lastName || ''}
            </span>
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={900}
      >
        <div className={style.FeedBackModalShow}>
          <div className={style.leftShow}>
            <Form name="basic" layout="vertical" form={form} onFinish={onFinish}>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="Overall Feedback"
                    name="overall"
                    rules={[{ required: true, message: 'Please input your Feedback!' }]}
                  >
                    <TextArea rows={4} placeholder="Text" />
                  </Form.Item>
                  <div className={style.addDetail}>
                    <p>Details</p>
                    <span>Name</span>
                    <Input
                      placeholder="i.e. Coding"
                      value={detailName}
                      onChange={(e) => setDetailName(e.target.value)}
                    />
                    <span>Value</span>
                    <TextArea
                      rows={4}
                      placeholder="i.e. Coding has been improved since last week"
                      value={detailValue}
                      onChange={(e) => setDetailValue(e.target.value)}
                    />
                    <div className={style.addbuttonList}>
                      <SeeButton
                        style={{ marginRight: 10 }}
                        disabled={detailName === '' && detailValue === ''}
                        onClick={() => {
                          clearAll();
                        }}
                      >
                        Clear
                      </SeeButton>
                      <SeeButton
                        type="primary"
                        disabled={detailName === '' || detailValue === ''}
                        onClick={() => SaveDetail()}
                      >
                        Enter Detail
                      </SeeButton>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={style.rightDetail}>
                    <FeedBackDetail
                      data={detailList}
                      editFeed={editFeedDetail}
                      deleteFeed={deleteFeedDetail}
                    />
                  </div>
                </Col>
              </Row>
              <Form.Item>
                <div className={style.buttonList}>
                  <SeeButton onClick={onClose}>Cancel</SeeButton>
                  <SeeButton type="primary" htmlType="submit">
                    Save
                  </SeeButton>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default FeedBackModal;
