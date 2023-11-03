import { ReactNode } from 'react';
import { history } from 'umi';
// import IconFont from '@/components/IconFont';
import styles from './index.less';

export interface PageHeaderItemType {
  name: string;
  href?: string;
}
interface HeaderPagePropsType {
  items: PageHeaderItemType[];
  extra?: string | ReactNode;
}

/**
 *
 * @param items PageHeaderItemType[]
 */
export default function index(props: HeaderPagePropsType) {
  const { items = [] } = props ?? {};
  const jump = (i: number, item: any) => {
    if (i !== items.length - 1) {
      if (item.href) {
        const temp = JSON.parse(localStorage.getItem('pageHeaderItems') ?? '[]');
        const result = temp.slice(0, i);
        localStorage.setItem('pageHeaderItems', JSON.stringify(result));
        history.replace(item.href);
      }
    }
  };

  const renderTitleItem = (titleItem: PageHeaderItemType, i: number): React.ReactNode => {
    if (!titleItem) return;
    return (
      <span className={styles.span} key={i} onClick={() => jump(i, titleItem)}>
        {titleItem.name}
      </span>
    );
  };

  return (
    <div className={styles.pageHeader}>
      <div className={styles.pageHeaderContent}>
        {items.length > 0 &&
          items.map((item: PageHeaderItemType, i: number) => renderTitleItem(item, i))}
      </div>
      <div className={styles.HeaderExtra}>{props.extra}</div>
    </div>
  );
}
