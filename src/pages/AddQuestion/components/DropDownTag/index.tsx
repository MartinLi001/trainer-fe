import { memo, useEffect, useState } from 'react';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import style from './index.less';
import { Dropdown, Space, Input } from 'antd';
import TagChoose from '../tagChoose';

export type ListItem = Record<string, any>;
export interface DropdownTagType {
  name: string;
  list: ListItem[];
  value?: string[];
  prop: ListItem;
  onChange?: (key: string[]) => void;
  search?: (key: string) => void;
}

function DropDownTag({ name, value, list = [], onChange, search, prop }: DropdownTagType) {
  const [tagValue, setTagValue] = useState<string[]>();
  const [inputValue, setInputValue] = useState<string>();

  useEffect(() => {
    if (value) setTagValue(value);
  }, [value]);

  const tagChangeChoose = (listvalue: string[]) => {
    setTagValue([...listvalue]);
    if (onChange) onChange(listvalue);
  };
  const searchKey = (e: string) => {
    setInputValue(e);
    if (search) search(e);
  };

  const menu = (
    <div className={style.tagClass}>
      <Input
        placeholder="Search keyword"
        prefix={<SearchOutlined />}
        onChange={(e) => searchKey(e.target.value)}
        value={inputValue}
      />
      <div className={style.tagClassvalue}>
        <TagChoose list={list} prop={prop} onChange={(e) => tagChangeChoose(e)} value={tagValue} />
      </div>
    </div>
  );

  return (
    <div className={style.dropdownShow}>
      <Dropdown overlay={menu} trigger={['click']}>
        <span onClick={(e) => e.preventDefault()}>
          <Space>
            {name}
            <DownOutlined style={{ marginLeft: 25 }} />
          </Space>
        </span>
      </Dropdown>
    </div>
  );
}
export default memo(DropDownTag);
