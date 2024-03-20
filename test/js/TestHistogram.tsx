import React from 'react';
import { Space } from 'antd';
import { Histogram } from '../../src/index';
import ResizableCard from './Util/ResizableCard';

const TestBarChart: React.FC = () => {
  const [sizeStateResponsive, setSizeStateResponsive] = React.useState({ width: 500, height: 500 });
  const [sizeStateFixed, setSizeStateFixed] = React.useState({ width: 960, height: 600 });
  return (
    <Space direction="vertical" size={150}>
      <ResizableCard title="Fixed Histogram" sizeState={sizeStateFixed} onSizeChange={setSizeStateFixed}>
        <Histogram
          data={[
            { x: '0-9', y: 7 },
            { x: '10-19', y: 15 },
            { x: '20-29', y: 22 },
            { x: '30-39', y: 13 },
            { x: '40-49', y: 9 },
            { x: '50-59', y: 5 },
            { x: '60-69', y: 3 },
            { x: '70-79', y: 2 },
            { x: '80-89', y: 1 },
            { x: '90-99', y: 1 },
          ]}
          units="management units"
          height={sizeStateFixed.height}
          width={sizeStateFixed.width}
        />
      </ResizableCard>
      <ResizableCard title="Responsive Histogram" sizeState={sizeStateResponsive} onSizeChange={setSizeStateResponsive}>
        <Histogram
          data={[
            { x: '0-9', y: 7 },
            { x: '10-19', y: 15 },
            { x: '20-29', y: 22 },
            { x: '30-39', y: 13 },
            { x: '40-49', y: 9 },
            { x: '50-59', y: 5 },
            { x: '60-69', y: 3 },
            { x: '70-79', y: 2 },
            { x: '80-89', y: 1 },
            { x: '90-99', y: 1 },
          ]}
          units="management units"
          height={sizeStateResponsive.height}
        />
      </ResizableCard>
    </Space>
  );
};

export default TestBarChart;
