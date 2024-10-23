import { BarChartProps } from '../../types/chartTypes';

import { useChartTheme } from '../../ChartConfigProvider';
import BaseBarChart from './BaseBarChart';

const BentoBarChart = ({ colorTheme = 'default', ...params }: BarChartProps) => {
  const { fill: chartFill, other: otherFill } = useChartTheme().bar[colorTheme];

  return <BaseBarChart chartFill={chartFill} otherFill={otherFill} {...params} />;
};

export default BentoBarChart;
