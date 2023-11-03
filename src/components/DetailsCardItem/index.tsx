import type { CSSProperties } from 'react';
import React from 'react';
import styles from './index.less';

interface DetailsCardItemProps {
  title: string;
  style?: CSSProperties;
  desc?: string;
  isOnlyTitle?: boolean; // 只有title，没有desc
  isLink?: boolean; // 是否跳转
  isTitleRed?: boolean;
}

const DetailsCardItem: React.FC<DetailsCardItemProps> = ({
  title,
  desc,
  isOnlyTitle = false,
  isLink = false,
  isTitleRed = false,
  style,
}) => {
  return (
    <div className={styles.item} style={style}>
      <div className={styles.title} style={isTitleRed ? { color: 'red' } : {}}>
        {title}
      </div>
      {!isOnlyTitle && !isLink && <div className={styles.desc}>{desc}</div>}
      {isLink && (
        <a href={'https://' + desc} target="_blank" rel="noreferrer" className={styles.link}>
          {desc}
        </a>
      )}
    </div>
  );
};

export default DetailsCardItem;
