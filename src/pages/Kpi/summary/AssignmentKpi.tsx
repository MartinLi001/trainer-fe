import { ArrowDownOutlined } from '@ant-design/icons';
import { Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { useMemo } from 'react';
import styles from './OverallKpi.less';
// import styles from './AssignmentKpi.less';
import Empty from './Empty';
import { roundingOff } from '@/utils';

const COLUMN_WIDTH = 80;
interface Props {
  kpiAssignmentData: KPI.Task[];
  trainees: KPI.Trainee[];
  batchId?: string;
  linkToDetail: (user: any) => void;
}

export default function AssignmentKpi({
  kpiAssignmentData,
  trainees,
  // batchId,
  linkToDetail,
}: Props) {
  function formatScore(score: number) {
    if (score == 0) return <span className={styles.zero}>0.0</span>;
    return score ? roundingOff(score, 1) : <span className={styles.zero}>n/a</span>;
  }

  const columns = useMemo(() => {
    const _columns: ColumnsType<KPI.TableRow> = [
      {
        dataIndex: 'rank',
        title: 'Rank',
        render: (text, record, index) => index + 1,
        className: styles.blueTextColumns,
        width: COLUMN_WIDTH,
        fixed: 'left',
      },
      {
        dataIndex: 'name',
        title: 'Name',
        render: (text, record) => (
          <Tooltip mouseEnterDelay={0.5} title={`${record?.firstName} ${record?.lastName}`}>
            <div className={styles.name} onClick={() => linkToDetail(record)}>
              {`${record?.preferredName || record?.firstName} ${record?.lastName}`}
            </div>
          </Tooltip>
        ),
        width: COLUMN_WIDTH * 2,
        fixed: 'left',
      },
      {
        dataIndex: 'total',
        title: ({ sortOrder }) => (
          <span>
            Total
            <ArrowDownOutlined
              rotate={sortOrder === 'descend' ? 0 : 180}
              className={styles.sortIcon}
            />
          </span>
        ),
        render: (text: number) => formatScore(text),
        className: styles.blueTextColumns,
        align: 'center',
        width: COLUMN_WIDTH,
        sorter: (a, b) => (a.total || 0) - (b.total || 0),
        defaultSortOrder: 'descend',
        sortDirections: ['ascend', 'descend', 'ascend'],
        showSorterTooltip: false,
      },
    ];
    kpiAssignmentData?.forEach((item, index) => {
      _columns.push({
        dataIndex: `A${index + 1}`,
        title: `A${index + 1}`,
        render: (text: number) => formatScore(text),
        align: 'center',
        width: COLUMN_WIDTH,
      });
    });
    return _columns;
  }, [kpiAssignmentData]);

  const dataSource = useMemo(() => {
    return trainees.map((row, rowIndex) => {
      const rowData: KPI.TableRow = {};
      kpiAssignmentData?.forEach((kpi, kpiIndex) => {
        rowData[`A${kpiIndex + 1}`] = kpi.scores?.[row.userId];
      });
      let total = 0;
      for (const [, value] of Object.entries(rowData)) {
        if (!!value) total += value;
      }
      rowData.key = rowIndex + 1;
      // rowData.name = `${row.firstName} ${row.lastName}`;
      rowData.firstName = row?.firstName;
      rowData.lastName = row?.lastName;
      rowData.preferredName = row?.preferredName;
      rowData.total = total / (~~kpiAssignmentData?.length || 1);
      rowData.userId = row.userId;
      return rowData;
    });
  }, [trainees, kpiAssignmentData]);

  return (
    <div className={styles.overallKpiWrap}>
      {!!dataSource?.length ? (
        <Table
          dataSource={dataSource}
          columns={columns}
          className={styles.tableWrap}
          rowClassName={styles.row}
          pagination={false}
          scroll={{ y: 'calc(100vh - 250px)', x: '100%' }}
        />
      ) : (
        <Empty />
      )}
    </div>
  );
}
