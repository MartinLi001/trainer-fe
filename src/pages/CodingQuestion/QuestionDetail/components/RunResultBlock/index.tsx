import { Skeleton } from 'antd';
import { RunStatus } from '@/constants';
import styles from './index.less';

export default function RunResult({ loading, data }: any) {
  return (
    <>
      <div className={styles.result}>
        <div className={styles.baseInfo}>
          {!loading ? (
            <>
              <span className={styles.block}>
                <span className={`${styles.label} ${styles[`status-${data?.statusCode}`]}`}>
                  {RunStatus[data?.statusCode] ?? 'N/A'}
                  {/* {data?.statusMessage ?? 'N/A'} */}
                </span>
              </span>
              <span className={styles.block}>
                <span className={styles.label}>Memory</span>
                <span className={styles.value}>
                  {+data?.memory >= 0 ? `${data.memory}MB` : 'N/A'}
                </span>
              </span>
              <span className={styles.block}>
                <span className={styles.label}>RunTime</span>
                <span className={styles.value}>
                  {data?.runTime >= 0 ? `${data.runTime}MS` : 'N/A'}
                </span>
              </span>
              <span className={styles.block}>
                <span className={styles.label}>Test Case</span>
                <span className={styles.value}>
                  {data?.totalCorrect ?? 0}/{data?.totalTestCases ?? 0}
                </span>
              </span>
            </>
          ) : (
            <>
              <Skeleton.Input active={loading} />
              <Skeleton.Input active={loading} />
              <Skeleton.Input active={loading} />
              <Skeleton.Input active={loading} />
            </>
          )}
        </div>

        {!loading && data?.statusCode === 120 && (
          <pre
            style={{ padding: '0 12px 12px', color: '#ef6c6d', whiteSpace: 'pre-wrap', margin: 0 }}
          >
            {data?.compileError ?? ''}
          </pre>
        )}
        {!loading && data?.statusCode === 130 && (
          <pre
            style={{ padding: '0 12px 12px', color: '#ef6c6d', whiteSpace: 'pre-wrap', margin: 0 }}
          >
            {data?.runtimeError ?? ''}
          </pre>
        )}
      </div>

      <pre
        style={{
          borderRadius: '8px',
          color: '#4a585f',
          padding: 12,
          background: '#F8F9FC',
          whiteSpace: 'pre-wrap',
          margin: 0,
        }}
      >
        {data?.submittedCode ?? ''}
      </pre>
    </>
  );
}
