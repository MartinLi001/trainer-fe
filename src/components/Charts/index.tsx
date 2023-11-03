import { useUpdateEffect } from 'ahooks';
import * as echarts from 'echarts';
import { memo, useRef, useState } from 'react';

function Echarts({ option }: { option: echarts.EChartsOption }) {
  const chartRef = useRef<HTMLInputElement>(null);
  const [chart, setChart] = useState<echarts.ECharts>();

  const run = () => {
    setTimeout(() => {
      chart?.resize();
    }, 200);
  };

  const initChart = () => {
    if (chart) {
      window.removeEventListener('resize', run);
    }
    const newChart = echarts?.init(chartRef?.current as HTMLElement);
    newChart.setOption(option, true);
    setChart(newChart);
    window.addEventListener('resize', run);
  };

  useUpdateEffect(() => {
    initChart();

    return () => {
      window.addEventListener('resize', run);
    };
  }, [option]);

  return <div ref={chartRef} style={{ height: '100%', width: '100%' }} />;
}

export default memo(Echarts);
