import React from 'react';
import { PieChart } from '../../src/index';

const TestPieChart = () => (
  <PieChart
    data={[
      { x: 'AB', y: 50 },
      { x: 'NB', y: 75 },
      { x: 'SB', y: 60 },
      { x: 'SB', y: 60 },
      { x: 'SB', y: 60 },
      { x: 'SB', y: 60 },
      { x: 'AU', y: 30 },
      { x: 'XA', y: 80 },
      { x: 'BB', y: 50 },
      { x: 'BC', y: 75 },
      { x: 'BD', y: 60 },
      { x: 'BE', y: 30 },
      { x: 'BF', y: 80 },
    ]}
    onClick={(f) => {
      console.log(f);
      alert(JSON.stringify(f, null, 2));
    }}
    height={600}
    colorTheme="new"
  />
);

export default TestPieChart;
