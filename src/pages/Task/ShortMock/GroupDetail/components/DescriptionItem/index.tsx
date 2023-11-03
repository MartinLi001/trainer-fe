import React from 'react';
import styles from './index.less';

export default function DescriptionItem({
  title,
  content,
}: {
  title: string | React.ReactNode;
  content: string | React.ReactNode;
}) {
  return (
    <div className={styles.questionInfoContent}>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{content}</div>
    </div>
  );
}
