import { useState, useEffect, memo } from 'react';
import { Tooltip } from 'antd';
import './index.less';

export type ListItem = Record<string, any>;
export interface ResourceNavPropsType {
  value?: string;
  list: ListItem[];
  label?: string;
  style?: StyleSheet;
  height?: number;
  prop?: ListItem;
  onChange?: (key: string) => void;
}
/**
 * value    默认选项
 * list     选项列表
 * label    名称
 * prop     选项的属性 默认 {id, name}
 */
function ResourceNav({
  value = '',
  list = [],
  label = '',
  style,
  height = 35,
  prop,
  onChange,
}: ResourceNavPropsType) {
  const [activeKey, setActiveKey] = useState(value); // 保存选中的key
  const onClick = (key: string) => {
    setActiveKey(key);
    if (onChange) onChange(key);
  };

  useEffect(() => {
    setActiveKey(value);
  }, [value]);

  const renderLabel = () => {
    if (!!label) {
      return (
        <label
          className="resource-nav-label"
          style={{ ...style, lineHeight: height + 'px', height }}
        >
          {label}
        </label>
      );
    }
    return undefined;
  };

  return (
    <div className="resource-navList">
      {renderLabel()}
      <div className="resource-nav-list" style={{ height: 'auto' }}>
        <div>
          <Tooltip title="All Topics">
            <a
              className={`${activeKey == '' ? 'resource-nav-list-active' : ''} resource-nav-list-a`}
              style={{ lineHeight: height + 'px', height }}
              key={0}
              onClick={() => onClick('')}
            >
              All Topics
            </a>
          </Tooltip>
          {[...list].map((item, i) => {
            const key = item[prop ? prop.id : 'id'];
            return (
              <Tooltip title={item[prop ? prop.name : 'name']} key={i}>
                <a
                  className={`${
                    activeKey == key ? 'resource-nav-list-active' : ''
                  } resource-nav-list-a`}
                  style={{ lineHeight: height + 'px', height }}
                  key={i}
                  onClick={() => onClick(key)}
                >
                  {item[prop ? prop.name : 'name']}
                </a>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(ResourceNav);
