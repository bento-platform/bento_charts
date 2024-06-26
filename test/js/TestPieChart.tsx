import React from 'react';
import { PieChart } from '../../src/index';

const TestPieChart = () => (
  <PieChart
    data={[
      { x: 'AB this is a very very very very very very very very very very long label', y: 50 },
      { x: 'NB', y: 75 },
      { x: 'SB', y: 60 },
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
