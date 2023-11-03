import { useState } from 'react';
import styles from './index.less';
import { Space } from 'antd';
import IconFont from '@/components/IconFont';
import { PdfModal, ZipModal } from '@/components/PreviewModal';
import { LoadingOutlined } from '@ant-design/icons';
import { getFile } from '@/services/question';
import { download } from '@/utils';
import classNames from 'classnames';

// 下载文件的小按钮，提出来是为了给每个按钮独立的loading状态
const DownButton = ({ onDownload }: any) => {
  const [downLoading, setDownLoading] = useState(false); // 下载按钮loading状态
  async function onClick() {
    setDownLoading(true);
    await onDownload?.();
    setDownLoading(false);
  }
  return downLoading ? (
    <LoadingOutlined />
  ) : (
    <span onClick={onClick}>
      <IconFont type="icon-download-line" />
    </span>
  );
};

export function UploadPreviewQues(props: any) {
  const { data = [], questionId, exceptList = [] } = props;
  const [modalType, setModelType] = useState('');
  const [previewFile, setPreviewFile] = useState<any>(); // 预览pdf文件时预加载的文件
  const [fileLoading, setFileLoading] = useState<boolean>(false);

  const onPreview = (file: any) => {
    if (
      file?.type === 'application/pdf' ||
      file?.name.substring(file?.name.lastIndexOf('.')) == '.pdf'
    ) {
      setModelType('pdf');
    } else if (
      file?.type === 'application/zip' ||
      file?.name.substring(file?.name.lastIndexOf('.')) == '.zip'
    ) {
      setModelType('zip');
    }

    if (file.resourceId) {
      setFileLoading(true);
      getFile(questionId, file.resourceId)
        .then((ret) =>
          setPreviewFile({
            file: ret,
            name: file.name,
          }),
        )
        .finally(() => setFileLoading(false));

      return;
    }

    setPreviewFile({
      file: file,
      name: file.name,
    });
  };

  const onDownResource = async (file: any) => {
    const ret = await getFile(questionId, file.resourceId);
    download(ret, file.name);
  };

  return (
    <>
      <div
        className={classNames(styles.uploadBarWrap, {
          [props.className]: !!props.className,
        })}
      >
        {data.length > 0 &&
          data.map((file: any) => {
            if (exceptList.includes(file.resourceId)) {
              return;
            }
            if (
              file?.type === 'application/pdf' ||
              file?.name.substring(file?.name.lastIndexOf('.')) == '.pdf' ||
              file?.type === 'application/zip' ||
              file?.name.substring(file?.name.lastIndexOf('.')) == '.zip'
            ) {
              return (
                <div
                  className={styles.barWrap}
                  style={props.style}
                  key={file.uid || file.resourceId}
                >
                  <div className={styles.fileName}>{file.name}</div>
                  <Space size="large">
                    {props.downIcon && <DownButton onDownload={() => onDownResource(file)} />}
                    <span onClick={() => onPreview(file)}>
                      <IconFont type="icon-eye-line" />
                    </span>
                    {props.onRemove && (
                      <span onClick={() => props.onRemove(file)}>
                        <IconFont type="icon-delete-bin-line" />
                      </span>
                    )}
                  </Space>
                </div>
              );
            }
            return;
          })}
      </div>

      <PdfModal
        visible={modalType === 'pdf'}
        file={previewFile}
        loading={fileLoading}
        onCancel={() => setModelType('')}
      />

      <ZipModal
        visible={modalType === 'zip'}
        file={previewFile}
        loading={fileLoading}
        onCancel={() => setModelType('')}
      />
    </>
  );
}
