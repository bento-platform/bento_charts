import { HistogramProps } from '../../types/chartTypes';

import { useChartTheme } from '../../ChartConfigProvider';
import BaseBarChart from './BaseBarChart';

const BentoHistogram = ({ colorTheme = 'default', barCountFillMode, ...params }: HistogramProps) => {
  const { fill: chartFill, other: otherFill } = useChartTheme().histogram[colorTheme];

  return (
    <BaseBarChart
      chartFill={chartFill}
      otherFill={otherFill}
      barCountFillMode={barCountFillMode ?? 'match'} // For histograms, bar count text fill defaults to matching bar
      {...params}
    />
  );
};

export default BentoHistogram;
