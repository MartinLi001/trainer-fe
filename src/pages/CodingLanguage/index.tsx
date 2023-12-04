import React, { useState } from 'react';
import styles from './index.less';
import LanguageList from './component/LanguageList';
import { useRequest } from 'ahooks';
import { getCodingLanguage } from '@/services';
import CodeList from './component/CodeList';
import { Spin } from 'antd';
import { AuCodeMirror } from '@aurora-ui-kit/core';
// import TagNav from '@/components/TagNav';

export default function CodingLanguage() {
  const [languages, setLanguages] = useState<{ name: string; id: string }[]>([]);
  const [focusLanguage, setFocusLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  useRequest(getCodingLanguage, {
    onBefore: () => setLoading(true),
    onSuccess: (data) => {
      const list = data?.map((item: any) => ({ id: item.value, name: item.name }));
      // const listFake = [
      //   { name: 'Java', id: 'java' },
      //   { name: 'Python', id: 'python' },
      // ];
      setLanguages(list || []);
      setFocusLanguage(list?.[0]?.id || '');
    },
    onFinally: () => setLoading(false),
    retryCount: 3,
  });

  return (
    <Spin spinning={loading}>
      <div className={styles.wrapper}>
        <div className={styles.header}>Coding Language</div>
        {/* <AuCodeMirror value="123123" /> */}
        <div className={styles.description}>
          Configure coding languages that are available through Drill IDE A
        </div>
        <LanguageList
          label="Select Language to Configure"
          list={languages}
          value={focusLanguage}
          onChange={setFocusLanguage}
        />
        {/* <TagNav
        showAll={false}
        type="radio"
        displayMaxLineLength={3}
        label="Select Language to Configure"
        list={languages}
        value={focusLanguage}
        onChange={setFocusLanguage}
      /> */}
        <div className={styles.content}>
          <div className={styles.panel}>
            <div className={styles.title}>General Class</div>
            <div className={styles.description}>
              Use General Class to create & define global objects for the selected language.
            </div>
            <div className={styles.box}>
              <CodeList
                changeNameFlag={true}
                // language={focusLanguage}
                addProps={{ language: focusLanguage, type: 0 }}
              />
            </div>
          </div>
          <div className={styles.panel}>
            <div className={styles.title}>General Function</div>
            <div className={styles.description}>
              Use General Function to create global functions for the selected language.
            </div>
            <div className={styles.box}>
              <CodeList
                changeNameFlag={true}
                // language={focusLanguage}
                addProps={{ language: focusLanguage, type: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
