import { notification as antdNotification } from 'antd';
import React from 'react';
import styles from './index.less';
import IconFont from '@/components/IconFont';
import { InfoCircleFilled } from '@ant-design/icons';

type SectionMessageType = 'message' | 'comfirmation' | 'warning' | 'error';
export default function SectionMessage({
  key = 'SectionMessage',
  type = 'message',
  title,
  description,
  descriptionExtra,
  getContainer,
}: {
  key?: string;
  type?: SectionMessageType;
  title: string;
  description: React.ReactNode;
  descriptionExtra?: React.ReactNode;
  getContainer?: () => HTMLElement;
}) {
  antdNotification.open({
    key,
    message: (
      <div className={styles.box}>
        {Icon(type)}
        <div className={styles.content}>
          <div className={styles.message}>{title}</div>
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
    className: [styles.sectionMessageWrapper, styles?.[type]].join(' '),
  });
}

function Icon(type: SectionMessageType) {
  switch (type) {
    case 'message':
      return <InfoCircleFilled className={styles.icon} />;
      break;
    case 'comfirmation':
      return <IconFont type="icon-check-circle" className={styles.icon} />;
      break;
    case 'warning':
      return <IconFont type="icon-a-iconwarning" className={styles.icon} />;
      break;
    case 'error':
      return <IconFont type="icon-a-iconerror" className={styles.icon} />;
  }
}
