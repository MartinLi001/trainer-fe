import React, { useCallback, useEffect, useState } from 'react';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { useModel } from 'umi';
import { logout } from '@/utils';
import mitt from '@/utils/mitt';
import HeaderDropdown from '../HeaderDropdown';

import { getUserAvatar } from '@/services/user';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [avatarSrc, setAvatar] = useState<string>();

  const { userId, name: userName, preferredName = '', lastName = '' } = initialState ?? {};
  useEffect(() => {
    async function fetch() {
      if (userId)
        getUserAvatar(userId)
          .then((avatar: Blob) => setAvatar(URL.createObjectURL(avatar) as string))
          .catch(() => {});
    }
    fetch();

    mitt.on('UPDATE_USER_AVATAR', (file) => {
      setAvatar(URL.createObjectURL(file) as string);
    });
  }, []);

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        logout();
        return;
      }
      // history.push(`/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState?.userId) {
    return loading;
  }

  const items = [
    {
      label: (
        <a href={process.env.PROFILE} target="_blank" rel="noreferrer">
          <UserOutlined />
          My Profile
        </a>
      ),
      key: 'profile',
    },
    {
      label: (
        <a href="/tagManagement" rel="noreferrer">
          <SettingOutlined />
          Setting
        </a>
      ),
      key: 'tagManagement',
    },
    {
      label: (
        <>
          <LogoutOutlined />
          Logout
        </>
      ),
      key: 'logout',
    },
  ];

  const menuHeaderDropdown = (
    <Menu className={styles.menu} items={items} selectedKeys={[]} onClick={onMenuClick} />
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown} className={styles.action}>
      <div className={styles.action}>
        {avatarSrc ? (
          <Avatar size="small" className={styles.avatar} src={avatarSrc} alt="avatar" />
        ) : (
          <Avatar size="small" icon={<UserOutlined />} />
        )}
        <span style={{ marginLeft: 5 }}>{userName || preferredName + ' ' + lastName}</span>
      </div>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
