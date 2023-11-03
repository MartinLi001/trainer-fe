import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getUserAvatar } from '@/services/user';
import UploadAvatarModal from './uploadAvatar';
import type { RcFile } from 'antd/es/upload/interface';
import styles from './index.less';

export default function UserAvatar() {
  const { initialState } = useModel('@@initialState');
  const { firstName = '', lastName = '', preferredName = '' } = initialState ?? {};
  const [avatarSrc, setAvatar] = useState<string>();
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);

  const fetch = () => {
    const { userId } = JSON.parse(localStorage.userInfo ?? '{}');
    getUserAvatar(userId)
      .then((avatar: Blob) => setAvatar(URL.createObjectURL(avatar) as string))
      .catch(() => {});
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <div className={styles.avatarWrap}>
        <span className={styles.avatar} onClick={() => setUploadModalVisible(true)}>
          {avatarSrc ? (
            <Avatar size={64} src={avatarSrc} alt="avatar" />
          ) : (
            <Avatar size={64} icon={<UserOutlined />} />
          )}
        </span>

        <b>{`${firstName} ${lastName}`}</b>
        <span>{preferredName ? `@${preferredName}` : ''}</span>
      </div>
      <UploadAvatarModal
        visible={uploadModalVisible}
        avatarSrc={avatarSrc}
        onSuccess={(src: RcFile) => {
          setUploadModalVisible(false);
          // fetch()
          setAvatar(URL.createObjectURL(src) as string);
        }}
        onCancel={() => setUploadModalVisible(false)}
      />
    </>
  );
}
