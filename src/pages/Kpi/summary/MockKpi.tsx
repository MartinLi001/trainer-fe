import { getKpiMockSummary, updateMocksWeights } from '@/services/kpi';
import { ArrowDownOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, message, Spin, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { cloneDeep, isNumber } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdjustRatioModal, { RatioType } from '../components/adjustRatioModal';
import UpdateMockOverallModal, { UpdateOverallType } from '../components/updateMockOverallModal';
import styles from './OverallKpi.less';
import Empty from './Empty';
import { roundingOff } from '@/utils';

const COLUMN_WIDTH = 80;

interface Props {
  batchId: string;
  priority: number;
  // kpiSummaryData?: KPI.Summary;
  // reloadOverall?: () => void;
  isBatchTrainer: boolean;
  linkToDetail: (user: any) => void;
}
export default function MockKpi({ batchId, priority, isBatchTrainer, linkToDetail }: Props) {
  const [adjustRatioModalOpen, setAdjustRatioModalOpen] = useState(false);
  const [updateOverallModalOpen, setUpdateOverallModalOpen] = useState(false);
  const [updateOverallModalData, setUpdateOverallModalData] = useState<UpdateOverallType>();
  const { loading: getKpiMockSummaryLoading, runAsync: getKpiMockSummaryFun } = useRequest(
    getKpiMockSummary,
    {
      manual: true,
    },
  );
  const { loading: updateMocksWeightsLoading, runAsync: updateMocksWeightsFun } = useRequest(
    updateMocksWeights,
    {
      manual: true,
    },
  );
  const [kpiMockData, setKpiMockData] = useState<KPI.MockSummary>({
    batchId: '',
    priority: 0,
    shortAnswerMocks: [],
    codingMocks: [],
    trainees: [],
    total: {},
  });
  const init = useCallback(() => {
    getKpiMockSummaryFun(batchId, priority).then((res) => {
      setKpiMockData(res);
    });
  }, [getKpiMockSummaryFun, batchId, priority]);

  useEffect(() => {
    init();
  }, []);
  function formatScore(scoreDetail: number | KPI.ScoreDetail) {
    let score = 0;
    let bonusText = '';
    if (isNumber(scoreDetail)) {
      score = scoreDetail;
    } else {
      score = scoreDetail?.score;
      bonusText = scoreDetail?.isBonus ? '+' : '';
    }
    if (score == 0) {
      return <span className={styles.zero}>{bonusText}0.0</span>;
    } else {
      return score ? (
        <span className={bonusText ? styles.bonus : ''}>
          {bonusText}
          {roundingOff(score, 1)}
        </span>
      ) : (
        <span className={styles.zero}>n/a</span>
      );
    }
  }

  const columns = useMemo(() => {
    const { shortAnswerMocks, codingMocks } = kpiMockData;
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
    const _questionMemory: ColumnsType<KPI.TableRow> = [];
    codingMocks?.forEach((task, indexT) => {
      task.questions.forEach((_, indexQ) => {
        _questionMemory.push({
          dataIndex: `C${indexT + 1}_${indexQ + 1}`,
          title: `C${indexQ + 1}`,
          render: (text: number) => formatScore(text),
          // className: indexT % 2 ? styles.yellowColumns : undefined,
          align: 'center',
          width: COLUMN_WIDTH,
        });
      });
      _columns.push({
        dataIndex: `Code${indexT + 1}`,
        title: `Code${codingMocks.length > 1 ? indexT + 1 : ''}`,
        render: (text, record) => (
          <div
            className={styles.mockSummaryScore}
            onClick={() => {
              if (!isBatchTrainer) return;
              setUpdateOverallModalOpen(true);
              setUpdateOverallModalData({
                batchId: batchId,
                priority: priority,
                taskId: task.taskId,
                traineeId: record.userId || '',
                name: `${record?.firstName} ${record?.lastName}`,
                overall: text,
                type: `Coding Mock${codingMocks.length > 1 ? indexT + 1 : ''}`,
              });
            }}
          >
            {formatScore(text)}
          </div>
        ),
        className: styles.greenTextColumns,
        align: 'center',
        width: COLUMN_WIDTH,
      });
    });
    shortAnswerMocks?.forEach((task, indexT) => {
      task.questions?.forEach((_, indexQ) => {
        _questionMemory.push({
          dataIndex: `S${indexT + 1}_${indexQ + 1}`,
          title: `S${indexQ + 1}`,
          render: (text: number) => formatScore(text),
          className: styles.yellowColumns,
          // className: (indexT + ~~codingMocks?.length) % 2 ? styles.yellowColumns : undefined,
          align: 'center',
          width: COLUMN_WIDTH,
        });
      });
      _columns.push({
        dataIndex: `SA${indexT + 1}`,
        title: `SA${shortAnswerMocks.length > 1 ? indexT + 1 : ''}`,
        render: (text, record) => (
          <div
            className={styles.mockSummaryScore}
            onClick={() => {
              if (!isBatchTrainer) return;
              setUpdateOverallModalOpen(true);
              setUpdateOverallModalData({
                batchId: batchId,
                priority: priority,
                taskId: task.taskId,
                traineeId: record.userId || '',
                name: `${record?.firstName} ${record?.lastName}`,
                overall: text,
                type: `Short Answer${shortAnswerMocks.length > 1 ? indexT + 1 : ''}`,
              });
            }}
          >
            {formatScore(text)}
          </div>
        ),
        className: styles.greenTextColumns,
        align: 'center',
        width: COLUMN_WIDTH,
      });
    });
    return _columns.concat(_questionMemory);
  }, [kpiMockData]);

  const dataSource = useMemo(() => {
    // const { trainees, userRankings } = kpiSummaryData;
    const { trainees, codingMocks, shortAnswerMocks } = kpiMockData;
    return trainees.map((row, rowIndex) => {
      const rowData: KPI.TableRow = {};
      let total = 0;
      codingMocks.forEach((kpi, kpiIndex) => {
        const traineeOverall = kpi.overall?.[row.userId] || 0;
        rowData[`Code${kpiIndex + 1}`] = traineeOverall;
        total += traineeOverall * kpi.weight;
        kpi.questions.forEach((qId, qIndex) => {
          rowData[`C${kpiIndex + 1}_${qIndex + 1}`] = kpi.traineeScores?.[qId]?.[row.userId];
        });
      });
      shortAnswerMocks.forEach((kpi, kpiIndex) => {
        const traineeOverall = kpi.overall?.[row.userId] || 0;
        rowData[`SA${kpiIndex + 1}`] = traineeOverall;
        total += traineeOverall * kpi.weight;
        kpi.questions.forEach((qId, qIndex) => {
          rowData[`S${kpiIndex + 1}_${qIndex + 1}`] = kpi.traineeScores?.[qId]?.[row.userId];
        });
      });
      rowData.key = rowIndex + 1;
      // const trainee = trainees.find((i) => i.userId === row.userId);
      // rowData.name = `${row?.firstName} ${row?.lastName}`;
      rowData.firstName = row?.firstName;
      rowData.lastName = row?.lastName;
      rowData.preferredName = row?.preferredName;
      rowData.userId = row.userId;
      // rowData.total = total[row?.userId || ''] || 0;
      rowData.total = total;
      return rowData;
    });
  }, [kpiMockData]);

  const RatioesData: RatioType[] = useMemo(() => {
    const { codingMocks, shortAnswerMocks } = kpiMockData;
    const res: RatioType[] = [];
    shortAnswerMocks.forEach((item, index) => {
      res.push({ id: item.taskId, label: `Short Answer${index + 1}`, value: item.weight });
    });
    codingMocks.forEach((item, index) => {
      res.push({ id: item.taskId, label: `Coding Mock${index + 1}`, value: item.weight });
    });
    return res;
  }, [kpiMockData]);

  function updateWeights(data: Record<string, number>) {
    const mocks = cloneDeep(kpiMockData);
    const { codingMocks, shortAnswerMocks } = mocks;
    const res: KPI.TaskWeight[] = [];
    codingMocks.forEach((item) => {
      item.weight = data[item.taskId];
      res.push({ taskId: item.taskId, type: 'code', weight: data[item.taskId] });
    });
    shortAnswerMocks.forEach((item) => {
      item.weight = data[item.taskId];
      res.push({ taskId: item.taskId, type: 'short', weight: data[item.taskId] });
    });

    updateMocksWeightsFun({
      batchId,
      priority,
      taskWeights: res,
    })
      .then(() => {
        setAdjustRatioModalOpen(false);
        message.success('Updated score ratio successfully.');
        // init();
        // reloadOverall?.();
        setKpiMockData(mocks);
      })
      .catch(() => message.error('Failed to update score ratio.'));
  }

  function updateOverall(overall: number) {
    const mocks = cloneDeep(kpiMockData);
    const { codingMocks, shortAnswerMocks } = mocks;
    let tasks = codingMocks;
    if (updateOverallModalData!.type?.indexOf('Short') > -1) {
      tasks = shortAnswerMocks;
    }
    tasks.forEach((task) => {
      if (task.taskId === updateOverallModalData!.taskId) {
        task.overall[updateOverallModalData!.traineeId] = overall;
      }
    });
    setKpiMockData(mocks);
  }

  const { codingMocks, shortAnswerMocks } = kpiMockData;

  const renderContent = (
    <>
      <div className={styles.ratio}>
        <Button
          className={styles.adjustButton}
          onClick={() => setAdjustRatioModalOpen(true)}
          type="text"
          disabled={!isBatchTrainer}
        >
          Adjust Score Ratio
        </Button>
        <div>Current Ratio:</div>
        {codingMocks.map((item, index) => (
          <div className={[styles.tag, styles.Project].join(' ')} key={item.taskId + 'ratio'}>
            {`Coding${codingMocks?.length > 0 ? index + 1 : ''} `} <span>{item.weight || 0}</span>
          </div>
        ))}
        {shortAnswerMocks.map((item, index) => (
          <div className={[styles.tag, styles.Mock].join(' ')} key={item.taskId + 'ratio'}>
            {`Short Answer${shortAnswerMocks?.length > 0 ? index + 1 : ''} `}
            <span>{item.weight || 0}</span>
          </div>
        ))}
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        loading={getKpiMockSummaryLoading}
        className={styles.tableWrap}
        rowClassName={styles.row}
        pagination={false}
        scroll={{ y: 'calc(100vh - 350px)', x: '100%' }}
      />
    </>
  );

  return (
    <Spin spinning={getKpiMockSummaryLoading}>
      <div className={styles.overallKpiWrap}>
        {!!dataSource?.length ? renderContent : <Empty />}
        <AdjustRatioModal
          open={adjustRatioModalOpen}
          onCancel={() => setAdjustRatioModalOpen(false)}
          RatioesData={RatioesData}
          onSave={updateWeights}
          loading={updateMocksWeightsLoading}
        />
        <UpdateMockOverallModal
          open={updateOverallModalOpen}
          onCancel={() => setUpdateOverallModalOpen(false)}
          data={updateOverallModalData}
          // onSave={(value) => {
          //   init();
          //   reloadOverall?.();
          // }}
          onSave={updateOverall}
        />
      </div>
    </Spin>
  );
}
