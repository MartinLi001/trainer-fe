import { memo, useEffect, useMemo, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Checkbox, Dropdown } from 'antd';
import originStyles from './index.less';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { mergeStyles } from '@/utils';
import cx from 'classnames';
/**
 * value    默认选项
 * list     选项列表
 * label    名称
 * prop     选项的属性 默认 {id, name}
 */

export type DropListItem = Record<string, any>;
export interface DropdownListType {
  value?: string[];
  list: DropListItem[];
  label: string;
  onChange?: (key: string[]) => void;
  prop?: Record<string, any>;
  style?: React.CSSProperties;
  classname?: Record<string, any>;
  disabled?: boolean;
}
function SelectChoose({
  value,
  list = [],
  label,
  onChange,
  prop,
  style,
  classname,
  disabled,
}: DropdownListType) {
  const styles = useMemo(
    () => mergeStyles(originStyles, classname),
    [mergeStyles, originStyles, classname],
  );

  const [visible, setVisible] = useState(false);
  const [checkValue, setCheckValue] = useState<string[]>([]);
  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  const onChangeCheck = (checkedValues: CheckboxValueType[]) => {
    setCheckValue([...checkedValues] as string[]);
    if (onChange) onChange(checkedValues as string[]);
  };

  useEffect(() => {
    if (value && value.length > 0) {
      setCheckValue([...value]);
    } else {
      setCheckValue([]);
    }
  }, [value]);

  const menu = (
    <div className={styles.dropContent}>
      <Checkbox.Group onChange={onChangeCheck} value={checkValue}>
        {/* <Row> */}
        {(list || []).map((ite) => {
          return (
            <div className={styles.dropContentList} key={ite[prop ? prop.id : 'id'] + 'checkbox'}>
              <div className={styles.dropContentListTitle}>
                <Checkbox value={ite[prop ? prop.id : 'id']}>
                  {ite[prop ? prop.name : 'name']}
                </Checkbox>
              </div>{' '}
            </div>
          );
        })}
        {/* </Row> */}
      </Checkbox.Group>
    </div>
  );
  return (
    <div className={styles.selectChoose} style={{ ...style }}>
      <Dropdown
        overlay={menu}
        trigger={['click']}
        open={visible}
        onOpenChange={handleVisibleChange}
        getPopupContainer={(node) => node.parentNode as HTMLElement}
        disabled={disabled}
      >
        <span onClick={(e) => e.preventDefault()}>
          <div className={cx(styles.selectChooseTag, { [styles.disabled]: disabled })}>
            {label}
            <DownOutlined style={{ marginTop: 5 }} />
          </div>
        </span>
      </Dropdown>
    </div>
  );
}
export default memo(SelectChoose);
