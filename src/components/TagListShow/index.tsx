import { Tooltip } from 'antd';
import { memo } from 'react';
import './index.less';

export type ListItem = Record<string, any>;
export interface ResourceNavPropsType {
  list: ListItem[];
  height?: number;
  prop?: ListItem;
  maxShow?: number;
}
/**
 * value    默认选项
 * list     选项列表
 * label    名称
 * prop     选项的属性 默认 {id, name}
 */
function TagShowLength({
  list = [],
  height = 30,
  prop,
  maxShow = 10000,
}: // prop,
ResourceNavPropsType) {
  return (
    <div className="tagshow-navList">
      <div className="tagshow-nav-list" style={{ height: 'auto' }}>
        <div>
          {list.slice(0, maxShow + 1).map((item, i) => {
            if (i < maxShow) {
              return (
                <span
                  className={`tagshow-nav-list-a`}
                  style={{ lineHeight: height + 'px', height }}
                  key={i}
                >
                  {item[prop ? prop.name : 'name']}
                </span>
              );
            } else {
              return (
                <Tooltip
                  title={list
                    .map((ite) => {
                      return ite[prop ? prop.name : 'name'];
                    })
                    .join(', ')}
                  key={'more'}
                >
                  <span
                    className={`tagshow-nav-list-a`}
                    style={{ lineHeight: height + 'px', height }}
                  >
                    ...
                  </span>
                </Tooltip>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(TagShowLength);
