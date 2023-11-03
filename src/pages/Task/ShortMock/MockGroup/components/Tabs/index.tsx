import classNames from 'classnames';
import { ReactNode } from 'react';
import styles from './index.less';

export interface TabsItemType {
  key: string;
  label: string | ReactNode;
  values?: string[];
}

interface TabsProps {
  data: TabsItemType[];
  activeKey: string;
  className?: React.CSSProperties;
  onChange: (value: TabsItemType) => void;
}

const Tabs = ({ data, activeKey, onChange, className }: TabsProps) => {
  const onClick = (item: TabsItemType) => {
    onChange?.(item);
  };

  const classNameTemp = classNames(styles.list);

  return (
    <ul className={`${classNameTemp} ${className}`}>
      {data.map((item, index) => (
        <li
          key={index}
          className={item.key === activeKey ? styles.selected : undefined}
          onClick={() => onClick(item)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};

export default Tabs;
