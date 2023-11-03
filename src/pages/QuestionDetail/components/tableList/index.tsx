// import { useState } from 'react';
import { List } from 'antd';
import type { SearchData } from '../../typeList';
import style from './index.less';

interface itemType {
  list: SearchData[];
  FrequencyList: {
    Low: any;
    Medium: any;
    High: any;
  };
  onChange?: (key: string) => void;
}

function TableList({ list, FrequencyList, onChange }: itemType) {
  const ChangeShowQuestion = (id: string) => {
    if (onChange) onChange(id);
  };
  return (
    <List
      itemLayout="horizontal"
      className={style.TableList}
      dataSource={list}
      renderItem={(item, i) => (
        <List.Item>
          <List.Item.Meta
            title={
              <div
                className={style.ListBatchTitle}
                onClick={() => ChangeShowQuestion(item.questionId)}
              >
                {item.name}
              </div>
            }
            key={i}
          />
          <div>
            <img src={FrequencyList[`${item?.frequency}`]} style={{ marginRight: 25 }} />
          </div>
        </List.Item>
      )}
    />
  );
}

export default TableList;
