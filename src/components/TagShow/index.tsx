import { memo } from 'react';
import './index.less';

export type ListItem = Record<string, any>;
export interface ResourceNavPropsType {
  list: string[];
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
function TagShow({
  list = [],
  height = 30,
}: // prop,
ResourceNavPropsType) {
  return (
    <div className="tagshow-navList">
      <div className="tagshow-nav-list" style={{ height: 'auto' }}>
        <div>
          {[...list].map((item, i) => {
            return (
              <span
                className={`tagshow-nav-list-a`}
                style={{ lineHeight: height + 'px', height }}
                key={i}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(TagShow);
