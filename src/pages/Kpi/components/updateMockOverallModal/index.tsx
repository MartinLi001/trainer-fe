import CommonModal from '@/components/CommonModal';
import Counter from '@/components/Counter';
import { updateMockOverall } from '@/services/kpi';
import { roundingOff } from '@/utils';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

export interface UpdateOverallType {
  batchId: string;
  priority: number;
  taskId: string;
  traineeId: string;
  name: string;
  type: string;
  overall: number;
}
interface Props {
  open: boolean;
  onCancel: () => void;
  onSave?: (value: number) => void;
  data?: UpdateOverallType;
}
export default function UpdateMockOverallModal(props: Props) {
  const { open, onCancel, onSave, data = {} as UpdateOverallType } = props;
  const [overallValue, setOverallValue] = useState(0);
  const { loading: loading, runAsync: updateMockOverallFun } = useRequest(updateMockOverall, {
    manual: true,
  });
  useEffect(() => {
    setOverallValue(+roundingOff(data.overall || 0, 1));
  }, [data]);

  function onOk() {
    updateMockOverallFun({
      batchId: data.batchId,
      priority: data.priority,
      taskId: data.taskId,
      overalls: [
        {
          traineeId: data.traineeId,
          overall: overallValue,
        },
      ],
    })
      .then(() => {
        onSave?.(overallValue);
        onCancel?.();
        message.success('Edited score successfully.');
      })
      .catch(() => message.error('Failed to edit score.'));
  }

  return (
    <CommonModal
      destroyOnClose
      centered
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      title={
        <div>
          Edit Score for <span className={styles.titleName}>{data?.name}</span>
        </div>
      }
      okText="Save"
      okButtonProps={{ loading: loading }}
      className={styles.UpdateMockOverallModalWrap}
      width={600}
    >
      <div className={styles.content}>
        <div className={styles.label}>{data?.type}</div>
        <Counter
          min={0}
          max={6}
          step={0.1}
          precision={1}
          value={overallValue}
          onChange={(v) => setOverallValue(v)}
        />
      </div>
    </CommonModal>
  );
}
