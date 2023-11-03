import React from 'react';
import styles from './index.less';
import EmptySrc from '@/assets/Empty.svg';

export default function Empty() {
  return (
    <div className={styles.emptyWrap}>
      <img src={EmptySrc} className={styles.image} />
      <div className={styles.text}>No data</div>
      <div className={styles.extra}>Come back later!</div>
    </div>
  );
}
