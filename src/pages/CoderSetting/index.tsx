import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { useHistory, useLocation } from 'umi';
import TagList from '@/components/TabList';
import Configuration from '../ConfigurationPage';
import Language from '../LanguagePage';
import { PageBreadCrumb } from '@/components/PageBreadCrumb';
import { ExclamationCircleOutlined, LeftOutlined, WarningOutlined } from '@ant-design/icons';
import { AuButton } from '@aurora-ui-kit/core';
import SettingTestCase from '../CodingQuestion/SettingTestCase';
import SettingGeneral from '@/pages/CodingQuestion/SettingGeneral';
import { Modal } from 'antd';
import IconFont from '@/components/IconFont';

const tagList = [
  {
    key: 'General',
    label: 'General',
  },
  {
    key: 'Configuration',
    label: 'Configuration',
  },
  {
    key: 'Language',
    label: 'Language',
  },
  {
    key: 'TestCase',
    label: 'Test Case',
  },
];
export default function Coder() {
  const [activeKey, setActiveKey] = useState<string>('General');
  const history = useHistory();
  const [changeTips, setChangeTips] = useState<boolean>(false);
  //   const questionId = (params as any).questionId;
  //   const questionName = (params as any).questionName;
  const {
    query: { questionId, questionName },
  } = useLocation() as any;

  const onChangeTagCont = (flag: boolean) => {
    setChangeTips(flag);
  };
  const onChangeTag = (e) => {
    if (changeTips) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: <div>Unsaved changes will be discarded, would you like to continue?</div>,
        okText: 'Continue',
        cancelText: 'Cancel',
        okButtonProps: { style: { backgroundColor: '#FAD764', color: '#0E1E25' } },
        // cancelButtonProps: { style: { borderRadius: 3 } },
        onOk() {
          setActiveKey(e);
          setChangeTips(false);
        },
        icon: <WarningOutlined style={{ color: '#FFB121' }} />,
        width: 600,
        centered: true,
      });
    } else {
      setActiveKey(e);
      setChangeTips(false);
    }
  };
  useEffect(() => {}, []);
  return (
    <div className={styles.codePage}>
      <div className={styles.codePageTitle}>
        <PageBreadCrumb
          routes={[
            {
              href: '/coding',
              label: 'Coding Puzzles',
            },
            {
              href: `/coding/${questionId}`,
              label: questionName || 'questionName',
            },
            {
              label: 'Settings',
            },
          ]}
        />
        <div className={styles.TitleCont}>
          <span
            className={styles.backButton}
            onClick={() => {
              history.goBack();
            }}
          >
            <LeftOutlined />
            Back
          </span>
          <div className={styles.ViewCont}>
            <span className={styles.questionName}>{questionName || 'questionName'}</span>
            <AuButton
              variant="gray"
              shape="round"
              prefix={<IconFont type="icon-a-iconopen_in_new" />}
              onClick={() => window.open(`/problems/${questionId}/description`)}
              // href={`/problems/${questionId}/description`}
            >
              View in IDE
            </AuButton>
          </div>
        </div>
      </div>
      <TagList items={tagList} activeKey={activeKey} onChange={onChangeTag} />
      <div className={styles.coderShow}></div>
      {activeKey == 'General' && <SettingGeneral questionId={questionId} />}
      {activeKey == 'Configuration' && (
        <Configuration questionId={questionId} onChange={onChangeTagCont} />
      )}
      {activeKey == 'Language' && <Language questionId={questionId} onChange={onChangeTagCont} />}
      {activeKey == 'TestCase' && (
        <SettingTestCase
          questionId={questionId}
          gotoConfiguration={() => setActiveKey('Configuration')}
        />
      )}
    </div>
  );
}
