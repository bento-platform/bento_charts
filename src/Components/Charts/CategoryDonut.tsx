import type { CategoricalChartDataItem, HexColor } from '../../types/chartTypes';
import { CATEGORY_FALLBACK_FILL, CATEGORY_TRACK_FILL } from '../../constants/chartConstants';

const SIZE = 116;
const R = 46;
const CIRC = 2 * Math.PI * R;
const LABEL_WIDTH = 74;
const LABEL_HEIGHT = 30;

export interface CategoryDonutProps {
  // x is the display label, y the value, id the stable key used for colorsById/selectedIds/onClick.
  data: CategoricalChartDataItem[];
  colorsById: Record<string, HexColor>;
  defaultColor?: HexColor;
  trackColor?: HexColor;
  selectedIds?: string[];
  centerLabel?: string;
  formatValue?: (value: number) => string;
  maxWidth?: number;
  onClick?: (id: string) => void;
}

const CategoryDonut = ({
  data,
  colorsById,
  defaultColor = CATEGORY_FALLBACK_FILL,
  trackColor = CATEGORY_TRACK_FILL,
  selectedIds,
  centerLabel,
  formatValue = (v) => `${v}`,
  maxWidth = SIZE,
  onClick,
}: CategoryDonutProps) => {
  if (data.length === 0) return null;

  const total = data.reduce((sum, e) => sum + e.y, 0);

  const segments = data.reduce<{ entry: CategoricalChartDataItem; len: number; dashOffset: number }[]>((acc, entry) => {
    const len = total ? (entry.y / total) * CIRC : 0;
    const dashOffset = -(acc.length > 0 ? acc[acc.length - 1].dashOffset * -1 + acc[acc.length - 1].len : 0);
    return [...acc, { entry, len, dashOffset }];
  }, []);

  const c = SIZE / 2;

  return (
    <div className="bento-charts--category-donut-wrap">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="bento-charts--category-donut" style={{ maxWidth }}>
        <circle cx={c} cy={c} r={R} fill="none" stroke={trackColor} strokeWidth="16" />
        {segments.map(({ entry, len, dashOffset }) => {
          const id = entry.id ?? entry.x;
          return (
            <circle
              key={id}
              cx={c}
              cy={c}
              r={R}
              fill="none"
              stroke={colorsById[id] ?? defaultColor}
              strokeWidth="16"
              strokeDasharray={`${len} ${CIRC - len}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${c} ${c})`}
              className={onClick ? 'bento-charts--category-donut-segment-clickable' : undefined}
              onClick={onClick ? () => onClick(id) : undefined}
            >
              <title>
                {entry.x}: {formatValue(entry.y)}
              </title>
            </circle>
          );
        })}
        {centerLabel !== undefined && (
          <>
            <text x={c} y={c - 6} className="bento-charts--category-donut-num">
              {formatValue(total)}
            </text>
            <foreignObject x={c - LABEL_WIDTH / 2} y={c + 2} width={LABEL_WIDTH} height={LABEL_HEIGHT}>
              <div className="bento-charts--category-donut-lbl">{centerLabel}</div>
            </foreignObject>
          </>
        )}
      </svg>
      <ul className="bento-charts--category-donut-legend">
        {data.map((entry) => {
          const id = entry.id ?? entry.x;
          const selected = selectedIds?.includes(id);
          return (
            <li
              key={id}
              className={`bento-charts--category-donut-legend-row${
                selected ? ' bento-charts--category-donut-legend-row-selected' : ''
              }${onClick ? ' bento-charts--category-donut-legend-row-clickable' : ''}`}
              onClick={onClick ? () => onClick(id) : undefined}
            >
              <span className="bento-charts--category-dot" style={{ background: colorsById[id] ?? defaultColor }} />
              <span className="bento-charts--category-donut-legend-label">{entry.x}</span>
              <span className="bento-charts--category-donut-legend-value">{formatValue(entry.y)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryDonut;
