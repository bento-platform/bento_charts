import { useState } from 'react';
import { Space } from 'antd';
import { BarChart } from '../../src/index';
import ResizableCard from './Util/ResizableCard';

const TestBarChart = () => {
  const [sizeStateResponsive, setSizeStateResponsive] = useState({ width: 500, height: 500 });
  const [sizeStateFixed, setSizeStateFixed] = useState({ width: 960, height: 600 });
  return (
    <Space direction="vertical" size={150}>
      <ResizableCard title="Fixed Bar Chart" sizeState={sizeStateFixed} onSizeChange={setSizeStateFixed}>
        <BarChart
          data={[
            { x: 'AB', y: 50 },
            { x: 'NB', y: 75 },
            { x: 'SB', y: 60 },
            { x: 'AU', y: 30 },
            { x: 'XA', y: 80 },
            { x: 'BB', y: 50 },
            { x: 'BC', y: 75 },
            { x: 'BD', y: 60 },
            { x: 'BE', y: 30 },
            { x: 'BF', y: 80 },
          ]}
          units="management units"
          height={sizeStateFixed.height}
          width={sizeStateFixed.width}
          colorTheme="new"
          onClick={(f) => {
            console.log('onClick', f);
          }}
          onChartClick={(f) => {
            console.log('onChartClick', f);
          }}
        />
      </ResizableCard>
      <ResizableCard title="Responsive Bar Chart" sizeState={sizeStateResponsive} onSizeChange={setSizeStateResponsive}>
        <BarChart
          data={[
            { x: 'AB', y: 50 },
            { x: 'NB', y: 75 },
            { x: 'SB', y: 60 },
            { x: 'AU', y: 30 },
            { x: 'XA really really really really really really really really really really long label', y: 80 },
          ]}
          units="management units"
          height={sizeStateResponsive.height}
          colorTheme="new"
          onClick={(f) => {
            console.log('onClick', f);
          }}
          onChartClick={(f) => {
            console.log('onChartClick', f);
          }}
        />
      </ResizableCard>
    </Space>
  );
};

export default TestBarChart;
