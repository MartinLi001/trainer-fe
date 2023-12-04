import { BatchState, connect, ConnectProps, useModel, useParams } from 'umi';
import { Col, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import { getKpiDetail } from '@/services/kpi';

import DetailShow from './componts/detailShow';
import Feedback from './componts/Feedback';
import MockTrend from './components/Trend';
import Stats from './components/Stats';
import StatsModal from './components/StatsModal';

import { KpiType } from './typeList';

import { putKpiScore } from '@/services/kpi';

import styles from './index.less';
import PageHeader from '@/components/PageHeader';

interface KpiProps extends ConnectProps {
  batchData: API.AllBatchType;
}

function Kpi({ batchData }: KpiProps) {
  const { initialState } = useModel('@@initialState');
  const { batchId, traineeId } = useParams<any>();
  const [data, setData] = useState<KpiType>({} as KpiType);
  const [xAxisData, setXAxisData] = useState<number[]>();
  const [seriesData, setSeriesData] = useState<number[]>([]);
  const [openStatsModal, setOpenStatsModal] = useState<boolean>(false);

  const getData = () => {
    getKpiDetail(batchId, traineeId)
      .then((res) => {
        setData(res);
        setSeriesData([...res.mockScores]);
        setXAxisData(new Array(res.mockScores.length).fill('').map((item, index) => index + 1));
      })
      .catch(() => {
        setSeriesData([0, 0, 0, 0, 0]);
        setXAxisData([1, 2, 3, 4, 5]);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const { runAsync: updateUserScore, loading: updateUserScoreLoading } = useRequest(putKpiScore, {
    manual: true,
    onSuccess(_, [{ behavioralScore, communicationScore }]) {
      message.success('Edited score successfully');
      setData({
        ...data,
        behavioralScore,
        communicationScore,
      });
      setOpenStatsModal(false);
      setTimeout(() => {
        getData();
      }, 1000);
    },
    onError() {
      message.error('Failed to edit score');
    },
  });

  const trainerHasPromise = batchData.trainers?.some(
    (trainer: any) => trainer.userId === initialState?.userId,
  );

  return (
    <>
      <div style={{ margin: '10px 0' }}>
        <PageHeader
          items={[
            ...JSON.parse(localStorage.getItem('pageHeaderItems') ?? '[]'),
            {
              name: data.fullName,
            },
          ]}
        />
      </div>
      <div className={styles.pageContainer}>
        <div>
          <Row gutter={32} wrap={false}>
            <Col flex="auto">
              <MockTrend xAxisData={xAxisData} seriesData={seriesData} />
            </Col>
            <Col flex="322px">
              <Stats
                {...data}
                trainerHasPromise={trainerHasPromise}
                onEdit={() => setOpenStatsModal(true)}
              />
            </Col>
          </Row>
        </div>
        <div>
          <DetailShow
            batchId={batchId}
            traineeId={traineeId}
            type={'Project'}
            list={data?.projects}
          />
        </div>
        <div>
          <DetailShow batchId={batchId} traineeId={traineeId} type={'Mock'} list={data?.mocks} />
        </div>
        <div>
          <Feedback
            list={data.feedbacks}
            batchId={batchId}
            traineeId={traineeId}
            getData={getData}
          />
        </div>
      </div>

      <StatsModal
        open={openStatsModal}
        data={data}
        onCancel={() => setOpenStatsModal(false)}
        loading={updateUserScoreLoading}
        onSave={(values) =>
          updateUserScore({
            ...values,
            batchId,
            traineeId,
          })
        }
      />
    </>
  );
}

export default connect(({ Batch }: { Batch: BatchState }) => ({
  batchData: Batch.data,
}))(Kpi);
