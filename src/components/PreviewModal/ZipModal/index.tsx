import { Modal, Spin } from 'antd';
import SeeButton from '@/components/SeeButton';
import ZipImg from '@/assets/zip.svg';
import styles from './index.less';
import { useMemo } from 'react';

export default function ZipModal(props: any) {
  const { visible, file, loading, onCancel } = props;

  const fileSize = useMemo(() => {
    if (!file?.file) return '0kb';
    const { size } = file?.file;
    if (size > 1024) {
      return (size / 1024 / 1024).toFixed(2) + 'M';
    }
    return `${size}kb`;
  }, [file]);

  return (
    <Modal
      centered
      open={visible}
      onCancel={() => onCancel()}
      width="600px"
      style={{
        height: 500,
      }}
      title="Preview Zip File"
      footer={[
        <SeeButton type="ghost" onClick={onCancel}>
          Cancel
        </SeeButton>,
      ]}
    >
      <Spin spinning={loading} tip="loading...">
        <div className={styles.contentWrap}>
          <img src={ZipImg} alt="zip" className={styles.img} />
          <div className={styles.contentWord}>
            <div className={styles.label}>
              File Name:
              <span className={styles.name}>{file?.name}</span>
            </div>
            <div className={styles.label}>
              File Size:
              <span className={styles.name}>{fileSize}</span>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}
