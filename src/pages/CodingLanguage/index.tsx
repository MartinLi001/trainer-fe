import React from 'react';
import styles from './index.less';
import LanguageList from './component/LanguageList';
// import { useRequest } from 'ahooks';
// import { getCodingLanguage } from '@/services';
import CodeList from './component/CodeList';

export default function CodingLanguage() {
  //   const { data } = useRequest(getCodingLanguage, {
  //     defaultParams: [{ language: 'Java' }],
  //   });
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Coding Language</div>
      <div className={styles.description}>
        Configure coding languages that are available through Drill IDE
      </div>
      <LanguageList
        label="Select Language to Configure"
        list={[{ name: 'Java', id: 'Java' }]}
        value={'Java'}
      />
      <div className={styles.content}>
        <div className={styles.panel}>
          <div className={styles.title}>General Class</div>
          <div className={styles.description}>This template is required by... to...</div>
          <div className={styles.box}>
            <CodeList
              changeNameFlag={true}
              language="java"
              addProps={{ language: 'java', type: 0 }}
            />
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.title}>General Function</div>
          <div className={styles.description}>This template is required by... to...</div>
          <div className={styles.box}>
            <CodeList
              changeNameFlag={true}
              language="java"
              addProps={{ language: 'java', type: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
