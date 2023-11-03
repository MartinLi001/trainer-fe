import * as echarts from 'echarts';
import Echarts from '@/components/Charts';
import CardTitle from '@/components/CardTitle';
import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import styles from './index.less';
import { RiseOutlined } from '@ant-design/icons';
import Empty from '@/components/KpiEmpty';
interface LineChartProps {
  xAxisData?: number[];
  seriesData: number[];
}

export default function Trend({ xAxisData = [1, 2, 3, 4, 5], seriesData }: LineChartProps) {
  const defaultOption: echarts.EChartsOption = {
    grid: {
      top: 60,
      bottom: 55,
      left: 55,
      right: 65,
    },
    xAxis: {
      name: 'Week',
      nameTextStyle: {
        color: '#4A585F',
        fontFamily: 'Mulish',
      },
      offset: 12,
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#4A585F',
        fontFamily: 'Mulish',
      },
      axisLine: {
        symbol: ['none', 'arrow'],
        lineStyle: {
          width: 2,
          color: 'rgba(149, 165, 172, 0.8)',
        },
      },
      data: [],
    },
    yAxis: {
      type: 'value',
      name: 'Score',
      nameLocation: 'end',
      nameTextStyle: {
        align: 'right',
        fontFamily: 'Mulish',
      },
      max: 6,
      min: 0,
      interval: 1,
      nameGap: 25,
      splitLine: {
        show: false,
      },
      axisLabel: {
        margin: 15,
        fontFamily: 'Mulish',
        verticalAlign: 'bottom',
      },
    },
    series: [
      {
        data: [],
        type: 'line',
        lineStyle: {
          color: '#508FD9',
        },
        label: {
          show: true,
          fontWeight: 600,
          fontSize: 14,
          offset: [0, 28],
          color: '#0E1E25',
          formatter: ({ value }: any) => Number(value).toFixed(1),
        },
        symbol: 'circle',
        itemStyle: {
          color: ({ value }) => (value ? '#FCE59C' : '#FFD1D2'),
        },
        symbolSize: 33,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: '#EFF8FE',
            },
            {
              offset: 0,
              color: 'rgba(80, 143, 217, 0.8)',
            },
          ]),
        },
      },
    ],
  };

  const [option, setOption] = useState<echarts.EChartsOption>({});

  useEffect(() => {
    const newOption = cloneDeep(defaultOption);
    console.log('%cindex.tsx line:108 seriesData', 'color: #007acc;', seriesData);
    (newOption.series as echarts.SeriesOption[])[0].data = seriesData as any;
    (newOption.xAxis as any).data = xAxisData;
    setOption(newOption);
  }, [xAxisData, seriesData]);

  return (
    <div>
      <CardTitle title="Mock Trend" iconFont={<RiseOutlined />} />
      <div className={styles.trend}>
        {seriesData && seriesData.length > 0 ? <Echarts option={option} /> : <Empty />}
      </div>
    </div>
  );
}
