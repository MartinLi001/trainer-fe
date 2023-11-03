import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { CloseOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { Button, Dropdown, Menu, Modal, message } from 'antd';
import { deleteLanguageList, getLanguageList } from '@/services/coder';
import IconFont from '@/components/IconFont';
// const languageList = [
//   {
//     name: 'Java',
//     value: 'java',
//   },
//   {
//     name: 'JavaScript',
//     value: 'js',
//   },
//   {
//     name: 'Python',
//     value: 'python',
//   },
// ];
interface languageType {
  name: string;
  value: string;
}

function LanguageChoose({
  questionId,
  onChange,
}: {
  onChange?: (value: string) => void;
  questionId: string;
}) {
  const [languageList, setLanguageList] = useState<languageType[]>([]);
  const [chooseEdList, setChooseEdList] = useState<languageType[]>([]);
  const [language, setLanguage] = useState<string>();

  useEffect(() => {
    getLanguageList(questionId).then((res) => {
      setLanguageList(res.languageList);
      setChooseEdList(res.chooseLanguageList);
      let newId = res.chooseLanguageList.length > 0 ? res.chooseLanguageList[0].value : '';
      setLanguage(newId);
      if (onChange) onChange(newId);
    });
  }, []);
  const ChooseMenu = (item: languageType) => {
    let flag = false;
    chooseEdList.map((ite) => {
      if (ite.value === item.value) {
        flag = true;
      }
    });
    if (flag) return;
    let newList = [...chooseEdList];
    if (newList.includes(item)) {
      return;
    }
    newList.push(item);
    setLanguage(item.value);
    if (onChange) onChange(item.value);
    setChooseEdList(newList);
  };
  const menu = (
    <Menu
      items={languageList.map((item) => {
        return {
          key: item.value,
          label: <div onClick={() => ChooseMenu(item)}>{item.name}</div>,
          disabled: chooseEdList.filter((ite) => ite.value == item.value).length > 0,
        };
      })}
    />
  );
  // const handleMenuClick = ({ key, domEvent }: any, app: AppType) => {
  //   domEvent.stopPropagation();
  // };
  const deleteChoose = (item: languageType) => {
    Modal.confirm({
      title: 'Delete Java Configuration',
      icon: <IconFont type="icon-a-iconerror" style={{ color: '#F14D4F' }} />,
      content:
        'All configurations associated with this language will be deleted and cannot be recovered.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteLanguageList({ questionId, language: item.value })
          .then(() => {
            let newList = [...chooseEdList];
            newList = newList.filter((item1) => {
              return item1.value != item.value;
            });
            let newId = newList.length > 0 ? newList[0].value : '';
            setChooseEdList(newList);
            setLanguage(newId);
            if (onChange) onChange(newId);
          })
          .catch((res) => {
            message.error(res.message || 'Delete failed');
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  return (
    <div className={styles.LanguageChoose}>
      <div className={styles.LanguageChooseTitle}>Solution Language</div>
      {(chooseEdList || []).map((item, index) => {
        return (
          <div
            key={index}
            className={
              item.value != language ? styles.LanguageChooseItem : styles.LanguageChooseItemChoose
            }
            onClick={() => {
              setLanguage(item.value);
              onChange && onChange(item.value);
            }}
          >
            {item.name}{' '}
            <CloseOutlined
              onClick={(event) => {
                event.stopPropagation();
                deleteChoose(item);
              }}
            />
          </div>
        );
      })}
      <Dropdown overlay={menu} trigger={['click']}>
        <div className={styles.LanguageChooseItem}>
          <PlusOutlined />
        </div>
      </Dropdown>
    </div>
  );
}

export default LanguageChoose;
