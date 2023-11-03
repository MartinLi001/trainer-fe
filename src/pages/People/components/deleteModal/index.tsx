import { Modal } from 'antd';
import { PeopleType } from '../../typeList';
import style from './index.less';
import ListPeople from '../ListItem';
import { useEffect } from 'react';
import SeeButton from '@/components/SeeButton';

export interface deleteModal {
  list: PeopleType[];
  visible: boolean;
  type: string;
  onClose: () => void;
  onOk: (type: string) => void;
}
function DeleteModal({ list = [], visible, onClose, onOk, type }: deleteModal) {
  useEffect(() => {}, []);

  return (
    <>
      <Modal
        title={<div className={style.modalTitle}>Delete {type}</div>}
        open={visible}
        onCancel={onClose}
        footer={[
          <SeeButton type="ghost" onClick={() => onClose()} key={'cancel'}>
            Cancel
          </SeeButton>,
          <SeeButton type="danger" onClick={() => onOk(type)} key={'delete'}>
            Delete
          </SeeButton>,
        ]}
        width={550}
      >
        <div className={style.deleteModalShow}>
          <div className={style.modalTop}>
            <div className={style.TopAreyou}>Are you sure of deleting the following {type}(s)</div>
            <div className={style.TopData}>
              The data related to the {type}(s) in this batch will also be permanently deleted.
            </div>
          </div>
          <div className={style.deleteValueShow}>
            <ListPeople data={list} />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteModal;
