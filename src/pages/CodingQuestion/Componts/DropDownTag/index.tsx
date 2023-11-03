import { memo, useEffect, useState } from 'react';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import './index.less';
import { Dropdown, Tabs, Space, Input } from 'antd';
import type { threeStype } from '../../typeList';
import TagChoose from '../tagChoose';
import SeeButton from '@/components/SeeButton';
const { TabPane } = Tabs;

interface valueType {
  tag: string[];
  cli: string[];
}
export interface DropdownTagType {
  list: threeStype[];
  value?: valueType;
  onChange?: (key: string[], label: string) => void;
  search?: (key: string, label: string) => void;
}

function DropDownTag({ value, list = [], onChange, search }: DropdownTagType) {
  const [tagValue, setTagValue] = useState<valueType>({ tag: [], cli: [] });
  const [inputValue, setInputValue] = useState<string>();
  const [activeKey, setActiceKey] = useState('');

  useEffect(() => {
    if (value) setTagValue(value);
  }, [value]);

  const tagChangeChoose = (listvalue: string[], label: string) => {
    const temp = tagValue;
    if (label === 'Tags') {
      temp.tag = listvalue;
    } else {
      temp.cli = listvalue;
    }
    setTagValue({ ...temp });

    if (onChange) onChange(listvalue, label);
  };
  const clearTypeList = () => {
    let label = 'Tags';
    if (activeKey == '1') {
      label = 'cli';
    }
    const temp = tagValue;
    if (label === 'Tags') {
      temp.tag = [];
    } else {
      temp.cli = [];
    }
    setTagValue({ ...temp });
    if (onChange) onChange([], label);
  };
  const searchKey = (e: string) => {
    setInputValue(e);
    let label = 'Tags';
    if (activeKey == '1') {
      label = 'cli';
    }
    if (search) search(e, label);
  };
  const onChangeTabs = (key: string) => {
    if (inputValue) {
      setInputValue('');
    }
    searchKey('');
    setActiceKey(key);
  };

  const menu = (
    <div className="tagClass">
      <Input
        placeholder="Search keyword"
        prefix={<SearchOutlined />}
        onChange={(e) => searchKey(e.target.value)}
        value={inputValue}
      />
      <Tabs defaultActiveKey="0" onChange={onChangeTabs}>
        {list.map((ite, index) => {
          let prop = {};
          if (ite.label === 'Tags') {
            prop = { name: 'tag', id: 'questionTagId' };
          } else {
            prop = { name: 'name', id: 'clientId' };
          }
          return (
            <TabPane tab={ite.label} key={index} className="tagClass-tab">
              <TagChoose
                list={ite.list}
                prop={prop}
                onChange={(e) => tagChangeChoose(e, ite.label)}
                value={ite.label === 'Tags' ? tagValue.tag : tagValue.cli}
              />
            </TabPane>
          );
        })}
      </Tabs>
      <SeeButton type="danger" ghost onClick={() => clearTypeList()}>
        Clear All
      </SeeButton>
    </div>
  );

  return (
    <div className="dropdown-Tag">
      <Dropdown overlay={menu} trigger={['click']}>
        <span onClick={(e) => e.preventDefault()}>
          <Space>
            Tag
            <DownOutlined style={{ marginLeft: 35 }} />
          </Space>
        </span>
      </Dropdown>
    </div>
  );
}
export default memo(DropDownTag);
