import type { CategoricalChartDataItem, HexColor } from '../../types/chartTypes';
import { CATEGORY_FALLBACK_FILL } from '../../constants/chartConstants';

export interface CategoryBarListProps {
  // x is the display label, y the value, id the stable key used for colorsById/selectedIds/onClick.
  data: CategoricalChartDataItem[];
  colorsById: Record<string, HexColor>;
  defaultColor?: HexColor;
  selectedIds?: string[];
  formatValue?: (value: number) => string;
  onClick?: (id: string) => void;
}

const CategoryBarList = ({
  data,
  colorsById,
  defaultColor = CATEGORY_FALLBACK_FILL,
  selectedIds,
  formatValue = (v) => `${v}`,
  onClick,
}: CategoryBarListProps) => {
  if (data.length === 0) return null;

  const max = Math.max(1, ...data.map((d) => d.y));

  return (
    <div className="bento-charts--category-bar-list">
      {data.map((entry) => {
        const id = entry.id ?? entry.x;
        const selected = selectedIds?.includes(id);
        return (
          <div
            key={id}
            className={`bento-charts--category-bar-list-row${
              selected ? ' bento-charts--category-bar-list-row-selected' : ''
            }${onClick ? ' bento-charts--category-bar-list-row-clickable' : ''}`}
            onClick={onClick ? () => onClick(id) : undefined}
          >
            <span className="bento-charts--category-bar-list-label" title={entry.x}>
              {entry.x}
            </span>
            <span className="bento-charts--category-bar-list-track">
              <span
                className="bento-charts--category-bar-list-fill"
                style={{ width: `${(entry.y / max) * 100}%`, background: colorsById[id] ?? defaultColor }}
              />
            </span>
            <span className="bento-charts--category-bar-list-value">{formatValue(entry.y)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBarList;
