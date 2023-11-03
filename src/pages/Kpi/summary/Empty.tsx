import React from 'react';
import styles from './Empty.less';
import EmptySrc from '@/assets/Empty.svg';

export default function Empty() {
  return (
    <div className={styles.emptyWrap}>
      <img src={EmptySrc} className={styles.image} />
      <div className={styles.text}>No Data Yet</div>
      <div className={styles.extra}>
        You can come back again or check with the corresponding trainers.
      </div>
    </div>
  );
}
