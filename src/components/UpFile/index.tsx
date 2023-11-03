import { Modal, UploadFile } from 'antd';
import style from './index.less';
import { useEffect, useRef, useState } from 'react';
import SeeButton from '@/components/SeeButton';
import { UploadPreview } from '../PreviewBar';
import DetailsUpload from '../DetailsUpload';
import type { RcFile } from 'antd/lib/upload';
export interface deleteModal {
  visible: boolean;
  onClose: () => void;
  onOk: (fileList: UploadFile[]) => void;
  loading: boolean;
}
function UpFileModal({ visible, onClose, onOk, loading }: deleteModal) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const ref = useRef<any>();

  useEffect(() => {}, []);
  const beforeUpload = (FileList: RcFile[], error?: string) => {
    setFileList(FileList);
    setErrorMessage(error || '');
  };
  return (
    <>
      <Modal
        destroyOnClose
        afterClose={() => setFileList([])}
        title={<div className={style.modalTitle}>Upload Resource </div>}
        open={visible}
        onCancel={onClose}
        footer={[
          <SeeButton type="ghost" onClick={() => onClose()} key={'cancel'}>
            Cancel
          </SeeButton>,
          <SeeButton
            type="primary"
            onClick={() => onOk(fileList)}
            key={'Upload'}
            loading={loading}
            disabled={fileList.length == 0}
          >
            Upload
          </SeeButton>,
        ]}
        width={600}
      >
        <div className={style.upFileModal}>
          <div className={style.maxFileshow}>Max File Size: 20 MB</div>
          <DetailsUpload
            ref={ref}
            beforeUpload={beforeUpload}
            accept={'.zip,.pdf'}
            style={{ width: 380 }}
          />
          {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
          <div className={style.upLoadFileList}>
            <UploadPreview data={fileList} onRemove={ref.current?.onRemove} />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UpFileModal;
