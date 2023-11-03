import { Button, message, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useMemo, useState } from 'react';
import styles from './OverallKpi.less';
import { ArrowDownOutlined } from '@ant-design/icons';
import AdjustRatioModal, { RatioType } from '../components/adjustRatioModal';
import { updateSummaryWeights } from '@/services/kpi';
import { useRequest } from 'ahooks';
import UpdateTaskWeightModal, {
  UpdateTaskWeightDataType,
} from '../components/updateTaskWeightModal';
import Empty from './Empty';
import { cloneDeep } from 'lodash';
import { roundingOff } from '@/utils';

const COLUMN_WIDTH = 80;

interface Props {
  kpiSummaryData: KPI.Summary;
  batchId: string;
  // reload?: () => void;
  setKpiSummaryData: (v: KPI.Summary) => void;
  isBatchTrainer: boolean;
  linkToDetail: (user: any) => void;
}
export default function OverallKpi({
  kpiSummaryData,
  batchId,
  setKpiSummaryData,
  isBatchTrainer,
  linkToDetail,
}: Props) {
  const [adjustRatioModalOpen, setAdjustRatioModalOpen] = useState(false);
  const [updateTaskWeightModalOpen, setUpdateTaskWeightModalOpen] = useState(false);
  const [updateTaskWeightModalData, setUpdateTaskWeightModalData] =
    useState<UpdateTaskWeightDataType>();
  const { loading: updateSummaryWeightsLoading, runAsync: updateSummaryWeightsFun } = useRequest(
    updateSummaryWeights,
    {
      manual: true,
    },
  );
  function formatScore(score: number) {
    if (score == 0) return <span className={styles.zero}>0.0</span>;
    return score ? roundingOff(score, 1) : <span className={styles.zero}>n/a</span>;
  }

  const columns = useMemo(() => {
    const { projects, mocks, assignments, weights } = kpiSummaryData;
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
        // ellipsis: { showTitle: true },
        fixed: 'left',
      },
      {
        dataIndex: 'total',
        title: ({ sortOrder }) => (
          <div className={[styles.taskHeader, styles.blueTextColumns].join(' ')}>
            <div className={styles.bold}>
              Total
              <ArrowDownOutlined
                rotate={sortOrder === 'descend' ? 0 : 180}
                className={styles.sortIcon}
              />
            </div>
            <div className={styles.light}>Weight</div>
          </div>
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
    projects?.forEach((item, index) => {
      _columns.push({
        dataIndex: `P${index + 1}`,
        title: (
          <div className={styles.taskHeader}>
            <div className={styles.bold}>P{index + 1}</div>
            <div
              className={[styles.light, styles.weight].join(' ')}
              onClick={() => {
                if (!isBatchTrainer) return;
                setUpdateTaskWeightModalOpen(true);
                setUpdateTaskWeightModalData({
                  batchId: batchId,
                  taskId: item.taskId,
                  type: item.type,
                  priority: item.priority,
                  weight: item.weight,
                  label: `P${index + 1}`,
                  totalWeight: projects.reduce((total, task) => total + (task.weight || 0), 0),
                });
              }}
            >
              {item.weight}
            </div>
          </div>
        ),
        render: (text: number) => formatScore(text),
        align: 'center',
        width: COLUMN_WIDTH,
      });
    });
    mocks?.forEach((item, index) => {
      _columns.push({
        dataIndex: `M${index + 1}`,
        title: (
          <div className={styles.taskHeader}>
            <div className={styles.bold}>M{index + 1}</div>
            <div
              className={[styles.light, styles.weight].join(' ')}
              onClick={() => {
                if (!isBatchTrainer) return;
                setUpdateTaskWeightModalOpen(true);
                setUpdateTaskWeightModalData({
                  batchId: batchId,
                  taskId: item.taskId,
                  type: item.type,
                  priority: item.priority,
                  weight: item.weight,
                  label: `M${index + 1}`,
                  totalWeight: mocks.reduce((total, task) => total + (task.weight || 0), 0),
                });
              }}
            >
              {item.weight}
            </div>
          </div>
        ),
        render: (text: number) => formatScore(text),
        align: 'center',
        className: styles.yellowColumns,
        width: COLUMN_WIDTH,
      });
    });
    if (assignments?.length)
      _columns.push({
        dataIndex: 'Asgmt',
        title: (
          <div className={styles.taskHeader}>
            <div className={styles.bold}>Asgmt</div>
            <div
              className={[styles.light, styles.weight].join(' ')}
              onClick={() => {
                if (!isBatchTrainer) return;
                setAdjustRatioModalOpen(true);
              }}
            >
              {weights?.[0] || 0}
            </div>
          </div>
        ),
        render: (text: number) => formatScore(text),
        align: 'center',
        className: styles.lightColumns,
        width: COLUMN_WIDTH,
      });
    _columns.push(
      {
        dataIndex: 'Comm',
        title: (
          <div className={styles.taskHeader}>
            <div className={styles.bold}>Comm</div>
            <div
              className={[styles.light, styles.weight].join(' ')}
              onClick={() => {
                if (!isBatchTrainer) return;
                setAdjustRatioModalOpen(true);
              }}
            >
              {weights?.[3] || 0}
            </div>
          </div>
        ),
        render: (text: number) => formatScore(text),
        align: 'center',
        className: styles.lightColumns,
        width: COLUMN_WIDTH,
      },
      {
        dataIndex: 'Behav',
        title: (
          <div className={styles.taskHeader}>
            <div className={styles.bold}>Behav</div>
            <div
              className={[styles.light, styles.weight].join(' ')}
              onClick={() => {
                if (!isBatchTrainer) return;
                setAdjustRatioModalOpen(true);
              }}
            >
              {weights?.[4] || 0}
            </div>
          </div>
        ),
        render: (text: number) => formatScore(text),
        align: 'center',
        className: styles.lightColumns,
        width: COLUMN_WIDTH,
      },
    );
    return _columns;
  }, [kpiSummaryData, batchId]);

  const dataSource = useMemo(() => {
    const { trainees, userRankings, projects, mocks, assignments, generalScores, weights } =
      kpiSummaryData;
    return userRankings?.map((row) => {
      const rowData: KPI.TableRow = {};

      let projectTotal = 0;
      let projectWeights = 0;
      projects.forEach((kpi, kpiIndex) => {
        const traineeScore = kpi.scores?.[row.userId];
        rowData[`P${kpiIndex + 1}`] = traineeScore;
        projectTotal += kpi.weight * traineeScore || 0;
        projectWeights += kpi.weight;
      });
      projectTotal = projectTotal / (projectWeights || 1);

      let mockTotal = 0;
      let mockWeights = 0;
      mocks.forEach((kpi, kpiIndex) => {
        const traineeScore = kpi.scores?.[row.userId];
        rowData[`M${kpiIndex + 1}`] = traineeScore;
        mockTotal += kpi.weight * traineeScore || 0;
        mockWeights += kpi.weight;
      });
      mockTotal = mockTotal / (mockWeights || 1);

      let asgmtTotal = 0;
      assignments.forEach((kpi) => {
        asgmtTotal += kpi.scores?.[row.userId] || 0;
      });
      asgmtTotal /= assignments?.length || 1;

      rowData.key = row.ranking;
      // rowData.rank = row.ranking;
      const trainee = trainees.find((i) => i.userId === row.userId);
      // rowData.name = `${trainee?.firstName} ${trainee?.lastName}`;
      rowData.firstName = trainee?.firstName;
      rowData.lastName = trainee?.lastName;
      rowData.preferredName = trainee?.preferredName;
      rowData.userId = row.userId;
      // rowData.total = row.overallKpi;
      rowData.Asgmt = asgmtTotal;
      rowData.Comm = generalScores?.[row.userId]?.communicationScore || 0;
      rowData.Behav = generalScores?.[row.userId]?.behavioralScore || 0;
      rowData.total =
        projectTotal * weights?.[2] +
        mockTotal * weights?.[1] +
        asgmtTotal * weights?.[0] +
        rowData.Comm * weights?.[3] +
        rowData.Behav * weights?.[4];
      return rowData;
    });
  }, [kpiSummaryData]);

  const RatioesData: RatioType[] = useMemo(() => {
    const { weights } = kpiSummaryData;
    const res: RatioType[] = [
      { id: 'Project', label: 'Project', value: weights?.[2] },
      { id: 'Mock', label: 'Mock', value: weights?.[1] },
      { id: 'Assignment', label: 'Assignment', value: weights?.[0] },
      { id: 'Behavior', label: 'Behavior', value: weights?.[4] },
      { id: 'Communication', label: 'Communication', value: weights?.[3] },
    ];
    return res;
  }, [kpiSummaryData]);

  function updateWeights(data: Record<string, number>) {
    const formatedDate = [
      data.Assignment,
      data.Mock,
      data.Project,
      data.Communication,
      data.Behavior,
    ];
    updateSummaryWeightsFun({ batchId, weights: formatedDate })
      .then(() => {
        setAdjustRatioModalOpen(false);
        // reload?.();
        const kpis = cloneDeep(kpiSummaryData);
        kpis.weights = formatedDate;
        setKpiSummaryData(kpis);
      })
      .catch(() => message.error('Failed to update score ratio.'));
  }

  function updateTaskWeight(weight: number) {
    const kpis = cloneDeep(kpiSummaryData);
    let tasks = kpis.projects;
    if (updateTaskWeightModalData?.type === 'mock') {
      tasks = kpis.mocks;
    }
    tasks.some((item) => {
      if (
        item.taskId === updateTaskWeightModalData!.taskId &&
        item.priority === updateTaskWeightModalData!.priority
      ) {
        item.weight = weight;
        return true;
      } else return false;
    });
    setKpiSummaryData(kpis);
  }

  const renderContent = (
    <>
      <div className={styles.ratio}>
        <Button
          className={styles.adjustButton}
          onClick={() => setAdjustRatioModalOpen(true)}
          type="text"
          disabled={!isBatchTrainer}
        >
          Adjust Table Ratio
        </Button>
        <div>Current Ratio:</div>
        <div className={[styles.tag, styles.Project].join(' ')}>
          {'Project '} <span>{kpiSummaryData?.weights?.[2] || 0}</span>
        </div>
        <div className={[styles.tag, styles.Mock].join(' ')}>
          {'Mock '} <span>{kpiSummaryData?.weights?.[1] || 0}</span>
        </div>
        <div className={[styles.tag, styles.Assignment].join(' ')}>
          {'Assignment '} <span>{kpiSummaryData?.weights?.[0] || 0}</span>
        </div>
        <div className={[styles.tag, styles.Behavior].join(' ')}>
          {'Behavior '} <span>{kpiSummaryData?.weights?.[4] || 0}</span>
        </div>
        <div className={[styles.tag, styles.Communication].join(' ')}>
          {'Communication '} <span>{kpiSummaryData?.weights?.[3] || 0}</span>
        </div>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        className={styles.tableWrap}
        rowClassName={styles.row}
        pagination={false}
        scroll={{ y: 'calc(100vh - 350px)', x: '100%' }}
      />
    </>
  );

  return (
    <div className={styles.overallKpiWrap}>
      {!!dataSource?.length ? renderContent : <Empty />}
      <AdjustRatioModal
        open={adjustRatioModalOpen}
        onCancel={() => setAdjustRatioModalOpen(false)}
        RatioesData={RatioesData}
        onSave={updateWeights}
        loading={updateSummaryWeightsLoading}
      />
      <UpdateTaskWeightModal
        open={updateTaskWeightModalOpen}
        onCancel={() => setUpdateTaskWeightModalOpen(false)}
        data={updateTaskWeightModalData}
        onSave={updateTaskWeight}
      />
    </div>
  );
}
