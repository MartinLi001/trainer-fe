import { useState } from 'react';
import { Modal, Space, Spin } from 'antd';
import SeeButton from '@/components/SeeButton';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cat.net/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import styles from './index.less';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

export default function PdfPreviewModal(props: any) {
  const [scale, setScale] = useState(0.65);

  //缩小
  function pageZoomOut() {
    if (scale <= 0.5) {
      return;
    }
    const newScale = scale - 0.1;
    setScale(newScale);
  }

  //放大
  function pageZoomIn() {
    if (scale >= 5) {
      return;
    }
    const newScale = scale + 0.1;
    setScale(newScale);
  }

  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = (doc: any) => {
    setPageNumber(doc.numPages);
  };

  const { visible, file, loading, onCancel } = props;
  return (
    <Modal centered open={visible} onCancel={() => onCancel()} width="100%" footer={null}>
      <Spin spinning={loading} tip="loading...">
        <div className={styles.contentWrap}>
          <Document file={file?.file} onLoadSuccess={onDocumentLoadSuccess}>
            {new Array(pageNumber).fill('').map((pageNum, index) => {
              return (
                <Page
                  key={index}
                  width={window.screen.width}
                  pageNumber={index + 1}
                  scale={scale}
                />
              );
            })}
          </Document>
        </div>
      </Spin>
      <div className={styles.footer}>
        <Space>
          <SeeButton type="primary" shape="circle" icon={<MinusOutlined />} onClick={pageZoomOut} />
          <SeeButton type="primary" shape="circle" icon={<PlusOutlined />} onClick={pageZoomIn} />
        </Space>
      </div>
    </Modal>
  );
}
