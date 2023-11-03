import React from 'react';
import { Input } from 'antd';
import './index.less';
import { InputProps } from 'antd/es/input';

interface SearchInputType extends Omit<InputProps, 'prefix' | 'onChange'> {
  /**
   * title文本
   */
  title?: string;
  /**
   * input内ICon
   */
  icon?: React.ReactNode;
  /**
   * 点击按钮时触发的函数，其参数 completeCallback 需要在接口请求完毕后调用，用于告知组件接口请求已完成。
   */
  onChangeKeyWord: (value: string) => void;
}
function SearchInput({
  title = 'Enter keyword to search',
  icon,
  onChangeKeyWord,
  ...rest
}: SearchInputType) {
  return (
    <div className="SearchInput">
      <span style={{ width: 240 }}> {title}</span>
      <Input {...rest} prefix={icon} onChange={(e) => onChangeKeyWord(e.target.value)} />
    </div>
  );
}

export default SearchInput;
