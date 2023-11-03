import CommonModal from '@/components/CommonModal';
import Counter from '@/components/Counter';
import { updateTaskWeight } from '@/services/kpi';
import { roundingOff } from '@/utils';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

export interface UpdateTaskWeightDataType {
  batchId: string;
  taskId: string;
  type: string;
  priority: number;
  weight: number;
  label: string;
  totalWeight: number;
}
interface Props {
  open: boolean;
  onCancel: () => void;
  onSave?: (value: number) => void;
  data?: UpdateTaskWeightDataType;
}
export default function UpdateTaskWeightModal(props: Props) {
  const { open, onCancel, onSave, data = {} as UpdateTaskWeightDataType } = props;
  const [weightValue, setWeightValue] = useState(0);
  const { loading: loading, runAsync: updateTaskWeightFun } = useRequest(updateTaskWeight, {
    manual: true,
  });

  useEffect(() => {
    setWeightValue(+roundingOff(data.weight || 0, 1));
  }, [data]);

  function onOk() {
    if (data.totalWeight - data.weight + weightValue <= 0) {
      message.error('Total of weights must be greater than zero.');
      return;
    }
    updateTaskWeightFun({
      batchId: data.batchId,
      taskWeights: [
        {
          taskId: data.taskId,
          type: data.type,
          priority: data.priority,
          weight: weightValue,
        },
      ],
    })
      .then(() => {
        onSave?.(weightValue);
        onCancel?.();
        // message.success('Edited score successfully.');
      })
      .catch(() => message.error('Error!'));
  }
  return (
    <CommonModal
      destroyOnClose
      centered
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      title="Adjust Weight"
      okText="Save"
      okButtonProps={{ loading: loading }}
      className={styles.UpdateTaskWeightModalWrap}
      width={461}
    >
      <div className={styles.content}>
        <div className={styles.label}>{data.label}</div>
        <Counter
          min={0}
          max={Infinity}
          step={0.1}
          precision={1}
          value={weightValue}
          onChange={(v) => setWeightValue(v)}
        />
      </div>
    </CommonModal>
  );
}
