import styles from './index.less';

interface TabsItemType {
  key: string;
  label: string;
  values?: string[];
}

interface TabsProps {
  data: TabsItemType[];
  activeKey: string;
  onChange: (value: TabsItemType) => void;
}

const Tabs = ({ data, activeKey, onChange }: TabsProps) => {
  const onClick = (item: TabsItemType) => {
    onChange?.(item);
  };

  return (
    <ul className={styles.list}>
      {data.map((item) => (
        <li
          key={item.key}
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
