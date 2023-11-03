import { useImperativeHandle, forwardRef } from 'react';
import { useState } from 'react';
import { useUpdateEffect } from 'ahooks';
import styles from './index.less';
import { Col, message, Row, UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { Space } from 'antd';
import IconFont from '@/components/IconFont';
import { PdfModal, ZipModal } from '@/components/PreviewModal';
import SeeButton from '../SeeButton';
import { LoadingOutlined } from '@ant-design/icons';
import { downloadTaskFile } from '@/services/course';
import { download } from '@/utils';
import classNames from 'classnames';

function ProfileUpload(props: any, parentRef: any) {
  const { beforeUpload, ...restProps } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onRemove = (file: UploadFile<any>) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  const Props: UploadProps = {
    onRemove,
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    onDrop(e) {
      if (props.accept) {
        const type = e.dataTransfer.files[0].type.split('/')[1];
        const hasAccept = props.accept.split(',').some((item: string) => item.includes(type));
        if (!hasAccept) {
          message.warning('Other formats except zip and pdf are not supported!');
          return;
        }
      }
    },
    showUploadList: false,
    fileList,
  };

  useUpdateEffect(() => {
    if (beforeUpload) {
      beforeUpload(fileList as RcFile[]);
    }
  }, [fileList]);

  useImperativeHandle(parentRef, () => {
    return {
      onRemove,
      onSetFileList(list: UploadFile[]) {
        setFileList(list);
      },
    };
  });

  return (
    <div className={styles.upload}>
      <Upload.Dragger
        {...Props}
        disabled={props.disabled}
        style={{
          height: 200,
          width: 295,
          background: 'white',
          border: '2px dashed #64737a',
        }}
        {...restProps}
      >
        <>
          <p className="ant-upload-text">Drag Your File Here</p>
          <p className="ant-upload-hint">or</p>
          <SeeButton className={styles.browseFile}>browse file</SeeButton>
        </>
      </Upload.Dragger>
    </div>
  );
}

export default forwardRef(ProfileUpload);

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

export function UploadPreview(props: any) {
  const { data = [], taskId, colNumber = 24 } = props;
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
      downloadTaskFile(taskId, file.resourceId)
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
    const ret = await downloadTaskFile(taskId, file.resourceId);
    download(ret, file.name);
  };

  return (
    <>
      <div
        className={classNames(styles.uploadBarWrap, {
          [props.className]: !!props.className,
        })}
      >
        <Row gutter={[5, 3]}>
          {data.length > 0 &&
            data.map((file: any) => (
              <Col span={colNumber} key={file.uid || file.resourceId}>
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
              </Col>
            ))}
        </Row>
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
