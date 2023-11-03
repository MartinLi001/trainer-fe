import type { ReactNode } from 'react';
import styles from './index.less';

type NodeType = string | ReactNode;
interface CardTitlePropsType {
  title: string | ReactNode;
  iconFont?: string | ReactNode;
  extra?: NodeType;
  children?: ReactNode;
}

/**
 *
 * @param props title: 头部title文案 icon: 头部title前图标  extra: 头部右侧部分
 * @returns
 */

export default function CardTitle(props: CardTitlePropsType) {
  const { title = 'Basic Information', iconFont, extra, children } = props;

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {iconFont && <span className={styles.icon}>{iconFont}</span>}
        <span className={styles.title}>{title}</span>
        {children}
      </div>
      <div className={styles.right}>{extra}</div>
    </div>
  );
}
