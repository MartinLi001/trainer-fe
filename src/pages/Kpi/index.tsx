import { getKpiSummary } from '@/services/kpi';
import { useRequest } from 'ahooks';
import { Modal, Spin, Tabs } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useModel, useSelector } from 'umi';
import styles from './index.less';
import AssignmentKpi from './summary/AssignmentKpi';
import MockKpi from './summary/MockKpi';
import OverallKpi from './summary/OverallKpi';
import { history } from 'umi';
import { WarningFilled } from '@ant-design/icons';

interface Props {
  batchId: string;
  setTipsType: (v: any) => void;
}
export default function Kpi(props: Props) {
  const { initialState } = useModel('@@initialState');
  const { batchId, setTipsType } = props;
  const [activeKey, setActiveKey] = useState('Overall');
  const [kpiSummaryData, setKpiSummaryData] = useState<KPI.Summary>({
    batchId: '',
    weights: [],
    trainees: [],
    assignments: [],
    projects: [],
    mocks: [],
    generalScores: {},
    userRankings: [],
  });
  const { loading: getKpiSummaryLoading, runAsync: getKpiSummaryFun } = useRequest(getKpiSummary, {
    manual: true,
  });
  const { Batch } = useSelector((state) => state) as any;
  const isBatchTrainer = useMemo(
    () => !!Batch?.data?.trainers?.some((i: any) => i.userId === initialState?.userId),
    [Batch],
  );
  const { pathname } = useLocation();
  const isMybatch = pathname.startsWith('/myBatch');

  const linkToDetail = useCallback(
    (user: KPI.TableRow) => {
      if (Batch?.data?.trainees?.some((i: any) => i.userId === user.userId)) {
        history.push(
          `/${isMybatch ? 'myBatch' : 'Category/Batches'}/kpi/${batchId}/${user.userId}`,
        );
      } else {
        Modal.warning({
          getContainer: document.getElementById(styles.KpiLayout) as HTMLElement,
          title: `${user?.preferredName || user?.firstName} ${user?.lastName} has been removed`,
          content: (
            <span>
              {`${user?.firstName} ${user?.lastName}`}
              {user?.preferredName && `(${user.preferredName}) `}
              has been removed from this batch. If this is not an expected behavior, please contact
              the batch trainers.
            </span>
          ),
          icon: <WarningFilled />,
          okText: 'Close',
          okButtonProps: { className: styles.confirmModalButton },
          // centered: true,
          maskClosable: true,
          width: 600,
        });
      }
    },
    [Batch, isMybatch, batchId],
  );

  const init = useCallback(() => {
    // 切换到非mock类tabs界面时重新请求数据
    if (!batchId || activeKey.includes('M')) return;
    getKpiSummaryFun(batchId).then((res: KPI.Summary) => {
      setKpiSummaryData(res);
    });
  }, [batchId, getKpiSummaryFun, activeKey]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    setActiveKey('Overall');
  }, [batchId]);

  function onTabsChange(value: string) {
    setActiveKey(value);
    setTipsType(value.includes('M') ? 'mock' : 'overall');
  }

  const tabItems = useMemo(() => {
    const { mocks, assignments, trainees } = kpiSummaryData;
    const _tabItems = [
      {
        key: 'Overall',
        label: 'Overall',
        children: (
          <OverallKpi
            kpiSummaryData={kpiSummaryData}
            batchId={batchId}
            setKpiSummaryData={setKpiSummaryData}
            isBatchTrainer={isBatchTrainer}
            linkToDetail={linkToDetail}
          />
        ),
      },
    ];
    mocks?.forEach((item, index) => {
      _tabItems.push({
        key: `M${index + 1}`,
        label: `M${index + 1}`,
        children: (
          <MockKpi
            batchId={batchId}
            priority={item.priority}
            isBatchTrainer={isBatchTrainer}
            linkToDetail={linkToDetail}
          />
        ),
      });
    });
    if (assignments?.length) {
      _tabItems.push({
        key: 'Assignment',
        label: 'Assignment',
        children: (
          <AssignmentKpi
            kpiAssignmentData={assignments}
            trainees={trainees}
            batchId={batchId}
            linkToDetail={linkToDetail}
          />
        ),
      });
    }
    return _tabItems;
  }, [kpiSummaryData, batchId, init, isBatchTrainer, linkToDetail]);

  return (
    <div className={styles.KpiLayout} id={styles.KpiLayout}>
      <Spin spinning={getKpiSummaryLoading}>
        <Tabs
          items={tabItems}
          activeKey={activeKey}
          onChange={onTabsChange}
          destroyInactiveTabPane
          animated={true}
          tabBarGutter={24}
          className={styles.tabsWrap}
        />
      </Spin>
    </div>
  );
}
