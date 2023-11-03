import { Select } from 'antd';
import type { SelectProps } from 'antd';
import styles from './index.less';

const { Option } = Select;

function SeeSelect(props: SelectProps) {
  const { children, ...rest } = props;
  return (
    <Select
      bordered={false}
      className={styles.select}
      popupClassName={styles.popupClassName}
      {...rest}
    >
      {props.children}
    </Select>
  );
}

SeeSelect.Option = Option;
export default SeeSelect;
