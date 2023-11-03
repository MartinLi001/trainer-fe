import classNames from 'classnames';
import { Avatar, List, Grid } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { mockGroupsType, TaskResponse } from '../../mock/typeList';
import Tabs, { TabsItemType } from '../MockGroup/components/Tabs';

import styles from './index.less';
import { attendantsType } from '../typeList';
import { cloneDeep } from 'lodash';

const { useBreakpoint } = Grid;
export default function MockSummary({ data }: { data: TaskResponse }) {
  const { trainersTabsDataTemp: tabsData, list: dataSource } = useMemo(() => {
    const mockSummaryKeys = Object.keys(data?.mockSummary ?? {});

    if (mockSummaryKeys.length) {
      return mockSummaryKeys.reduce(
        (result, currentKey) => {
          const currentGroup = data.mockGroups?.find(
            (mockGroup) => mockGroup.mockGroupId === currentKey,
          ) as mockGroupsType;

          if (currentGroup) {
            const { userId, firstName } = currentGroup.host as attendantsType;
            const isMakeUpMock = currentGroup?.isMakeUpMockGroup;
            const trainerId = isMakeUpMock ? `${userId}makeup` : userId;

            const makupTrainerGroup = result.list[trainerId];
            if (makupTrainerGroup) {
              result.list[trainerId] = [...makupTrainerGroup, ...data.mockSummary[currentKey]];
            } else {
              result.list[trainerId] = data.mockSummary[currentKey];

              result.trainersTabsDataTemp.push({
                label: isMakeUpMock ? (
                  <>
                    {firstName}
                    <span style={{ color: '#F14D4F' }}>*</span>
                  </>
                ) : (
                  firstName
                ),
                key: isMakeUpMock ? `${userId}makeup` : userId,
              });
            }
          }

          return result;
        },
        { trainersTabsDataTemp: [] as TabsItemType[], list: {} },
      );
    }
    return { trainersTabsDataTemp: [], list: {} };
  }, [data]);

  const sortResult = useMemo(() => {
    const tempData = cloneDeep(dataSource);
    Object.keys(tempData)?.map((key: string) => {
      tempData[key] = tempData[key]?.sort((a: any, b: any) => {
        return +b.avgScore - +a.avgScore;
      });
    });

    return tempData;
  }, [dataSource]);

  const [activeKey, setActiveKey] = useState('');

  useEffect(() => {
    if (tabsData.length) {
      setActiveKey(tabsData[0]?.key);
    }
  }, [tabsData]);

  const size = useBreakpoint();
  return (
    <>
      <div className={styles.tabContent}>
        <span className={styles.tabLabel}>Trainer:</span>
        {tabsData.length > 0 ? (
          <Tabs
            className={styles.tabs}
            data={tabsData}
            activeKey={activeKey}
            onChange={(item) => setActiveKey(item.key)}
          />
        ) : (
          ''
        )}
      </div>
      <List
        grid={{
          gutter: 12,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 1,
          xxl: 1,
        }}
        dataSource={sortResult?.[activeKey]}
        renderItem={(item: any, rowIndex) => (
          <List.Item>
            <div className={styles.listItem}>
              {size.md && (
                <div
                  className={classNames(styles.rankNum, {
                    [styles.top]: rowIndex < 2,
                  })}
                >
                  NO.{rowIndex + 1}
                </div>
              )}

              <div className={styles.userInfo}>
                {size.xl && <Avatar size={52} icon={<UserOutlined />} />}

                <div className={styles.userInfoRight}>
                  <span
                    className={styles.userName}
                  >{`${item?.user.firstName} ${item?.user.lastName}`}</span>
                  <span className={styles.scoreTitle}>Avg Score</span>
                  <span className={styles.scoreValue}>{item.avgScore ?? '--'}</span>
                </div>
              </div>
              <div className={styles.other} style={{ flex: '0 1 25%' }}>
                <div className={styles.title}>Question</div>
                <ul className={styles.list}>
                  {item.questionTitle?.map((question: string, index: number) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.other} style={{ flex: '0 1 5%', marginLeft: '2%' }}>
                <div className={styles.title}>Score</div>
                <ul className={classNames(styles.list, styles.scores)}>
                  {item.scores?.map((score: number, index: number) => (
                    <li key={index}>{`${Number(score)?.toFixed(1)}`}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.other} style={{ flex: 1, maxWidth: '32%' }}>
                <div className={styles.title}>Comment</div>
                <ul className={styles.list}>
                  {item.comment?.map((commentStr: string, commentIndex: number) => (
                    <li key={commentIndex}>{commentStr}</li>
                  ))}
                </ul>
              </div>
            </div>
          </List.Item>
        )}
      />
    </>
  );
}
