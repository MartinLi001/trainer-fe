import React from 'react';
import PageContainer from '@/components/PageContainer';
import styles from './index.less';
// import Alert from '../components/Alert';
import { useParams } from 'umi';
// import notification from '../components/Notification';

export default function Success() {
  const { id } = useParams<any>();
  // useEffect(() => {
  //   notification({
  //     key: 'success-' + id,
  //     message: 'Your request has been sent',
  //     description: 'It will take some time to appear on your subscription history',
  //     descriptionExtra: (
  //       <a onClick={() => history.push(`/Subscription?activekey=2`)} className={styles.linkto}>
  //         View Subscription History
  //       </a>
  //     ),
  //   });
  // }, []);
  return (
    <PageContainer>
      <div className={styles.wrap}>
        <div className={styles.title}>Confirmation Number</div>
        <div className={styles.number}>{id}</div>
        <div className={styles.tips}>Copy the number to check in subscription history</div>
      </div>
      {/* <Alert
        message={'Your request has been sent'}
        description={
          <>
            <div>It will take some time to appear on your subscription history</div>
            <a onClick={() => history.push(`/Subscription?activekey=2`)} className={styles.linkto}>
              View Subscription History
            </a>
          </>
        }
      /> */}
    </PageContainer>
  );
}
