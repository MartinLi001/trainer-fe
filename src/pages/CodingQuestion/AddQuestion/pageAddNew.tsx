import React from 'react';
import styles from './index.less';
import AddQuestionMain from './index';
import { PageBreadCrumb } from '@/components/PageBreadCrumb';
import { InfoCircleOutlined } from '@ant-design/icons';

export default function AddQuestion({ codingQuestionId }: { codingQuestionId: string }) {
  return (
    <div className={styles.pageAddNewWrapper}>
      <PageBreadCrumb
        routes={[
          {
            href: '/coding',
            label: 'Coding Puzzles',
          },
          {
            label: 'Add New Puzzle',
          },
        ]}
      />
      <div className={styles.header}>Add New Puzzle</div>
      <div className={styles.generalTitle}>
        <InfoCircleOutlined className={styles.icon}/>
        General
      </div>
      <div className={styles.description}>
        Update a puzzle’s title, description and other basics.
      </div>
      <AddQuestionMain idFromProp={codingQuestionId} />
    </div>
  );
}
