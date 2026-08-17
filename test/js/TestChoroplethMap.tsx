import { useMemo, useState } from 'react';
import { ChoroplethMap } from '../../src/maps';
import { TEST_HEATMAP_GEOJSON_FEATURES } from './testData';
import { Checkbox } from 'antd';

const FULL_DATA = [
  { x: 'AB', y: 50 },
  { x: 'NB', y: 75 },
  { x: 'SB', y: 60 },
];

const TestChoroplethMap = () => {
  const [filtered, setFiltered] = useState(false);

  const data = useMemo(
    () =>
      filtered
        ? [
            { x: 'AB', y: 50 },
            { x: 'NB', y: 0 },
            { x: 'SB', y: 0 },
          ]
        : FULL_DATA,
    [filtered]
  );

  return (
    <>
      <Checkbox onChange={(e) => setFiltered(e.target.checked)} checked={filtered}>
        Filtered?
      </Checkbox>
      <ChoroplethMap
        features={TEST_HEATMAP_GEOJSON_FEATURES}
        categoryProp="pop"
        dataContext={FULL_DATA}
        data={data}
        colorMode={{
          mode: 'continuous',
          minColor: 'rgba(247, 252, 253, 0.2)',
          maxColor: 'rgba(35, 139, 69, 0.6)',
        }}
        onClick={(f) => {
          console.log(f);
          alert(JSON.stringify(f, null, 2));
        }}
        height={600}
        center={[74.0694163, -112.7217838]}
        zoom={2.75}
        renderPopupBody={(_f, d) => <>{d?.toFixed(0)} samples</>}
      />
    </>
  );
};

export default TestChoroplethMap;
