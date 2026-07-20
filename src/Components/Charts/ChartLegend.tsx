import type { HexColor } from '../../types/chartTypes';

export interface ChartLegendEntry {
  id: string;
  name: string;
  value: number;
  fill: HexColor | string;
  selected?: boolean;
}

interface ChartLegendProps {
  entries: ChartLegendEntry[];
  onClick?: (id: string) => void;
}

const ChartLegend = ({ entries, onClick }: ChartLegendProps) => (
  <ul className="bento-charts--legend">
    {entries.map((entry) => (
      <li
        key={entry.id}
        className={`bento-charts--legend--row${entry.selected ? ' bento-charts--legend--row-selected' : ''}${
          onClick ? ' bento-charts--legend--row-clickable' : ''
        }`}
        onClick={onClick ? () => onClick(entry.id) : undefined}
      >
        <span className="bento-charts--legend--patch" style={{ backgroundColor: entry.fill }} />
        <span className="bento-charts--legend--label">{entry.name}</span>
        <span className="bento-charts--legend--value">{entry.value}</span>
      </li>
    ))}
  </ul>
);

export default ChartLegend;
