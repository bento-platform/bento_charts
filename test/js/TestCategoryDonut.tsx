import { useState } from 'react';

import { CategoryDonut, HexColor } from '../../src/index';
import { NEW_CHART_COLORS } from '../../src/constants/chartConstants';

const DATA = [
  { id: 'a', x: 'Segment A', y: 50 },
  { id: 'b', x: 'Segment B', y: 60 },
  { id: 'c', x: 'Segment C', y: 70 },
  { id: 'd', x: 'Segment D', y: 80 },
  { id: 'e', x: 'Segment E', y: 90 },
];

const COLORS_BY_ID = DATA.reduce<Record<string, HexColor>>((acc, entry, i) => {
  acc[entry.id] = NEW_CHART_COLORS[i % NEW_CHART_COLORS.length];
  return acc;
}, {});

const TestCategoryDonut = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const onClick = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <CategoryDonut
      data={DATA}
      colorsById={COLORS_BY_ID}
      selectedIds={selectedIds}
      centerLabel="Total"
      onClick={onClick}
    />
  );
};

export default TestCategoryDonut;
