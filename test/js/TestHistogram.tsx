import { useState } from 'react';
import { Space, Switch } from 'antd';
import { Histogram } from '../../src/index';
import ResizableCard from './Util/ResizableCard';

const TEST_DATA = [
  { id: '0', x: '0-9', y: 700 },
  { id: '1', x: '10-19', y: 1500 },
  { id: '2', x: '20-29', y: 2200 },
  { id: '3', x: '30-39', y: 1300 },
  { id: '4', x: '40-49', y: 900 },
  { id: '5', x: '50-59', y: 500 },
  { id: '6', x: '60-69', y: 300 },
  { id: '7', x: '70-79', y: 200 },
  { id: '8', x: '80-89', y: 100 },
  { id: '9', x: '90-99', y: 100 },
  { id: '10', x: '100+', y: 0 },
];

const TestHistogram = () => {
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
        <ResizableCard title="Fixed Histogram" sizeState={sizeStateFixed} onSizeChange={setSizeStateFixed}>
          <Histogram
            data={TEST_DATA}
            units="management units"
            removeEmpty={false}
            height={sizeStateFixed.height}
            width={sizeStateFixed.width}
            onClick={(f) => {
              console.log('onClick', f);
            }}
            onChartClick={(f) => {
              console.log('onChartClick', f);
            }}
            showBarCounts={showBarCounts}
          />
        </ResizableCard>
        <ResizableCard
          title="Responsive Histogram"
          sizeState={sizeStateResponsive}
          onSizeChange={setSizeStateResponsive}
        >
          <Histogram
            data={TEST_DATA}
            units="management units"
            height={sizeStateResponsive.height}
            onClick={(f) => {
              console.log('onClick', f);
            }}
            onChartClick={(f) => {
              console.log('onChartClick', f);
            }}
            showBarCounts={showBarCounts}
          />
        </ResizableCard>
      </Space>
    </Space>
  );
};

export default TestHistogram;
