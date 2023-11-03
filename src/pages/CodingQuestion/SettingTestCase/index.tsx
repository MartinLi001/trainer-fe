import SeeButton from '@/components/SeeButton';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import EditTestCaseModal from './EditTestCaseModal';
import {
  deleteTestCase,
  getQuestionTestCaseList,
  getQuestionTestCaseParser,
} from '@/services/coding';
import { Dropdown, Menu, Pagination, Spin } from 'antd';
import { useRequest } from 'ahooks';
import type { TestCaseListType } from '../typeList';
import moment from 'moment';
import { AuButton, AuTable } from '@aurora-ui-kit/core';
import { MoreOutlined } from '@ant-design/icons';
import IconFont from '@/components/IconFont';

interface SettingTestCaseI {
  questionId: string;
  gotoConfiguration: () => void;
}
export default function SettingTestCase({ questionId, gotoConfiguration }: SettingTestCaseI) {
  const [testCaseModalOpen, setTestCaseModalOpen] = useState(false);
  const [focusCase, setFocusCase] = useState<Partial<TestCaseListType>>();

  const { data: parser, loading: getParserLoading } = useRequest(getQuestionTestCaseParser, {
    refreshDeps: [questionId],
    defaultParams: [questionId],
  });

  const {
    data: testCases,
    run: getList,
    refresh: refreshList,
    loading: getListLoading,
  } = useRequest(getQuestionTestCaseList, {
    defaultParams: [
      {
        questionId: questionId,
        pageSize: 10,
        page: 1,
      },
    ],
    refreshDeps: [questionId],
  });

  const { run: onDelete, loading: deleteTestCaseLoading } = useRequest(
    (id) => deleteTestCase({ questionId, id }),
    {
      manual: true,
      onSuccess: refreshList,
    },
  );

  const actionMenu = (item: TestCaseListType) => {
    const menuItems = [
      {
        label: (
          <a
            onClick={() => {
              setTestCaseModalOpen(true);
              setFocusCase(item);
            }}
          >
            <IconFont type="icon-edit-line" /> edit
          </a>
        ),
        key: 'edit',
      },
      {
        label: (
          <a
            onClick={() => {
              onDelete(item.id);
            }}
          >
            <IconFont type="icon-delete-bin-line" /> delete
          </a>
        ),
        key: 'delete',
      },
    ];
    return <Menu items={menuItems} />;
  };

  const columns = [
    {
      title: 'Case ID',
      name: 'id',
      key: 'id',
      bold: true,
    },
    {
      title: 'Creator',
      name: 'createUsername',
      key: 'createUsername',
    },
    {
      title: 'Created On',
      name: 'createTime',
      key: 'createTime',
      // format: 'hh:mm:ss MM/DD/YYYY',
      render: (_: any, { createTime }: TestCaseListType) =>
        moment(createTime).format('hh:mm:ss MM/DD/YYYY'),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: TestCaseListType) => (
        <Dropdown overlay={actionMenu(record)} trigger={['click']} placement="bottomRight">
          <span style={{ marginLeft: 20 }} onClick={(e) => e.preventDefault()}>
            <MoreOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
          </span>
        </Dropdown>
      ),
    },
  ];

  function renderTable() {
    return (
      <>
        <AuTable
          dataSource={testCases?.list || []}
          displayColumns={columns}
          loading={getListLoading || deleteTestCaseLoading}
          pagination={false}
        />
        {!!testCases?.total && (
          <Pagination
            className={styles.pagination}
            showSizeChanger
            onChange={(page: number, pageSize: number) => {
              getList({
                questionId,
                page,
                pageSize,
              });
            }}
            current={testCases?.page ?? 1}
            pageSize={testCases?.pageSize ?? 10}
            total={testCases?.total ?? 0}
          />
        )}
      </>
    );
  }

  function renderEmptyPage() {
    if (getParserLoading) return <div />;
    return (
      <div className={styles.emptyPage}>
        <IconFont type="icon-a-Iconscode_off" className={styles.icon} />
        <div className={styles.title}>Test Case Parser Unavailable</div>
        <div className={styles.description}>
          Test Case Parser is unavailable, please configure the parser before creating test cases.
        </div>
        <AuButton type="link" onClick={gotoConfiguration}>
          Go to Test Case Parser
        </AuButton>
      </div>
    );
  }

  function renderContent() {
    if ((parser as unknown as any[])?.length) {
      return renderTable();
    } else {
      return renderEmptyPage();
    }
  }

  return (
    <div className={styles.wrapper}>
      <AuButton
        className={styles.createButton}
        onClick={() => {
          setTestCaseModalOpen(true);
          setFocusCase({});
        }}
        disabled={!(parser as unknown as any[])?.length}
        // loading={getParserLoading}
      >
        + Create
      </AuButton>

      <Spin spinning={getParserLoading}>{renderContent()}</Spin>

      <EditTestCaseModal
        open={testCaseModalOpen}
        onCancel={() => setTestCaseModalOpen(false)}
        questionId={questionId}
        parser={parser}
        testCase={focusCase}
        afterOk={refreshList}
      />
    </div>
  );
}
