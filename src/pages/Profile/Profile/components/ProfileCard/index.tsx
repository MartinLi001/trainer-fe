import type { ReactNode } from 'react';

import { RegisterUserInfo, RegisterAddresses } from '@/services/user/interface';
import styles from './index.less';

type DataObject = Record<string, any>;
type NodeType = string | ReactNode;
interface CardPropsType {
  title: string | ReactNode;
  icon?: ReactNode;
  extra?: NodeType;
  contentHeader?: (data: DataObject) => void | NodeType;
  contentFooter?: (showAddBtn: boolean) => void | NodeType;
  dataConfig: DataObject;
  dataSource: RegisterAddresses[] | RegisterUserInfo;
}

/**
 *
 * @param props title: 头部title文案 extra: 头部右侧部分 contentHeader: 内容区顶部区域  contentFooter: 内容区底部区域  dataConfig: 数据源配置   dataSource: 数据源
 * @returns
 */
export default function Card(props: CardPropsType) {
  const {
    title = 'Basic Information',
    contentHeader,
    contentFooter,
    dataConfig,
    dataSource,
  } = props;

  const renderItem = (data: DataObject) => {
    return Object.keys(dataConfig).map((key) => {
      const value = data[key];
      return (
        <div className={styles.listItem} key={key}>
          <span className={styles.label}>{dataConfig[key]}</span>
          <span className={styles.value}>{!!value ? value : '--'}</span>
        </div>
      );
    });
  };

  const renderContent = () => {
    if (Object.prototype.toString.call(dataSource) === '[object Object]') {
      return <div className={styles.content}>{renderItem(dataSource)}</div>;
    } else if (Array.isArray(dataSource)) {
      return (
        <>
          {dataSource.map((data, index) => (
            <div key={index}>
              {contentHeader && contentHeader(data)}
              <div className={styles.content}>{renderItem(data)}</div>
            </div>
          ))}
          {contentFooter && contentFooter(true)}
        </>
      );
    }
    return;
  };

  return (
    <div className={styles.card}>
      {title}
      <div className={styles.contentWrap}>{renderContent()}</div>
    </div>
  );
}
