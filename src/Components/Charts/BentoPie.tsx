import { useCallback, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Curve,
  Tooltip,
  Sector,
  PieProps,
  PieLabelRenderProps,
  ResponsiveContainer,
} from 'recharts';
import type CSS from 'csstype';

import {
  TOOLTIP_STYLE,
  TOOLTIP_OTHER_PROPS,
  LABEL_STYLE,
  COUNT_STYLE,
  CHART_MISSING_FILL,
  RADIAN,
  LABEL_THRESHOLD,
  COUNT_TEXT_STYLE,
  COUNT_TEXT_STYLE_CENTER,
  TEXT_STYLE,
  OTHER_KEY,
} from '../../constants/chartConstants';
import type { PieChartProps, TooltipPayload } from '../../types/chartTypes';
import {
  useChartTheme,
  useChartTranslation,
  useChartThreshold,
  useChartMaxLabelChars,
} from '../../ChartConfigProvider';
import { polarToCartesian, useTransformedChartData } from '../../util/chartUtils';
import NoData from '../NoData';
import ChartWrapper from './ChartWrapper';
import ChartLegend from './ChartLegend';

const SELECTED_FILL_OPACITY = 1;
const UNSELECTED_FILL_OPACITY = 0.35;

const labelShortName = (name: string, maxChars: number) => {
  if (name.length <= maxChars) {
    return name;
  }
  // removing 3 character cause ... s add three characters
  return `${name.substring(0, maxChars - 3)}\u2026`;
};

const _entryFill = (entry: { name: string; id?: string }, index: number, theme: string[]) =>
  entry.name.toLowerCase() === 'missing' ? CHART_MISSING_FILL : theme[index % theme.length];

// Prevents the last segment from having the same fill as the first segment (unless "missing") to ensure visual distinction.
const getPieSegmentFill = (
  entry: { name: string; id?: string },
  index: number,
  data: Array<{ name: string; id?: string }>,
  theme: string[],
  colorsById?: Record<string, string>
) => {
  const byId = colorsById?.[entry.id ?? entry.name];
  if (byId) return byId;

  let fill = _entryFill(entry, index, theme);
  if (index === data.length - 1 && entry.name.toLowerCase() !== 'missing') {
    const firstEntry = data[0];
    const firstFill = _entryFill(firstEntry, 0, theme);
    if (fill === firstFill) {
      fill = theme[(index + 1) % theme.length];
    }
  }
  return fill;
};

const BentoPie = ({
  height,
  width,
  onClick,
  sort = true,
  colorTheme = 'default',
  chartThreshold,
  maxLabelChars,
  colorsById,
  selectedIds,
  showLegend,
  centerLabel,
  ...params
}: PieChartProps) => {
  const t = useChartTranslation();
  const { fill: theme } = useChartTheme().pie[colorTheme];

  const defaultChartThreshold = useChartThreshold();
  const defaultMaxLabelChars = useChartMaxLabelChars();

  const resolvedChartThreshold = chartThreshold ?? defaultChartThreshold;
  const resolvedMaxLabelChars = maxLabelChars ?? defaultMaxLabelChars;

  // ##################### Data processing #####################

  const transformedData = useTransformedChartData(params, true, sort);
  const { data, sum } = useMemo(() => {
    let data = [...transformedData];

    // combining sections with less than chartThreshold
    const sum = data.reduce((acc, e) => acc + e.y, 0);
    const length = data.length;
    const threshold = resolvedChartThreshold * sum;
    const dataAboveThreshold = data.filter((e) => e.y > threshold);
    // length - 1 intentional: if there is just one category below threshold, the "Other" category is not necessary.
    data = dataAboveThreshold.length === length - 1 ? data : dataAboveThreshold;
    if (data.length !== length) {
      data.push({
        x: t[OTHER_KEY],
        y: sum - data.reduce((acc, e) => acc + e.y, 0),
        id: OTHER_KEY,
      });
    }

    return {
      data: data.map((e) => ({
        name: e.x,
        value: e.y,
        ...e,
        selected: selectedIds ? selectedIds.includes(e.id ?? e.x) : e.selected,
      })),
      sum,
    };
  }, [t, transformedData, resolvedChartThreshold, selectedIds]);

  // ##################### Rendering #####################
  const onHover: PieProps['onMouseOver'] = useCallback(
    (data, _index, e) => {
      const { target } = e;
      if (onClick && target && data.name !== t[OTHER_KEY]) (target as SVGElement).style.cursor = 'pointer';
    },
    [t, onClick]
  );

  const onLegendClick = useCallback(
    (id: string) => {
      const entry = data.find((e) => (e.id ?? e.name) === id);
      // Legend clicks don't originate from a Recharts pointer event, so we can only pass through the
      // data entry — onClick consumers should key off `entry.id`/`entry.name`, not the (unused) 2nd/3rd args.
      if (onClick && entry) (onClick as unknown as (entry: (typeof data)[number]) => void)(entry);
    },
    [data, onClick]
  );

  if (data.length === 0) {
    return <NoData height={height} />;
  }

  return (
    <ChartWrapper responsive={typeof width !== 'number'}>
      <ResponsiveContainer width={width ?? '100%'} height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="25%"
            outerRadius="55%"
            label={renderLabel(resolvedMaxLabelChars)}
            labelLine={false}
            isAnimationActive={false}
            onMouseOver={onHover}
            shape={PieChartShape}
            onClick={onClick}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={getPieSegmentFill(entry, index, data, theme, colorsById)}
                fillOpacity={
                  selectedIds && selectedIds.length > 0
                    ? entry.selected
                      ? SELECTED_FILL_OPACITY
                      : UNSELECTED_FILL_OPACITY
                    : SELECTED_FILL_OPACITY
                }
              />
            ))}
            {centerLabel !== undefined && (
              <>
                <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" style={COUNT_TEXT_STYLE_CENTER}>
                  {sum}
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" style={TEXT_STYLE}>
                  {centerLabel}
                </text>
              </>
            )}
          </Pie>
          <Tooltip {...TOOLTIP_OTHER_PROPS} content={<CustomTooltip totalCount={sum} />} isAnimationActive={false} />
        </PieChart>
      </ResponsiveContainer>
      {showLegend && (
        <ChartLegend
          entries={data.map((e, index) => ({
            id: e.id ?? e.name,
            name: e.name,
            value: e.value,
            fill: getPieSegmentFill(e, index, data, theme, colorsById),
            selected: e.selected,
          }))}
          onClick={onClick ? onLegendClick : undefined}
        />
      )}
    </ChartWrapper>
  );
};

