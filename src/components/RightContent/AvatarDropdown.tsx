import React, { useCallback, useEffect, useState } from 'react';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { useModel } from 'umi';
import mitt from '@/utils/mitt';
import HeaderDropdown from '../HeaderDropdown';

import styles from './index.less';
import { useRequest } from 'ahooks';
import { logout } from '@/services/auth';
import { clearToken } from '@/utils';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const { run } = useRequest(logout, {
    manual: true,
    onSuccess: (res) => {
      clearToken();
      window.location.href = res;
    },
  });

  const { userId, name: userName, preferredName = '', lastName = '' } = initialState ?? {};

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        run();
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
        <Avatar
          size="small"
          icon={<UserOutlined />}
          className={styles.avatar}
          src={initialState.avatar}
          alt="avatar"
        />
        <span style={{ marginLeft: 5 }}>{userName || preferredName + ' ' + lastName}</span>
      </div>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
