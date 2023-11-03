import React, { useEffect, useState } from 'react';

// import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';
import SeeButton from '@/components/SeeButton';
import { message, Tabs, TabsProps } from 'antd';
import AllSubscription from './components/allSubscription';
import HistorySubscription from './components/historySubscription';
import { history, useLocation } from 'umi';
import { getClients, getSubscriptionConfig } from '@/services/question';
import { useRequest } from 'ahooks';
import { criteriaObj } from './typeList';

const Subscription: React.FC = () => {
  const {
    query: { activekey: defaultAtivekey },
  } = useLocation() as any;
  const [activekey, setActiveKey] = useState<string>('1');

  useEffect(() => {
    if (defaultAtivekey) setActiveKey(defaultAtivekey);
  }, [defaultAtivekey]);

  const { data: config } = useRequest(getSubscriptionConfig, {
    onError: (err: any) => {
      message.error(err?.serviceStatus?.errorMessage || 'ERROR!');
    },
  });

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `All Subscription`,
    },
    {
      key: '2',
      label: `Subscription History`,
    },
  ];

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const [clientList, setClientList] = useState<criteriaObj[]>([]);
  useEffect(() => {
    getClients().then((res) => {
      setClientList(res);
    });
  }, []);

  return (
    <div className={styles.subscription}>
      <div className={styles.subscriptionTitle}>
        Subscription Management
        <SeeButton
          type="primary"
          style={{ marginLeft: 24 }}
          onClick={() => history.push('/Subscription/Create')}
        >
          Add Subscriptions
        </SeeButton>
      </div>
      <div className={styles.subscriptionTab}>
        <Tabs activeKey={activekey} items={items} onChange={onChange} />
      </div>
      <div className={styles.subscriptionSearch}>
        {activekey == '1' ? (
          <AllSubscription
            config={config?.questionSubscriptionConfig || {}}
            clientList={clientList}
          />
        ) : (
          <HistorySubscription
            config={config?.questionSubscriptionHistoryConfig || {}}
            clientList={clientList}
          />
        )}
      </div>
    </div>
  );
};

export default Subscription;
