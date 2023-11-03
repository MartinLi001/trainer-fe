import React, { useMemo } from 'react';
import styles from './index.less';
import Submitted from '@/assets/Submitted.svg';
import Late from '@/assets/Late.svg';
import Unsubmitted from '@/assets/Unsubmitted.svg';
import locked from '@/assets/locked.svg';
import arrrow from '@/assets/Arrow.svg';
import type { CourseListProps, SortList } from './interface';
import { taskType } from './common';
import { data2group, formatTaskTitle } from './utils';
import { history, useLocation } from 'umi';
import { Empty } from 'antd';
import moment from 'moment';

const type2icon = {
  [taskType.LECTURE]: <span className={styles.lecture}>Lecture</span>,
  [taskType.ASSIGNMENT]: <span className={styles.assignment}>Assignment</span>,
  [taskType.CODINGMOCK]: <span className={styles.codingMock}>Coding Mock</span>,
  [taskType.SHORTANSWERMOCK]: <span className={styles.codingMock}>Short Answer Mock</span>,
  [taskType.PROJECT]: <span className={styles.project}>Project</span>,
};

/**
 * @description 先对时间进行比较，分为当前和之前，再对同天的数据进行分组
 */
const CourseList: React.FC<CourseListProps> = ({ data = [], sort = 'default', extra }) => {
  const { pathname } = useLocation() as any;

  const handleTaskClick = async (taskId: string, type: string) => {
    const isMybatch = pathname.startsWith('/myBatch');
    history.push(`${isMybatch ? '/myBatch' : '/Category/Batches'}/${type}/${taskId}`);
  };

  const renderStatus = (summitted: any) => {
    if (summitted.isSubmitted) {
      return (
        <div className={`${styles.Unsubmitted} ${styles.status}`}>
          <img src={Unsubmitted} className={styles.img} />
          unsubmitted
        </div>
      );
    } else if (summitted.isLate) {
      return (
        <div className={`${styles.Late} ${styles.status}`}>
          <img src={Late} className={styles.img} />
          late
        </div>
      );
    } else {
      return (
        <div className={`${styles.Submitted} ${styles.status}`}>
          <img src={Submitted} className={styles.img} />
          submitted
        </div>
      );
    }
  };

  /**
   * @description 对数据进行遍历，生成content
   */
  const data2content = (list: API.TaskType[]) => {
    return list?.map((item: API.TaskType) => {
      return (
        <div
          className={styles.contentItem}
          key={item.taskId}
          onClick={() => handleTaskClick(item.taskId, item.type)}
        >
          <div className={styles.contentLeft}>
            <div className={styles.contentTop}>
              <span className={styles.title}>{item.name}</span>
              <span className={styles.icon}>{type2icon[item.type]}</span>
            </div>
            {/* <Tooltip placement="top" title={item.description}> */}
            <div className={styles.contentBottom}>{item.description}</div>
            {/* </Tooltip> */}
          </div>
          <div className={styles.contentRight}>
            {item.isLocked && (
              <>
                <img src={locked} className={`${styles.status} ${styles.img}`} />
                <span className={styles.label}>locked</span>
              </>
            )}
            {item.submissionSummaryDto && renderStatus(item.submissionSummaryDto)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {extra?.(item)}
          </div>
        </div>
      );
    });
  };

  /**
   * @description 对数据进行遍历，循环生成title
   */
  const data2title = (groupArray: API.TaskType[][]) => {
    return groupArray.map((item, index) => {
      return (
        <div className={styles.list} key={index}>
          <div className={styles.listHeader}>{formatTaskTitle(item[0])}</div>
          <div className={styles.listContent}>{data2content(item)}</div>
        </div>
      );
    });
  };

  const groupToArrayAndSort = (groupObj: SortList, sortType: string = 'default') => {
    const sortMode = ['default', 'asc'].includes(sortType) ? 1 : -1;
    return Object.keys(groupObj)
      .sort((key1: string, key2: string) => {
        const [priority, date] = key1.split('/');
        const [priority2, date2] = key2.split('/');
        if (key1.includes('/')) {
          if (priority === priority2) {
            return (+new Date(date) - +new Date(date2)) * sortMode;
          }
          return (+priority - +priority2) * sortMode;
        }
        return (+priority - +priority2) * sortMode;
      })
      .reduce((result, key) => {
        result.push(groupObj[key]);
        return result;
      }, [] as any);
  };

  const [current, pre, isEmpty] = useMemo(() => {
    // 三天前
    const threeDaysAgo = moment().subtract(3, 'days').startOf('day');
    const [currentData, previousData, lockedData] = data.reduce(
      (result: API.TaskType[][], cur: API.TaskType) => {
        const [currentArr, previousArr, lockedArr] = result;
        if (cur.isLocked && !cur.startDateTime) {
          lockedArr.push(cur);
        } else if (moment(cur.startDateTime) > threeDaysAgo) {
          currentArr.push(cur);
        } else {
          previousArr.push(cur);
        }
        return result;
      },
      [[], [], []],
    );

    const preTemp = data2group(previousData, 'startDateTime');
    const currentTemp = data2group(currentData, 'startDateTime');
    const lockedTemp = data2group(lockedData, 'priority');

    const isEmptyTemp = data.length === 0;

    const currentResult = groupToArrayAndSort(currentTemp, sort);
    const preResult = groupToArrayAndSort(preTemp, sort);
    const lockedResult = groupToArrayAndSort(lockedTemp, sort);

    return [currentResult.concat(lockedResult), preResult, isEmptyTemp];
  }, [data, sort]);

  return (
    <>
      {isEmpty ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className={styles.taskList}>
          {data2title(current)}
          {Object.keys(pre).length !== 0 && (
            <div className={styles.previousArea}>
              <span className={styles.previous}>Previous Tasks</span>
              <img src={arrrow} className={styles.arrrow} />
            </div>
          )}
          {data2title(pre)}
        </div>
      )}
    </>
  );
};

export default CourseList;
