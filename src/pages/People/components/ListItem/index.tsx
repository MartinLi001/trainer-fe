import { Avatar, Checkbox, List } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import style from './index.less';
import type { PeopleType } from '../../typeList';
import { PushpinOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

export interface PeopleListType {
  data: PeopleType[];
  type?: string;
  chooseShow?: boolean;
  chooseList?: string[];
  onChoose?: (key: string[]) => void;
  onClick?: (user: PeopleType) => void;
}
function ListPeople({
  data = [],
  type,
  chooseShow = false,
  onChoose,
  onClick,
  chooseList,
}: PeopleListType) {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    setList([...(chooseList || [])]);
  }, [chooseList]);

  const onChange = (e: CheckboxChangeEvent) => {
    let temp = [...list];
    if (e.target.checked) {
      temp.push(e.target.value);
    } else {
      temp = temp.filter((ite) => {
        return ite != e.target.value;
      });
    }
    setList([...temp]);
    if (onChoose) {
      onChoose(temp);
    }
  };
  const onclickUser = (user: PeopleType) => {
    if (onClick && !chooseShow) onClick(user);
    return false;
  };
  return (
    <List
      itemLayout="horizontal"
      className={style.ListPeople}
      dataSource={data}
      grid={{ gutter: 12 }}
      renderItem={(item) => (
        <List.Item className={style.ListPeopleItem} onClick={() => onclickUser(item)}>
          <List.Item.Meta
            style={{ alignItems: 'center' }}
            avatar={
              <>
                {chooseShow && (
                  <Checkbox
                    // onClick={e => e.preventDefault()}
                    onChange={onChange}
                    style={{ marginRight: 26 }}
                    value={item.userId}
                  ></Checkbox>
                )}
                <Avatar style={{ backgroundColor: '#87d068' }}>
                  {item.firstName?.slice(0, 1).toUpperCase()}
                </Avatar>
              </>
            }
            title={
              <div className={style.ListPeopleHeader}>
                <span className={style.ListPeopleName}>{`${item.firstName} ${item.lastName}`}</span>
              </div>
            }
            description={
              <div className={style.descriptionShow}>
                <div>
                  <div className={style.ListPeoplePref}>
                    {item.preferredName ? `@${item.preferredName}` : ''}
                  </div>
                  <div className={style.ListPeopleEmail}>{item.email}</div>
                </div>
                {type == 'trainer' && (
                  <div className={style.Trainer}>
                    <PushpinOutlined />
                    Trainer
                  </div>
                )}
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
}

export default memo(ListPeople);