const toNumber = (val: number | string | undefined, defaultValue?: number): number => {
  if (val && typeof val === 'string') {
    return Number(val);
  } else if (val && typeof val === 'number') {
    return val;
  }
  return defaultValue || 0;
};

const renderLabel = (resolvedMaxLabelChars: number): PieProps['label'] => {
  const BentoPieLabel = (params: PieLabelRenderProps) => {
    const { fill, payload } = params;
    const percent: number = params.percent || 0;
    const midAngle: number = params.midAngle || 0;

    // skip rendering if segment is too small a percentage (avoids label clutter)
    if (percent < LABEL_THRESHOLD) {
      return;
    }

    const outerRadius = toNumber(params.outerRadius);
    const cx = toNumber(params.cx);
    const cy = toNumber(params.cy);

    const name = payload.name === 'null' ? '(Empty)' : payload.name;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 20) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    const currentTextStyle: CSS.Properties = {
      ...TEXT_STYLE,
      fontWeight: payload.selected ? 'bold' : 'normal',
      fontStyle: payload.name === 'null' ? 'italic' : 'normal',
    };

    const offsetRadius = 20;
    const startPoint = polarToCartesian(cx, cy, outerRadius, midAngle);
    const endPoint = polarToCartesian(cx, cy, outerRadius + offsetRadius, midAngle);
    const lineProps = {
      ...params,
      fill: 'none',
      stroke: fill,
      points: [startPoint, endPoint],
    };

    return (
      <g>
        <Curve {...lineProps} type="linear" className="recharts-pie-label-line" />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 3} textAnchor={textAnchor} style={currentTextStyle}>
          {labelShortName(name, resolvedMaxLabelChars)}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={14} textAnchor={textAnchor} style={COUNT_TEXT_STYLE}>
          {`(${payload.value})`}
        </text>
      </g>
    );
  };
  BentoPieLabel.displayName = BentoPieLabel;
  return BentoPieLabel;
};

const PieChartShape: PieProps['shape'] = (params) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, isActive } = params;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        fill={fill}
      />
      {isActive ? (
        // render arc around active segment
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      ) : null}
    </g>
  );
};

const CustomTooltip = ({
  active,
  payload,
  totalCount,
}: {
  active?: boolean;
  payload?: TooltipPayload;
  totalCount: number;
}) => {
  if (!active) {
    return null;
  }

  const name = payload ? payload[0].name : '';
  const value = payload ? payload[0].value : 0;
  const percentage = totalCount ? Math.round((value / totalCount) * 100) : 0;

  return name !== 'other' ? (
    <div style={TOOLTIP_STYLE}>
      <p style={LABEL_STYLE}>{name}</p>
      <p style={COUNT_STYLE}>
        {' '}
        {value} ({percentage}
        %)
      </p>
    </div>
  ) : (
    <div>No data</div>
  );
};

export default BentoPie;
