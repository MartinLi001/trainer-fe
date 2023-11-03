import { Tooltip } from 'antd';
import { cloneDeep } from 'lodash';
import { useMemo } from 'react';
import styles from './index.less';

interface Props {
  summary: any;
}
export default function CodingMockSummary(props: Props) {
  const { summary = [] } = props;
  function mergeName(user?: any) {
    if (!user) return '';
    return [user.firstName || user.firstname, user.lastName || user.lastname].join(' ');
  }
  const summarySorted = useMemo(() => {
    const result = cloneDeep(summary);
    result.sort((a: any, b: any) => {
      const scoreA = Number(a.avgScore);
      const scoreB = Number(b.avgScore);
      // 按照平均分降序排序
      if (scoreA > scoreB) return -1;
      else if (scoreA < scoreB) return 1;
      else {
        // 若平均分相同，则按照字母顺序升序排序
        const nameA = mergeName(a.user).toLocaleLowerCase();
        const nameB = mergeName(b.user).toLocaleLowerCase();
        if (nameA > nameB) return 1;
        else if (nameA < nameB) return -1;
        else return 0;
      }
    });
    return result;
  }, [summary]);
  return (
    <div className={styles.wrapper}>
      {summarySorted?.map((item: any) => (
        <div className={styles.card} key={item?.user?.userId + 'summary'}>
          <Tooltip
            title={mergeName(item.user)}
            mouseEnterDelay={0.5}
            trigger={
              (document.getElementById(`${item.user.userId}-tooltip`)?.offsetWidth || 0) > 125
                ? 'hover'
                : ''
            }
          >
            <div className={styles.nameBox}>
              <span id={`${item.user.userId}-tooltip`} className={styles.name}>
                {mergeName(item.user)}
              </span>
            </div>
          </Tooltip>
          <div className={styles.avg}>Avg</div>
          <div className={styles.avgNum}>{item.avgScore}</div>
          <div className={styles.scoreList}>
            {item.scores.map((score: any, index: number) => (
              <span key={index + item?.user?.userId + 'score'}>
                <span className={styles.order}>Q{index + 1}</span>
                <span className={styles.score}>{score?.toFixed(1)}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
