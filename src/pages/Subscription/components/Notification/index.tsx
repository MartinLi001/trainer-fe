import { notification as antdNotification } from 'antd';
import React from 'react';
import styles from './index.less';
import IconFont from '@/components/IconFont';

export default function notification({
  key = 'notificationNotification',
  message,
  description,
  descriptionExtra,
  getContainer,
}: {
  key?: string;
  message: string;
  description: React.ReactNode;
  descriptionExtra?: React.ReactNode;
  getContainer?: () => HTMLElement;
}) {
  antdNotification.open({
    key,
    message: (
      <div className={styles.box}>
        <IconFont type="icon-check-circle" className={styles.icon} />
        <div className={styles.content}>
          <div className={styles.message}>{message}</div>
          <div className={styles.description}>{description}</div>
          {descriptionExtra}
        </div>
        <div className={styles.close} onClick={() => antdNotification.close(key)}>
          Dismiss
        </div>
      </div>
    ),
    description: null,
    placement: 'bottomLeft',
    closeIcon: <></>,
    duration: 0,
    getContainer,
    // getContainer: () => {
    //   return document.getElementById('subscription') as HTMLElement;
    // },
    // getContainer() {
    //   return (
    //     (document.getElementsByTagName('main')?.[0]?.children?.[0] as HTMLElement) || document.body
    //   );
    // },
    className: styles.subscriptionNotification,
  });
}
