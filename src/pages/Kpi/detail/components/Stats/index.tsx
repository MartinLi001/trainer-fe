import { BarChartOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

import CardTitle from '@/components/CardTitle';
import { getUserAvatar } from '@/services/user';
import styles from './index.less';
import { useState } from 'react';
import { useThrottleEffect } from 'ahooks';

export default function Stats(props: any) {
  const [avatarSrc, setAvatar] = useState<string>();
  const getAvatar = (userId: string) => {
    // getUserAvatar(userId)
    //   .then((avatar: Blob) => setAvatar(URL.createObjectURL(avatar) as string))
    //   .catch(() => {});
  };

  useThrottleEffect(
    () => {
      if (props.traineeId) {
        getAvatar(props.traineeId);
      }
    },
    [props.traineeId],
    {
      wait: 1500,
    },
  );

  return (
    <>
      <CardTitle
        title="Stats"
        iconFont={<BarChartOutlined />}
        extra={
          props.trainerHasPromise ? (
            <span onClick={() => props?.onEdit()} style={{ cursor: 'pointer' }}>
              <EditOutlined style={{ fontSize: 24 }} />
            </span>
          ) : (
            <></>
          )
        }
      />
      <div className={styles.stats}>
        <span className={styles.rank}>No.{props.userRanking}</span>
        <Avatar
          className={styles.avatar}
          shape="square"
          size={80}
          icon={<UserOutlined />}
          src={avatarSrc}
        />
        <span className={styles.userName}>{props.fullName}</span>
        <span className={styles.batchName}>{props.batchName}</span>
        <ul className={styles.scoreArea}>
          <li>
            <span className={styles.score}>{props.total?.toFixed(1)}</span>
            <span className={styles.fields}>Total KPI</span>
          </li>
          <li>
            <span className={styles.score}>{props?.communicationScore?.toFixed(1)}</span>
            <span className={styles.fields}>Comm</span>
          </li>
          <li>
            <span className={styles.score}>{props?.behavioralScore?.toFixed(1)}</span>
            <span className={styles.fields}>Behavior</span>
          </li>
        </ul>
      </div>
    </>
  );
}
