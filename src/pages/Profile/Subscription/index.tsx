import { useEffect, useState } from 'react';
import { Tag, Empty, Spin } from 'antd';
import moment from 'moment';
import { CheckOutlined } from '@ant-design/icons';
import CardTitle from '@/components/CardTitle';
import { getSubscriptions } from '@/services/user';
import { month2ENGmonth } from '@/utils';

import styles from './index.less';
import IconFont from '@/components/IconFont';

interface SubscriptionType {
  daysLeft: number;
  endDate: string;
  name: string;
  options: string[];
  startDate: string;
  status: string;
  subscriptionId: string;
  targets: string[];
  type: string;
}

const format = 'DD,YYYY';
export default function Subscription(): JSX.Element {
  const [subscriptList, setData] = useState<SubscriptionType[]>([{}] as SubscriptionType[]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const res = await getSubscriptions();
      setData(res);
      setLoading(false);
    }

    fetch();
  }, []);

  const formatDate = (date: string) => {
    const tempDate = moment(date);
    return month2ENGmonth[tempDate.month()] + ' ' + tempDate.format(format);
  };

  const formatDayLeft = (daysLeft: number) => {
    if (!daysLeft) return;

    if (daysLeft < 30) {
      return `${daysLeft} Days`;
    }

    if (daysLeft >= 30) {
      return `${Math.floor(daysLeft / 30)} months +`;
    }

    if (daysLeft >= 365) {
      return `${Math.floor(daysLeft / 365)} years +`;
    }
    return;
  };

  return (
    <div style={{ marginTop: 57 }}>
      {subscriptList.length > 0 ? (
        subscriptList.map((data) => (
          <>
            <CardTitle
              iconFont={<IconFont type="icon-file-list-3-line" />}
              title="Active Subscription"
            />
            <div key={data.name} className={styles.subscriptWrap}>
              <div className={styles.content}>
                <Spin spinning={loading}>
                  {!loading && (
                    <>
                      <div className={styles.top}>
                        <span className={styles.label}>Subscription Name</span>
                        <span className={styles.name}>
                          {data.name}
                          <Tag color="#FFFBEF" className={styles.tag}>
                            {formatDayLeft(data.daysLeft)}
                          </Tag>
                        </span>
                      </div>
                      <div className={styles.bottom}>
                        <ul className={styles.list}>
                          {data.options?.map((tag) => (
                            <li>
                              <CheckOutlined className={styles.icon} />
                              {tag}
                            </li>
                          ))}
                        </ul>
                        <div className={styles.info}>
                          <span className={styles.client}>Client</span>
                          <div className={styles.tagWrap}>
                            {data.targets?.map((tag) => (
                              <Tag color="#E0E0E0" className={styles.tag}>
                                {tag}
                              </Tag>
                            ))}
                          </div>
                          <div className={styles.timeWrap}>
                            <span className={styles.label}>Starts</span>
                            <span className={styles.value}>{formatDate(data.startDate)}</span>
                          </div>

                          <div className={styles.timeWrap}>
                            <span className={styles.label}>Ends</span>
                            <span className={styles.value}>{formatDate(data.endDate)}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Spin>
              </div>
            </div>
          </>
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}
