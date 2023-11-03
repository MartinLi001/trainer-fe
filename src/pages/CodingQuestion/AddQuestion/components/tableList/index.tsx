// import { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { List, Tooltip } from 'antd';
import type { DetailValueType } from '../../typeList';
import style from './index.less';

interface itemType {
  list: DetailValueType[];
  onChange?: (key: string) => void;
}

function TableList({ list, onChange }: itemType) {
  const DeleteQuestion = (id: string) => {
    if (onChange) onChange(id);
  };
  return (
    <List
      itemLayout="horizontal"
      className={style.TableList}
      dataSource={list}
      renderItem={(item, i) => (
        <List.Item key={i}>
          <List.Item.Meta
            title={
              <div className={style.ListBatchTitle}>
                <div className={style.nameShow}>
                  <Tooltip title={item.name}>{item.name}</Tooltip>
                </div>
                <div className={style.tagListShow}>
                  {(item.tags || []).map((ite, index) => {
                    return (
                      <div className={style.tagshow} key={index}>
                        {' '}
                        {ite}
                      </div>
                    );
                  })}
                </div>
                <CloseOutlined onClick={() => DeleteQuestion(item.questionId)} />
              </div>
            }
            key={i}
          />
          <div></div>
        </List.Item>
      )}
    />
  );
}

export default TableList;
