import CommonModal from '@/components/CommonModal';
import Counter from '@/components/Counter';
import { Form, message } from 'antd';
import React, { useEffect } from 'react';
import styles from './index.less';

export interface RatioType {
  id: string;
  label: string;
  value: number;
}
interface Props {
  open: boolean;
  onCancel: () => void;
  loading: boolean;
  RatioesData: RatioType[];
  onSave: (data: Record<string, number>) => void;
}
export default function AdjustRatioModal(props: Props) {
  const { open, onCancel, loading, RatioesData = [], onSave } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (open) form.resetFields();
  }, [open]);

  return (
    <CommonModal
      centered
      open={open}
      onCancel={() => onCancel()}
      onOk={() => {
        const data: Record<string, number> = form.getFieldsValue(true);
        if (Math.abs(Object.values(data).reduce((a, b) => a + b) - 1) > 0.000000001) {
          message.error('Weights must sum to 1');
          return;
        }
        onSave?.(data);
      }}
      title="Adjust Category  Ratio"
      okText="Save"
      okButtonProps={{ loading: loading }}
      className={styles.AdjustRatioModalWrap}
      width={600}
    >
      <div className={styles.tip}>The sum of the ratio should be 1</div>
      <Form form={form} className={styles.counterBox}>
        {RatioesData.map((item) => (
          <div key={item.id + 'label'}>
            <div className={styles.label}>{item.label}</div>
            <Form.Item name={item.id} initialValue={item.value} className={styles.counterInput}>
              <Counter
                min={0}
                max={1}
                step={0.1}
                // value={item.value}
                onChange={(v) => form.setFieldValue(item.id, v)}
              />
            </Form.Item>
          </div>
        ))}
      </Form>
    </CommonModal>
  );
}
