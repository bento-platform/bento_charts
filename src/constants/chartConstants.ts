import type CSS from 'csstype';
import { ChartTheme, HexColor, TranslationObject } from '../types/chartTypes';

// ################### PACKAGE CONSTANTS ###################

export const COUNT_KEY = 'Count';
export const OTHER_KEY = 'Other';

export const defaultTranslationObject: TranslationObject = {
  en: {
    [COUNT_KEY]: 'Count',
    [OTHER_KEY]: 'Other',
  },
  fr: {
    [COUNT_KEY]: 'Comptage',
    [OTHER_KEY]: 'Autre',
  },
};

// ################### THEME CONSTANTS ###################
// Bento-web colours
export const COLORS: HexColor[] = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC',
];

export const NEW_CHART_COLORS: HexColor[] = ['#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D', '#2D9CDB'];

export const BAR_CHART_FILL = '#4575b4';
export const CHART_MISSING_FILL = '#bbbbbb';

export const DEFAULT_CHART_THEME: ChartTheme = {
  pie: {
    default: {
      fill: COLORS,
      other: CHART_MISSING_FILL,
    },
    new: {
      fill: NEW_CHART_COLORS,
      other: CHART_MISSING_FILL,
    },
  },
  bar: {
    default: {
      fill: [BAR_CHART_FILL],
      other: CHART_MISSING_FILL,
    },
    new: {
      fill: NEW_CHART_COLORS,
      other: CHART_MISSING_FILL,
    },
  },
  histogram: {
    default: {
      fill: [BAR_CHART_FILL],
      other: CHART_MISSING_FILL,
    },
  },
};

// ################### CHART STYLES ###################

// common
export const TOOLTIP_OTHER_PROPS: {
  wrapperStyle: CSS.Properties;
  allowEscapeViewBox: { x: boolean; y: boolean };
} = {
  wrapperStyle: {
    zIndex: 10,
    maxWidth: '240px',
  },
  allowEscapeViewBox: { x: true, y: true },
};

export const TOOLTIP_STYLE: CSS.Properties = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  padding: '5px',
  border: '1px solid #DDD',
  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  textAlign: 'left',
};

export const LABEL_STYLE: CSS.Properties = {
  fontWeight: 'bold',
  fontSize: '12px',
  padding: '0',
  margin: '0',
};

export const COUNT_STYLE: CSS.Properties = {
  fontWeight: 'normal',
  fontSize: '12px',
  padding: '0',
  margin: '0',
};

export const CHART_WRAPPER_STYLE: CSS.Properties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

// bar chart
export const TITLE_STYLE: CSS.Properties = {
  fontStyle: 'italic',
  fontSize: '1.5em',
  textAlign: 'center',
};

// pie chart
export const TEXT_STYLE: CSS.Properties = {
  fontSize: '11px',
  fill: '#333',
};
export const COUNT_TEXT_STYLE: CSS.Properties = {
  fontSize: '10px',
  fill: '#999',
};

// ################### CHART CONSTANTS ###################
// bar chart
export const MAX_TICK_LABEL_CHARS = 15;
export const UNITS_LABEL_OFFSET = -75;
export const TICKS_SHOW_ALL_LABELS_BELOW = 11; // Below this # of X-axis ticks, force-show all labels
export const TICK_MARGIN = 5; // vertical spacing between tick line and tick label

// pie chart
export const LABEL_THRESHOLD = 0.05;

// ################### UTIL CONSTANTS ###################
export const RADIAN = Math.PI / 180;
