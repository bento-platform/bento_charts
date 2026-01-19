import { useCallback, useMemo } from 'react';
import {
  Bar,
  BarChart,
  type BarProps,
  CartesianGrid,
  Cell,
  Label,
  type LabelProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  TOOLTIP_STYLE,
  COUNT_STYLE,
  LABEL_STYLE,
  MAX_TICK_LABEL_CHARS,
  TITLE_STYLE,
  TICKS_SHOW_ALL_LABELS_BELOW,
  UNITS_LABEL_OFFSET,
  TICK_MARGIN,
  COUNT_KEY,
} from '../../constants/chartConstants';

import type { BaseBarChartProps, CategoricalChartDataItem, TooltipPayload } from '../../types/chartTypes';
import { useChartTranslation } from '../../ChartConfigProvider';
import NoData from '../NoData';
import { useTransformedChartData } from '../../util/chartUtils';
import ChartWrapper from './ChartWrapper';

const tickFormatter = (tickLabel: string) => {
  if (tickLabel.length <= MAX_TICK_LABEL_CHARS) {
    return tickLabel;
  }
  return `${tickLabel.substring(0, MAX_TICK_LABEL_CHARS)}...`;
};

const BAR_CHART_MARGINS = { bottom: 100, right: 0 };
const BAR_CHART_MARGIN_TOP_COUNTS = 35;
const BAR_CHART_MARGIN_TOP_NO_COUNTS = 10;
const MIN_BAR_WIDTH_FOR_COUNTS = 11;
const BAR_LABEL_SPACING = 4; // Spacing of a BarLabel above the actual bar, in pixels.
const BAR_LABEL_APPROX_NUMBER_WIDTH = 9.2;

const BaseBarChart = ({
  height,
  width,
  units,
  title,
  onClick,
  onChartClick,
  chartFill,
  otherFill,
  showBarCounts,
  ...params
}: BaseBarChartProps) => {
  showBarCounts = showBarCounts ?? true; // Show bar counts by default

  const t = useChartTranslation();

  const margins = useMemo(
    () => ({
      ...BAR_CHART_MARGINS,
      // Top margin needs to accommodate bar count labels:
      top: showBarCounts ? BAR_CHART_MARGIN_TOP_COUNTS : BAR_CHART_MARGIN_TOP_NO_COUNTS,
    }),
    [showBarCounts]
  );

  const fill = (entry: CategoricalChartDataItem, index: number) =>
    entry.x === 'missing' ? otherFill : chartFill[index % chartFill.length];

  const data = useTransformedChartData(params, true);

  const totalCount = data.reduce((sum, e) => sum + e.y, 0);

  const onHover: BarProps['onMouseEnter'] = useCallback(
    (_data, _index, e) => {
      const { target } = e;
      if (onClick && target) (target as SVGElement).style.cursor = 'pointer';
    },
    [onClick]
  );

  if (data.length === 0) {
    return <NoData height={height} />;
  }

  // Regarding XAxis.ticks below:
  //  The weird conditional is added from https://github.com/recharts/recharts/issues/2593#issuecomment-1311678397
  //  Basically, if data is empty, Recharts will default to a domain of [0, "auto"] and our tickFormatter trips up
  //  on formatting a non-string. This hack manually overrides the ticks for the axis and blanks it out.
  //    - David L, 2023-01-03
  return (
    <ChartWrapper responsive={typeof width !== 'number'}>
      <div style={TITLE_STYLE}>{title}</div>
      <ResponsiveContainer width={width ?? '100%'} height={height}>
        <BarChart data={data} margin={margins} onClick={onChartClick}>
          <XAxis
            dataKey="x"
            height={20}
            angle={-45}
            ticks={data.length ? undefined : ['']}
            tickFormatter={tickFormatter}
            tickMargin={TICK_MARGIN}
            textAnchor="end"
            interval={data.length < TICKS_SHOW_ALL_LABELS_BELOW ? 0 : 'preserveStartEnd'}
          >
            <Label value={units} offset={UNITS_LABEL_OFFSET} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value={t[COUNT_KEY]} offset={-10} position="left" angle={270} />
          </YAxis>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip content={<BarTooltip totalCount={totalCount} />} />
          <Bar
            dataKey="y"
            isAnimationActive={false}
            onClick={onClick}
            onMouseEnter={onHover}
            maxBarSize={70}
            label={showBarCounts ? BarLabel : undefined}
          >
            {data.map((entry, index) => (
              <Cell key={entry.x} fill={fill(entry, index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

const BarTooltip = ({
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

  const name = (payload && payload[0]?.payload?.x) || '';
  const value = (payload && payload[0]?.value) || 0;
  const percentage = totalCount ? Math.round((value / totalCount) * 100) : 0;

  return (
    <div style={TOOLTIP_STYLE}>
      <p style={LABEL_STYLE}>{name}</p>
      <p style={COUNT_STYLE}>
        {value} ({percentage}%)
      </p>
    </div>
  );
};

/**
 * Component for rendering bar counts directly above bars in the plot.
 */
const BarLabel = ({ x, y, width, value, fill }: LabelProps) => {
  // Funky conversion to placate TypeScript. In reality, width should always be a number here, the Recharts types are
  // just incorrect or something.
  // noinspection SuspiciousTypeOfGuard
  const finalWidth = typeof width === 'string' ? MIN_BAR_WIDTH_FOR_COUNTS : (width ?? 0);

  // Flip the labels to vertical text when the bar width is (roughly) less than the text width
  // noinspection SuspiciousTypeOfGuard
  const vertical = finalWidth < (value ?? '').toString().length * BAR_LABEL_APPROX_NUMBER_WIDTH;
  // noinspection SuspiciousTypeOfGuard
  const xPos = typeof x === 'number' ? x + finalWidth / 2 : x;

  return (
    <g transform={`translate(${xPos}, ${y})`}>
      <text
        textAnchor={vertical ? 'start' : 'middle'} // Anchor the start coordinate of the text at the start in vert. mode
        dominantBaseline={vertical ? 'central' : undefined} // In vertical text mode, center the text over the bar
        transform={vertical ? 'rotate(-90)' : undefined} // Make text vertical for narrow bars
        letterSpacing={vertical ? -1 : undefined} // Compress text slightly in vertical mode, to better fit in margin
        dy={vertical ? 0 : -1 * BAR_LABEL_SPACING}
        dx={vertical ? BAR_LABEL_SPACING : 0}
        fill={fill}
      >
        {/* Hide 0-count values to avoid a bunch of "0" spam in histograms with empty bars */}
        {finalWidth < MIN_BAR_WIDTH_FOR_COUNTS || value === 0 ? '' : value}
      </text>
    </g>
  );
};

export default BaseBarChart;
