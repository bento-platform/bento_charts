import { useCallback, useMemo, useState } from 'react';
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

const labelShortName = (name: string, maxChars: number) => {
  if (name.length <= maxChars) {
    return name;
  }
  // removing 3 character cause ... s add three characters
  return `${name.substring(0, maxChars - 3)}\u2026`;
};

const BentoPie = ({
  height,
  width,
  onClick,
  sort = true,
  colorTheme = 'default',
  chartThreshold,
  maxLabelChars,
  ...params
}: PieChartProps) => {
  const t = useChartTranslation();
  const { fill: theme } = useChartTheme().pie[colorTheme];

  const defaultChartThreshold = useChartThreshold();
  const defaultMaxLabelChars = useChartMaxLabelChars();

  const resolvedChartThreshold = chartThreshold ?? defaultChartThreshold;
  const resolvedMaxLabelChars = maxLabelChars ?? defaultMaxLabelChars;

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

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
      });
    }

    return {
      data: data.map((e) => ({ name: e.x, value: e.y })),
      sum,
    };
  }, [t, transformedData, resolvedChartThreshold]);

  // ##################### Rendering #####################
  const onEnter: PieProps['onMouseEnter'] = useCallback((_data, index) => {
    setActiveIndex(index);
  }, []);

  const onHover: PieProps['onMouseOver'] = useCallback(
    (data, _index, e) => {
      const { target } = e;
      if (onClick && target && data.name !== t[OTHER_KEY]) (target as SVGElement).style.cursor = 'pointer';
    },
    [t, onClick]
  );

  const onLeave: PieProps['onMouseLeave'] = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

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
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onMouseOver={onHover}
            activeIndex={activeIndex}
            activeShape={RenderActiveLabel}
            onClick={onClick}
          >
            {data.map((entry, index) => {
              const fill = entry.name.toLowerCase() === 'missing' ? CHART_MISSING_FILL : theme[index % theme.length];
              return <Cell key={index} fill={fill} />;
            })}
          </Pie>
          <Tooltip {...TOOLTIP_OTHER_PROPS} content={<CustomTooltip totalCount={sum} />} isAnimationActive={false} />
        </PieChart>
      </ResponsiveContainer>
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
    const { fill, payload, index, activeIndex } = params;
    const percent = params.percent || 0;
    const midAngle = params.midAngle || 0;

    // skip rendering this static label if the sector is selected.
    // this will let the 'renderActiveState' draw without overlapping.
    // also, skip rendering if segment is too small a percentage (avoids label clutter)
    if (index === activeIndex || percent < LABEL_THRESHOLD) {
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

const RenderActiveLabel: PieProps['activeShape'] = (params) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = params;

  // render arc around active segment
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
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
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
