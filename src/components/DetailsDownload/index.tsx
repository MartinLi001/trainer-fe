import { downloadTaskFile } from '@/services/course';
import { download } from '@/utils';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import React from 'react';
import styles from './index.less';

interface DetailsCardItemProps {
  title: string;
  taskId: string;
  resourceId: string;
  style?: CSSProperties;
  desc?: string;
}

const DetailsDownload: React.FC<DetailsCardItemProps> = ({
  title,
  desc,
  taskId = '',
  resourceId = '',
  style,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = async (downloadUrl: string, name: string) => {
    if (downloadUrl === '') {
      return;
    }
    setLoading(true);
    const ret = await downloadTaskFile(downloadUrl, resourceId);
    download(ret, name);
    setLoading(false);
  };
  return (
    <div className={styles.item} style={style}>
      <a className={styles.downloadTitle}>{title}</a>
      <div className={styles.desc}>{desc}</div>
      <Button
        className={styles.download}
        type="primary"
        shape="round"
        icon={<DownloadOutlined />}
        size="small"
        loading={loading}
        onClick={() => onClick(taskId, title)}
      >
        Download
      </Button>
    </div>
  );
};

export default DetailsDownload;
