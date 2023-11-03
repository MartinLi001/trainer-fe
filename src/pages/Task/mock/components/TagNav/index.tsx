import React, { useEffect, useState, useRef } from 'react';
import { Tooltip } from 'antd';
import './index.less';

type ValueType = string;
export type ListItem = Record<string, ValueType>;
interface TagSelectorProps<T> {
  /**
   * 标签数组
   */
  list: any[];
  /**
   * 当前值
   */
  value?: T;
  /**
   * 变化回调
   */
  onChange?: (val: T) => void;
  /**
   * 标签选择器类型，支持单选或多选。
   */
  type?: 'radio' | 'checkbox';
  /**
   * 指定显示前几行为收起显示。
   */
  displayMaxLineLength?: number;
  /**
   * 指定是否添加“全部”选项
   */
  showAll?: boolean;
  /**
   * 全部选项的文案
   */
  allText?: string;
  /**
   * 全部选项的值
   */
  allValue?: string;
  /**
   * 指定标签文字和value的字段，默认name 和id
   */
  prop?: ListItem;
  /**
   * 标签高度
   */
  height?: number;
  /**
   * tag前标签
   */
  label?: string;
  /**
   * tag内ICon
   */
  icon?: React.ReactNode;
  /**
   * 标签样式
   */
  style?: React.CSSProperties;
  /**
   * 选中标签样式
   */
  selectstyle?: React.CSSProperties;
}
export default function TagNav<T extends ValueType | ValueType[]>({
  list = [],
  value,
  onChange,
  type = 'checkbox',
  displayMaxLineLength = 1,
  showAll = false,
  allText = '全部',
  allValue = 'all',
  prop,
  height = 35,
  icon,
  label,
  style,
  selectstyle = { color: '#4A585F', backgroundColor: '#E9F5D4' },
}: TagSelectorProps<T>) {
  const [activeKey, setActiveKey] = useState<ValueType[]>([allValue]);
  const [showBtn, setShowBtn] = useState(true);
  const navList = useRef<any>({});

  useEffect(() => {
    if (value) {
      if (value.constructor !== Array) {
        const temp = [value] as string[];
        setActiveKey(temp);
      } else {
        setActiveKey([...value]);
      }
    }
  }, [value]);

  useEffect(() => {
    setShowBtn(navList.current.offsetHeight > (height + 10) * displayMaxLineLength);
  }, [list]);

  const onClick = (tag: ValueType, checked: boolean) => {
    let nextValue = [...activeKey];
    if (type === 'radio') {
      nextValue = checked ? [tag] : showAll ? [allValue] : [];
    } else if (type === 'checkbox') {
      const filteredVal = nextValue.filter((item) => item !== tag && item !== allValue);
      if (showAll) {
        if (tag === allValue) {
          nextValue = [allValue];
        } else if (checked) {
          filteredVal.push(tag);
          nextValue = filteredVal;
        } else {
          nextValue = filteredVal.length ? filteredVal : [allValue];
        }
      } else {
        if (checked) {
          nextValue = [...filteredVal, tag];
        } else {
          nextValue = filteredVal.length ? filteredVal : [];
        }
      }
    }
    setActiveKey([...nextValue]);
    if (type === 'radio') {
      if (onChange) onChange(nextValue[0] as T);
    } else {
      if (onChange) onChange([...nextValue] as T);
    }
  };

  return (
    <div className="seethingx-tagNav">
      {label && (
        <label
          className="seethingx-tagNav-label"
          style={{
            lineHeight: height + 'px',
            height: `${showBtn ? (height + 10) * displayMaxLineLength : height} `,
          }}
        >
          {label} ：
        </label>
      )}
      <div className="seethingx-tagNav-list" style={{ height: 'auto' }}>
        <div ref={navList}>
          {[...list].map((item, i) => {
            const key = item.userId;
            const falg = activeKey.includes(key);
            return (
              <a
                className={`seethingx-tagNav-list-a`}
                style={
                  falg
                    ? { ...style, lineHeight: height + 'px', height, ...selectstyle }
                    : { ...style, lineHeight: height + 'px', height }
                }
                key={i}
                onClick={() => onClick(key, !falg)}
              >
                {icon && <span style={{ marginRight: 3 }}> {icon}</span>}
                {item.firstName} {item.lastName}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
