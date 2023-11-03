// ！！！⚠️废弃⚠️！！！

import {
  CloudUploadOutlined,
  FileZipOutlined,
  InfoCircleOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import type { CSSProperties } from 'react';
import React from 'react';
import styles from './index.less';

export enum IconType {
  Info = 'info',
  File = 'file',
  Upload = 'upload',
  Message = 'message',
}

interface DetailsTitleProps {
  text: string;
  type: IconType;
  style?: CSSProperties;
}

const iconStyle = { fontSize: '150%' };

const Type2icon = {
  [IconType.Info]: <InfoCircleOutlined style={iconStyle} />,
  [IconType.File]: <FileZipOutlined style={iconStyle} />,
  [IconType.Upload]: <CloudUploadOutlined style={iconStyle} />,
  [IconType.Message]: <MessageOutlined style={iconStyle} />,
};

const DetailsTitle: React.FC<DetailsTitleProps> = ({ text, type, style }) => {
  return (
    <div className={styles.title} style={style}>
      {Type2icon[type]}
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default DetailsTitle;
