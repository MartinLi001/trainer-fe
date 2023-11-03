import { Alert } from 'antd';
import React from 'react';
import styles from './index.less';
import IconFont from '@/components/IconFont';

interface Props {
  type?: 'success' | 'info' | 'warning' | 'error';
  message: React.ReactNode;
  description: React.ReactNode;
  icon?: React.ReactNode;
}
export default function index({ type = 'success', message, description, icon }: Props) {
  return (
    <Alert
      className={styles.alert}
      message={message}
      description={description}
      type={type}
      // action={<div className={styles.action}>dismiss</div>}
      closeText="dismiss"
      showIcon
      icon={icon || <IconFont type="icon-check-circle" />}
    />
  );
}
