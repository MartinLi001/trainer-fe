import { memo, useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import './index.less';
/**
 * value    默认选项
 * list     选项列表
 * label    名称
 * prop     选项的属性 默认 {id, name}
 */

export type DropListItem = { name?: string; color?: string | number; Icon?: any };
export interface DropdownListType {
  value?: DropListItem;
  list: DropListItem[];
  label: string;
  IconShow?: Boolean;
  onChange?: (key: string) => void;
}
function DropdownList({ value, list = [], label, IconShow = false, onChange }: DropdownListType) {
  const [aciveKey, SetActiveKey] = useState<string>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!value?.name) {
      SetActiveKey('');
      // if (onChange) onChange('');
    }
  }, [value]);

  const onClick = (key: any) => {
    if (key == aciveKey) {
      SetActiveKey('');
      if (onChange) onChange('');
    } else {
      SetActiveKey(key);
      if (onChange) onChange(key);
    }
    setVisible(false);
  };
  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };
  const renderBorder = (ite: DropListItem) => {
    let sty = {};
    if (aciveKey == ite.name) {
      sty = { border: `2px solid ${ite.color}` };
    }
    return sty;
  };
  const menu = (
    <div className="dropContent">
      {list.map((ite, index) => {
        return (
          <div key={index} className={`dropContentList`} onClick={() => onClick(ite.name)}>
            <div
              className={`dropContent-title  ${IconShow ? 'dropContent-Icon' : ''}`}
              style={renderBorder(ite)}
            >
              <span style={{ color: `${ite.color}` }}>{ite.name} </span>{' '}
              {IconShow ? <img src={ite.Icon} width={20} /> : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
  return (
    <div className="dropdown-List">
      <Dropdown
        overlay={menu}
        trigger={['click']}
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <span onClick={(e) => e.preventDefault()}>
          <div className="dropdown-tag">
            <Space>
              {label}
              <DownOutlined style={{ marginLeft: 15 }} />
            </Space>
          </div>
        </span>
      </Dropdown>
    </div>
  );
}
export default memo(DropdownList);
