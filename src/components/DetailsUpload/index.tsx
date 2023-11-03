import { useImperativeHandle, forwardRef } from 'react';
import { useState } from 'react';
import { useUpdateEffect } from 'ahooks';
import styles from './index.less';
import type { UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import SeeButton from '../SeeButton';

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
      console.log('%cindex.tsx line:24 file', 'color: #007acc;', file);
      if (file.size >= 20971520) {
        if (beforeUpload) {
          beforeUpload(fileList as RcFile[], 'File size should be less than 20MB');
        }
      } else {
        setFileList([...fileList, file]);
      }
      return false;
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
      onSetFileList(list: RcFile[]) {
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
