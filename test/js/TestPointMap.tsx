import { PointMap } from '../../src/maps';
import { TEST_HEATMAP_GEOJSON_FEATURES } from './testData';

const TestPointMap = () => (
  <PointMap
    data={TEST_HEATMAP_GEOJSON_FEATURES.features[1].geometry.coordinates[0].map((c, i) => {
      return {
        title: `point ${i}`,
        coordinates: c as [number, number],
      };
    })}
    height={600}
    center={[74.0694163, -112.7217838]}
    zoom={2.75}
  />
);

export default TestPointMap;
