import { useState } from 'react';
import { Space, Switch } from 'antd';
import { BarChart } from '../../src/index';
import ResizableCard from './Util/ResizableCard';

const TestBarChart = () => {
  const [showBarCounts, setShowBarCounts] = useState(true);
  const [sizeStateResponsive, setSizeStateResponsive] = useState({ width: 500, height: 500 });
  const [sizeStateFixed, setSizeStateFixed] = useState({ width: 960, height: 600 });
  return (
    <Space orientation="vertical" size={12}>
      <Space>
        <Switch value={showBarCounts} onChange={(v) => setShowBarCounts(v)} />
        <span>Show Bar Counts</span>
      </Space>
      <Space orientation="vertical" size={150}>
        <ResizableCard title="Fixed Bar Chart" sizeState={sizeStateFixed} onSizeChange={setSizeStateFixed}>
          <BarChart
            data={[
              { id: '0', x: 'AB', y: 50 },
              { id: '1', x: 'NB', y: 75 },
              { id: '2', x: 'SB', y: 60 },
              { id: '3', x: 'AU', y: 30 },
              { id: '4', x: 'XA', y: 80 },
              { id: '5', x: 'BB', y: 50 },
              { id: '6', x: 'BC', y: 75 },
              { id: '7', x: 'BD', y: 60 },
              { id: '8', x: 'BE', y: 30 },
              { id: '9', x: 'BF', y: 80 },
            ]}
            units="management units"
            height={sizeStateFixed.height}
            width={sizeStateFixed.width}
            colorTheme="new"
            showBarCounts={showBarCounts}
            onClick={(f) => {
              console.log('onClick', f);
            }}
            onChartClick={(f) => {
              console.log('onChartClick', f);
            }}
          />
        </ResizableCard>
        <ResizableCard
          title="Responsive Bar Chart"
          sizeState={sizeStateResponsive}
          onSizeChange={setSizeStateResponsive}
        >
          <BarChart
            data={[
              { id: '0', x: 'AB', y: 50 },
              { id: '1', x: 'NB', y: 75 },
              { id: '2', x: 'SB', y: 60 },
              { id: '3', x: 'AU', y: 30 },
              {
                id: '4',
                x: 'XA really really really really really really really really really really long label',
                y: 80,
              },
            ]}
            units="management units"
            height={sizeStateResponsive.height}
            colorTheme="new"
            showBarCounts={showBarCounts}
            onClick={(f) => {
              console.log('onClick', f);
            }}
            onChartClick={(f) => {
              console.log('onChartClick', f);
            }}
          />
        </ResizableCard>
      </Space>
    </Space>
  );
};

export default TestBarChart;
