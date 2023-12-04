import moment from 'moment';
import { Avatar, Drawer, Spin } from 'antd';
import { AuTag } from '@aurora-ui-kit/core';
import { RunResult } from '@/components/IDE';
import styles from './index.less';
import { useEffect } from 'react';

export default function DrawerCom({ data, open, onClose, loading, children }: any) {
  // useEffect(() => {
  //   if (open) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'auto';
  //   }
  // }, [open]);

  return (
    <Drawer
      title={`Submission History`}
      placement="right"
      width={650}
      destroyOnClose
      onClose={onClose}
      open={open}
      getContainer={document.getElementById('codingContainer') as any}
      style={{ zIndex: 99 }}
    >
      <Spin spinning={loading}>
        <div className={styles.drawerWrap}>
          {children}
          <div className={styles.info}>
            <div className={styles.baseInfo}>
              <Avatar size={40}>{data?.submitterName?.slice(0, 1)}</Avatar>
              <div className={styles.baseInfoLeft}>
                <span>{data?.submitterName ?? 'N/A'}</span>
                <span>
                  {data?.submittedAt
                    ? moment(data.submittedAt).format('MM/DD/YYYY HH:mm:ss')
                    : 'N/A'}
                </span>
                <span>{data?.batch ?? 'N/A'}</span>
              </div>
            </div>
            <AuTag size="large" shape="round">
              {data?.language ?? 'N/A'}
            </AuTag>
          </div>
          <RunResult data={data} loading={loading} />
        </div>
      </Spin>
    </Drawer>
  );
}
