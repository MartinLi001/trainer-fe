import { message, Modal } from 'antd';
import styles from './index.less';
import SeeButton from '@/components/SeeButton';
import { useState } from 'react';
import { lockTask } from '@/services/batch';
export interface CreateModal {
  visible: boolean;
  batchId: string;
  taskId: string;
  onClose: () => void;
  onOk: () => void;
}

const LockTaskModal = ({ visible, onClose, onOk, batchId, taskId }: CreateModal) => {
  const [loading, setLoading] = useState<boolean>(false);

  const lockThisTask = () => {
    setLoading(true);
    lockTask({ batchId: batchId, taskId: taskId }).then(() => {
      message.success('lock success！');
      setLoading(false);
      if (onOk) onOk();
    });
  };
  return (
    <>
      <Modal
        title={<div className={styles.modalTitle}>Lock Task</div>}
        open={visible}
        width={600}
        onCancel={() => {
          onClose();
        }}
        destroyOnClose
        footer={[
          <SeeButton type="ghost" key="cancel" onClick={() => onClose()}>
            Cancel
          </SeeButton>,
          <SeeButton
            type="danger"
            key="save"
            loading={loading}
            onClick={() => {
              lockThisTask();
            }}
          >
            Lock
          </SeeButton>,
        ]}
      >
        <div className={styles.modalShow}>
          <p className={styles.modalSelect}>Are you sure of lockling the task bellow?</p>
        </div>
      </Modal>
    </>
  );
};

export default LockTaskModal;
