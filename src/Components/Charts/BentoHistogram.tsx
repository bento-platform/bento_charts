import React from 'react';
import { HistogramProps } from '../../types/chartTypes';

import { useChartTheme } from '../../ChartConfigProvider';
import BaseBarChart from './BaseBarChart';

const BentoHistogram: React.FC<HistogramProps> = ({ colorTheme = 'default', ...params }) => {
  const { fill: chartFill, other: otherFill } = useChartTheme().histogram[colorTheme];

  return <BaseBarChart chartFill={chartFill} otherFill={otherFill} {...params} />;
};

export default BentoHistogram;
