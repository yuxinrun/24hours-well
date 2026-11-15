'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  MarkLineComponent,
  DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption, EChartsType } from 'echarts/core';

echarts.use([
  PieChart,
  BarChart,
  LineChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  MarkLineComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

export const CHART_PALETTE = ['#C67C4B', '#33513F', '#D9A075', '#8A4E2F', '#4F6E58', '#E8C4A3', '#A8623C', '#DED2BE'];

export function EChart({
  option,
  className,
  height = 320,
}: {
  option: EChartsCoreOption;
  className?: string;
  height?: number | string;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const chart = echarts.init(elRef.current, undefined, { renderer: 'canvas' });
    chartRef.current = chart;
    chart.setOption(option);

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(elRef.current);
    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      chart.dispose();
      chartRef.current = null;
    };
    // 仅初始化一次，后续通过下面的 effect 更新
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return <div ref={elRef} className={`max-w-full overflow-hidden ${className ?? ''}`} style={{ width: '100%', height }} role="img" aria-label="数据可视化图表" />;
}
