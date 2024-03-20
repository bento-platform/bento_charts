import React from 'react';
import { BarChartProps } from '../../types/chartTypes';

import { useChartTheme } from '../../ChartConfigProvider';
import BaseBarChart from './BaseBarChart';

const BentoBarChart: React.FC<BarChartProps> = ({ colorTheme = 'default', ...params }) => {
  const { fill: chartFill, other: otherFill } = useChartTheme().bar[colorTheme];

  return <BaseBarChart chartFill={chartFill} otherFill={otherFill} {...params} />;
};

export default BentoBarChart;
