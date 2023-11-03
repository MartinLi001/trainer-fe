import { Modal } from 'antd';

import SeeButton from '@/components/SeeButton';
import styles from './index.less';
import moment from 'moment';

export interface CreateModal {
  loading: boolean;
  data: API.TaskType;
  visible: boolean;
  onClose: () => void;
  onOk: (values: API.TaskType) => void;
}

const DeleteModal = ({ visible, onClose, data, onOk, loading }: CreateModal) => {
  const { description, name, type, startDateTime, priority } = data ?? {};

  if (!data) return null;
  return (
    <>
      <Modal
        title="Delete Task"
        open={visible}
        width={557}
        onCancel={() => {
          onClose();
        }}
        destroyOnClose
        footer={[
          <SeeButton type="ghost" key="cancel" onClick={() => onClose()}>
            Cancel
          </SeeButton>,
          <SeeButton type="danger" key="save" loading={loading} onClick={onOk}>
            Delete
          </SeeButton>,
        ]}
      >
        <div className={styles.wrap}>
          <div className={styles.question}>Are you sure of deleting the task bellow?</div>

          <div className={styles.tip}>
            You can only delete the task when there are no submissions yet.
          </div>

          <div className={styles.task}>
            <div className={styles.head}>
              {`Day ${priority} - ${
                startDateTime ? moment(startDateTime).format('MMMM Do YYYY') : ''
              }`}
            </div>
            <div className={styles.body}>
              <div className={styles.title}>
                <span className={styles.name}>{name}</span>
                <span
                  className={`${styles.icon} ${
                    type && type.includes('Mock') ? styles.Mock : styles[type]
                  }`}
                >
                  {type}
                </span>
              </div>
              <div className={styles.content}>{description}</div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteModal;
