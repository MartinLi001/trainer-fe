import { memo, useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import './index.less';
import { Dropdown, Space } from 'antd';
import FlexNav, { ListItem } from '@/pages/Question/Componts/FlexNav';

// interface valueType {
//   tag: string[];
//   cli: string[];
// }
export interface DropdownTagType {
  list: ListItem[];
  value?: string;
  onChange?: (label: string) => void;
}

function DropDown({ value, list = [], onChange }: DropdownTagType) {
  const [tagValue, setTagValue] = useState<string>();

  useEffect(() => {
    console.log('%cindex.tsx line:21 value', 'color: #007acc;', value);
    if (value) {
      setTagValue(value);
    } else {
      setTagValue('');
    }
  }, [value]);

  const menu = (
    <div className="tagClass">
      <FlexNav
        list={list}
        value={tagValue}
        prop={{ name: 'topic', id: 'topic' }}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
      />
    </div>
  );

  return (
    <div className="dropdown-Topics">
      <Dropdown overlay={menu} trigger={['click']}>
        <span onClick={(e) => e.preventDefault()}>
          <Space>
            Topics
            <DownOutlined style={{ marginLeft: 35 }} />
          </Space>
        </span>
      </Dropdown>
    </div>
  );
}
export default memo(DropDown);
