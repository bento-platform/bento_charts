import type { PieProps, BarProps } from 'recharts';
import { COUNT_KEY, OTHER_KEY } from '../constants/chartConstants';

export type CategoricalChartDataType = CategoricalChartDataItem[];

export interface CategoricalChartDataItem {
  x: string;
  y: number;
}

export type TooltipPayload = TooltipPayloadItem[];

interface TooltipPayloadItem {
  name: string;
  payload: {
    x: string;
  };
  value: number;
}

export type HexColor = `#${string}`;

export type ChartThemeContext = { fill: HexColor[]; other: HexColor };
export type ChartTypeContext = {
  [key in string]: ChartThemeContext;
} & {
  default: ChartThemeContext;
};
export type ChartTheme = {
  pie: ChartTypeContext;
  bar: ChartTypeContext;
};

export type FilterCallback<T> = (value: T, index: number, array: T[]) => boolean;
export type UnitaryMapCallback<T> = (value: T, index: number, array: T[]) => T;
// export type BinaryMapCallback<T, U> = (value: T, index: number, array: T[]) => U;

export type ChartFilterCallback = FilterCallback<CategoricalChartDataItem>;
export type ChartDataMapCallback = UnitaryMapCallback<CategoricalChartDataItem>;

export type SupportedLng = 'en' | 'fr';

type TranslationWords = typeof COUNT_KEY | typeof OTHER_KEY;

export type LngDictionary = {
  [key in TranslationWords]: string;
};

export type TranslationObject = {
  [key in SupportedLng]: LngDictionary;
};

export interface CategoricalChartDataWithTransforms {
  data: CategoricalChartDataType;
  preFilter?: ChartFilterCallback;
  dataMap?: ChartDataMapCallback;
  postFilter?: ChartFilterCallback;
  removeEmpty?: boolean;
}

// ###################  COMPONENT PROPS #####################
export interface BaseChartComponentProps {
  height: number;
  // Width is useful to have, to force re-render / force a specific width, but it is optional.
  // Otherwise, it will be set to 100%.
  width?: number | string;
}

export interface BaseCategoricalChartProps extends BaseChartComponentProps, CategoricalChartDataWithTransforms {}

export interface PieChartProps extends BaseCategoricalChartProps {
  colorTheme?: keyof ChartTheme['pie'];
  sort?: boolean;
  onClick?: PieProps['onClick'];
  chartThreshold?: number;
  maxLabelChars?: number;
}

export interface BarChartProps extends BaseCategoricalChartProps {
  colorTheme?: keyof ChartTheme['bar'];
  title?: string;
  units: string;
  onClick?: BarProps['onClick'];
}
