import { QuestionCircleOutlined, ShrinkOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import styles from './index.less';

export default function Tips({ type }: { type: string }) {
  const [collspad, setCollspad] = useState(true);

  const className = classNames(styles.wraper, {
    [styles.close]: collspad,
  });

  const tasks = useMemo(() => {
    return type === 'mock' ? (
      <>
        <span className={styles.weight}> coding mock</span>
        <span> and </span>
        <span className={styles.weight}>short answer mock. </span>
      </>
    ) : (
      <>
        <span className={styles.weight}> projects, mocks, assignments, professional behavior,</span>
        <span> and </span>
        <span className={styles.weight}>communication. </span>
      </>
    );
  }, [type]);
  return (
    <div className={className}>
      {collspad ? (
        <div onClick={() => setCollspad(false)} style={{ cursor: 'pointer', fontSize: 15 }}>
          <QuestionCircleOutlined style={{ marginRight: 10 }} /> Info
        </div>
      ) : (
        <div className={styles.opration}>
          <span style={{ fontSize: 22, cursor: 'pointer' }} onClick={() => setCollspad(true)}>
            <ShrinkOutlined />
          </span>
        </div>
      )}

      {!collspad ? (
        <>
          <div className={styles.text} style={{ minWidth: 300 }}>
            <QuestionCircleOutlined style={{ marginRight: 10 }} />
            Total = Sum of (weight x <span className={styles.weight}>section score</span>)
          </div>
          <div className={styles.content}>
            <div className={styles.title}>Note:</div>
            <ol className={styles.ol}>
              <li>
                <span className={styles.weight}>Sections</span> include
                {tasks}
              </li>
              <li>There are weights among different sections.</li>
              <li>
                Once the score for Code/SA is manually overwritten, it will
                <span className={styles.weight}> not change </span>when modifying the score for a
                specific question.
              </li>
              <li>
                <span className={styles.weight}>Bonus</span> is not included for total score
                calculation.
              </li>
            </ol>
          </div>
        </>
      ) : (
        ''
      )}
    </div>
  );
}
