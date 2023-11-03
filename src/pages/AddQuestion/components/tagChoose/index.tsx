import { useState, useEffect, useRef, memo } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import './index.less';

export type ListItem = Record<string, any>;
export interface TagChoosePropsType {
  value?: string[];
  list: ListItem[];
  height?: number;
  prop?: ListItem;
  onChange?: (key: string[]) => void;
}
/**
 * value    默认选项
 * list     选项列表
 * prop     选项的属性 默认 {id, name}
 */
function TagChoose({ value = [], list = [], height = 30, prop, onChange }: TagChoosePropsType) {
  const [activeKey, setActiveKey] = useState(value); // 保存选中的key
  const [btnKey, setBtnKey] = useState(true); // true 展开 false 收起
  const [showBtn, setShowBtn] = useState(false); // 是否显示展开收起按钮
  const navList = useRef<any>({});

  const onResize = () => {
    setShowBtn(navList.current.offsetHeight > height * 3.5 + 10);
  };
  useEffect(() => {
    setActiveKey(value);
  }, [value]);
  useEffect(() => {
    onResize();
  }, [list]);

  const onClick = (key: string) => {
    const location = activeKey.indexOf(key);
    const temp = activeKey;
    if (temp.indexOf(key) === -1) {
      temp.push(key);
    } else {
      temp.splice(location, 1);
    }
    setActiveKey([...temp]);
    if (onChange) onChange(temp);
  };

  return (
    <div className="tag-navList">
      <div className="tag-nav-list" style={{ height: btnKey ? height * 3.5 : 'auto' }}>
        <div ref={navList}>
          {[...list].map((item, i) => {
            const key = item[prop ? prop.name : 'name'];
            return (
              <a
                className={`${activeKey.includes(key) ? 'tag-nav-list-active' : ''} tag-nav-list-a`}
                style={{ lineHeight: height + 'px', height }}
                key={i}
                onClick={() => onClick(key)}
              >
                {item[prop ? prop.name : 'name']}
              </a>
            );
          })}
        </div>
      </div>
      {showBtn && (
        <a
          className="tag-nav-a"
          style={{ lineHeight: height + 'px', height }}
          onClick={() => setBtnKey(!btnKey)}
        >
          {btnKey ? 'Expand' : 'Collapse'}
          {btnKey ? <DownOutlined /> : <UpOutlined />}
        </a>
      )}
    </div>
  );
}

export default memo(TagChoose);
