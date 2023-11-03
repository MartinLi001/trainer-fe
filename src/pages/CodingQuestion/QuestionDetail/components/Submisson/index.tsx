import { useEffect, useState } from 'react';
import { AuTag, AuTable } from '@aurora-ui-kit/core';
import moment from 'moment';
import { useParams } from 'umi';
import { Pagination } from 'antd';
import styles from './index.less';
interface DataType {
  key: string;
  name: string;
  email: string;
  source: string;
  batchName: string;
  language: string;
  status: number;
  runTime: number;
  memory: string;
  submittedAt: number;
  submissionId: string;
}

export default function Submission({
  data,
  loading,
  fetch,
  onRowClick,
}: {
  fetch: any;
  data: any;
  loading: boolean;
  onRowClick: (id: string) => void;
}) {
  const { id: questionId } = useParams<{ id: string }>();

  const [source, setSource] = useState(['all']);

  const columns: any = [
    {
      title: 'Name',
      name: 'submitterName',
      type: 'text',
      bold: true,
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Email',
      name: 'email',
      ellipsis: true,
      width: 160,
      responsive: ['xl'],
      render: (value: string) => {
        return value ?? 'N/A';
      },
    },
    {
      title: 'Source',
      name: 'source',
      width: 130,
      responsive: ['lg'],
      render: (value: string) => {
        return value ?? 'N/A';
      },
    },
    {
      title: 'Batch',
      name: 'batch',
      width: 150,
      ellipsis: true,
      responsive: ['lg'],
      render: (value: string) => {
        return value ? value : 'N/A';
      },
    },
    {
      title: 'Language',
      name: 'language',
      type: 'text',
      width: 100,
    },
    {
      title: 'Result',
      name: 'statusCode',
      width: 150,
      render: (value: string) => {
        const Status = {
          '100': (
            <AuTag type="contained" theme="green">
              Passed
            </AuTag>
          ),
          '110': (
            <AuTag type="contained" theme="yellow">
              Rejected
            </AuTag>
          ),
          '120': (
            <AuTag type="contained" theme="red">
              Complier Error
            </AuTag>
          ),
          '130': (
            <AuTag type="contained" theme="red">
              Runtime Error
            </AuTag>
          ),
        };
        return Status[value];
      },
    },
    {
      title: 'Runtime',
      name: 'runTime',
      width: 90,
      render: (value: string) => {
        return value ? `${value}MS` : 'N/A';
      },
    },
    {
      title: 'Memory',
      name: 'memory',
      width: 90,
      render: (value: string) => {
        return value ? `${value}MB` : 'N/A';
      },
    },
    {
      title: 'Date',
      name: 'submittedAt',
      responsive: ['xl'],
      ellipsis: true,
      render: (value: string) => {
        return moment(value).format('HH:mm:ss YYYY-MM-DD');
      },
    },
  ];

  const config = {
    rowClickable: true,
    rowHoverable: true,
    complex: true,
    pagination: false,
    onRow: ({ submissionId }: any) => {
      return {
        onClick: () => {
          onRowClick(submissionId);
        },
      };
    },
  };

  useEffect(() => {
    fetch({
      page: 1,
      pageSize: 10,
    });
  }, []);

  return (
    <>
      <div className={styles.radio}>
        <span className={styles.label}>Submission Source</span>
        <AuTag.Group
          size="large"
          value={source}
          onChange={(value: string[]) => {
            setSource(value);
            fetch({
              source: value[0] === 'all' ? undefined : +value[0],
              page: 1,
              pageSize: data?.pageSize ?? 10,
            });
          }}
          actionType="checkable"
          shape="round"
          style={{ display: 'flex', gap: 12 }}
          items={[
            { id: 'all', value: 'All' },
            { id: '0', value: 'mock' },
            { id: '1', value: 'task' },
            { id: '2', value: 'Coding Puzzles' },
          ]}
        />
      </div>
      <div>
        {/* @ts-ignore */}
        <AuTable
          displayColumns={columns}
          dataSource={data?.list ?? []}
          {...config}
          loading={loading}
        />

        <div style={{ display: 'flex', justifyContent: 'center', margin: 20 }}>
          {data?.total > 0 && (
            <Pagination
              current={data?.page ?? 0}
              total={data?.total ?? 0}
              onChange={(page: number, pageSize: number) => {
                fetch({
                  questionId,
                  source: source[0] === 'all' ? undefined : +source[0],
                  page,
                  pageSize,
                });
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
