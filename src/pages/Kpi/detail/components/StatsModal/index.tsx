import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';
import Counter from '@/components/Counter';
import SeeButton from '@/components/SeeButton';
import styles from './index.less';
import { PutKpiScoreProp } from '@/services/kpi';

interface FormProps {
  data: any;
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSave: (values: PutKpiScoreProp) => void;
}

const StatsModal: React.FC<FormProps> = ({ data = {}, open, loading, onSave, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open)
      form.setFieldsValue({
        communicationScore: +data.communicationScore?.toFixed(1),
        behavioralScore: +data.behavioralScore?.toFixed(1),
      });
  }, [data, open]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      destroyOnClose
      onCancel={onCancel}
      open={open}
      title={
        <>
          Edit Score for <span style={{ color: '#2875D0' }}>{data.fullName ?? ''}</span>
        </>
      }
      footer={[
        <SeeButton key="back" onClick={onCancel}>
          Cancel
        </SeeButton>,
        <SeeButton key="submit" type="primary" loading={loading} onClick={handleOk}>
          Save
        </SeeButton>,
      ]}
    >
      <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ offset: 1 }} className={styles.form}>
        <Form.Item name="communicationScore" label="Communication" colon={false}>
          <Counter />
        </Form.Item>
        <Form.Item name="behavioralScore" label="Behavioral" colon={false}>
          <Counter />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StatsModal;
