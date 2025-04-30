import { PieChart } from '../../src/index';

const TestPieChart = () => (
  <PieChart
    data={[
      { id: '0', x: 'Segment A', y: 50 },
      { id: '1', x: 'Segment B', y: 60 },
      { id: '2', x: 'Segment C', y: 70 },
      { id: '3', x: 'Segment D', y: 80 },
      { id: '4', x: 'Segment E', y: 90 },
      { id: '5', x: 'Segment F', y: 100 },
      { id: '6', x: 'Segment G', y: 110 } // conflict: theme[6 % 6] === theme[0]
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
