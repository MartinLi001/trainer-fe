import { Modal } from 'antd';
import styles from './index.less';
import SeeButton from '@/components/SeeButton';
import { useEffect, useState } from 'react';
import TagNav from '../TagNav';

export interface CreateModal {
  peopleList: API.AllBatchType;
  openList: string[];
  loading: boolean;
  visible: boolean;
  onClose: () => void;
  onOk: (values: string[]) => void;
}

const ReOpenModal = ({ visible, loading, onClose, onOk, peopleList, openList }: CreateModal) => {
  const [reopenValue, setReopenValue] = useState<string[]>([]);
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    setReopenValue(openList || []);
    let temp = [...(peopleList?.trainees ?? [])];
    temp.sort((a, b) => {
      return a.firstName.localeCompare(b.firstName);
    });
    setList([...temp]);
  }, [visible]);

  const onchange = (e: string[]) => {
    setReopenValue(e);
  };

  return (
    <>
      <Modal
        title={<div className={styles.modalTitle}>Manage Reopenning List</div>}
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
            type="primary"
            key="save"
            loading={loading}
            onClick={() => {
              onOk(reopenValue);
            }}
          >
            Save
          </SeeButton>,
        ]}
      >
        <div className={styles.modalShow}>
          <div className={styles.modalShowTop}>
            <p className={styles.modalSelect}>Select trainee to allow them submit</p>
            <p className={styles.modalUnselect}>Click again to unselect</p>
          </div>
          <div className={styles.checkList}>
            <TagNav list={list} value={reopenValue} onChange={(e) => onchange(e)} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReOpenModal;
