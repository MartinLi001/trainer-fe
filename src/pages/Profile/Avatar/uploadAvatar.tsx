import { useState } from 'react';
import { useModel } from 'umi';
import { Modal, Button, Upload, Avatar } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UserOutlined } from '@ant-design/icons';

import { uploadUserAvatar } from '@/services/user';
import styles from './index.less';
import mitt from '@/utils/mitt';

export default function UploadAvatar({ visible, avatarSrc, onSuccess, onCancel }: any) {
  const { initialState } = useModel('@@initialState');
  const { updateLocalUserInfo } = useModel('useUser');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleteloading, setDeleteLoading] = useState(false);

  const [avatar, setAvatar] = useState<string>(avatarSrc);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleUpload = (isDelete?: boolean) => {
    const formData = new FormData();
    let avatarFile: RcFile;
    if (isDelete) {
      formData.append('avatar', null as any);
      formData.append('prevLink', initialState?.avatar as string);
      setDeleteLoading(true);
    } else {
      fileList.forEach((file) => {
        avatarFile = file as RcFile;
        formData.append('avatar', file as RcFile);
        formData.append('prevLink', initialState?.avatar as string);
      });
      setUploading(true);
    }

    uploadUserAvatar(formData)
      .then((res: any) => {
        setFileList([]);
        const userInfo = JSON.parse(localStorage.userInfo ?? '{}');
        const newInfo = {
          ...userInfo,
          avatar: res?.avatar,
        };
        updateLocalUserInfo(newInfo);
        onSuccess(isDelete ? '' : avatar);
        setAvatar('');
        mitt.emit('UPDATE_USER_AVATAR', avatarFile);
      })
      .catch(() => {
        console.log('upload failed.');
      })
      .finally(() => {
        setUploading(false);
        setDeleteLoading(false);
      });
  };

  const props: UploadProps = {
    maxCount: 1,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      setAvatar('');
    },
    beforeUpload: async (file) => {
      setFileList([file]);
      setAvatar(await getBase64(file));
      return false;
    },
    fileList,
  };
  return (
    <Modal
      width={400}
      open={visible}
      title="Profile photo"
      onCancel={() => {
        onCancel();
      }}
      footer={[
        <Button type="primary" loading={deleteloading} onClick={() => handleUpload(true)}>
          Delete
        </Button>,
        <Button
          type="primary"
          disabled={fileList.length === 0}
          loading={uploading}
          onClick={() => handleUpload()}
        >
          Upload
        </Button>,
      ]}
    >
      <div className={styles.uploadAvatarWrap}>
        <Upload {...props}>
          <span className={styles.avatar}>
            {avatar ? (
              <Avatar size={100} src={avatar} alt="avatar" />
            ) : (
              <Avatar size={100} icon={<UserOutlined />} />
            )}
          </span>
        </Upload>
      </div>
    </Modal>
  );
}
