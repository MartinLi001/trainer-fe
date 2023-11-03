import type { CSSProperties } from 'react';
import { useImperativeHandle, forwardRef } from 'react';
import { useState } from 'react';
import styles from './index.less';
import type { UploadFile, UploadProps } from 'antd';
import { Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import SeeButton from '@/components/SeeButton';
import { uploadUserAvatar } from '@/services/user';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

interface Props {
  style?: CSSProperties;
  uploadUrl?: string;
  fileName?: string;
  method?: string;
  type?: string;
}

function ProfileUpload(props: Props, parentRef: any) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string>();

  const requestFileName = props.fileName ? props.fileName : 'avatar';

  const Props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      getBase64(file as RcFile, (url) => {
        setImageUrl(url);
      });
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  /**
   * @description 手动上传的触发动作
   */
  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append(requestFileName, file as RcFile);
    });
    uploadUserAvatar(formData)
      .then(() => {
        setFileList([]);
      })
      .catch(() => {
        console.log('upload failed.');
      });
  };

  useImperativeHandle(parentRef, () => {
    return {
      handleUpload,
    };
  });

  return (
    <div className={styles.upload}>
      <Upload.Dragger
        maxCount={1}
        {...Props}
        accept={'.jpg,.png,.svg'}
        showUploadList={false}
        style={{
          height: 200,
          width: 295,
          background: 'white',
          border: '2px dashed #64737a',
          ...props.style,
        }}
      >
        {imageUrl ? (
          <img className={styles.imgPreview} src={imageUrl} alt="avatar" />
        ) : (
          <>
            <p className="ant-upload-text">Drag Your File Here</p>
            <p className="ant-upload-hint">or</p>
            <SeeButton className={styles.browseFile}>browse file</SeeButton>
          </>
        )}
      </Upload.Dragger>
    </div>
  );
}

export default forwardRef(ProfileUpload);
