import { ReactElement, ReactNode } from 'react';
import type { Feature as GeoJSONFeatureType } from 'geojson';

import { BaseCategoricalChartProps, BaseChartComponentProps } from './chartTypes';
import type { GeoJSONPolygonOnlyFeatureCollection } from './geoJSONTypes';

export interface GeoPointDataItem {
  coordinates: [number, number];
  title: string;
}

type PointMapOnClick = (point: GeoPointDataItem) => void;

type GeoJSONShapeOnClick = (shape: GeoJSONFeatureType) => void;

export interface BaseMapProps extends BaseChartComponentProps {
  center: [number, number];
  zoom: number;
  tileLayer?: ReactElement;
}

export interface PointMapProps extends BaseMapProps {
  data: GeoPointDataItem[];
  onClick?: PointMapOnClick;
  renderPopupBody?: (p: GeoPointDataItem) => ReactNode;
}

export interface MapDiscreteLegendItem {
  color: string | undefined;
  label: string;
}

export interface ChoroplethMapColorModeContinuous {
  mode: 'continuous';
  minColor: string;
  maxColor: string;
}

export interface ChoroplethMapColorModeDiscrete {
  mode: 'discrete';
  colorFunction: (x: number | undefined) => string;
  legendItems: MapDiscreteLegendItem[];
}

// heatmaps are 'categorical' + geographical:
export interface ChoroplethMapProps extends BaseCategoricalChartProps, BaseMapProps {
  features: GeoJSONPolygonOnlyFeatureCollection;
  colorMode: ChoroplethMapColorModeContinuous | ChoroplethMapColorModeDiscrete;
  categoryProp: string;
  onClick?: GeoJSONShapeOnClick;
  renderPopupBody?: (f: GeoJSONFeatureType, d?: number, dCtx?: number) => ReactNode;
}
