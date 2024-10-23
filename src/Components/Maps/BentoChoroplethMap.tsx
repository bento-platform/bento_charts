import { type ReactNode, Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GeoJSON, Popup } from 'react-leaflet';
import { interpolateRgb } from 'd3-interpolate';
import type { Feature as GeoJSONFeatureType } from 'geojson';
import type {
  ControlPosition,
  GeoJSON as LeafletGeoJSON,
  LeafletMouseEvent,
  LeafletEventHandlerFnMap,
  PathOptions,
} from 'leaflet';

import type { ChoroplethMapProps } from '../../types/mapTypes';

import BentoMapContainer from './BentoMapContainer';
import MapLegendContinuous from './controls/MapLegendContinuous';
import MapLegendDiscrete from './controls/MapLegendDiscrete';
import { useTransformedChartData } from '../../util/chartUtils';

const DEFAULT_CATEGORY = '';
const POS_BOTTOM_RIGHT: ControlPosition = 'bottomright';

const BentoChoroplethMap = ({
  height,
  center,
  zoom,
  tileLayer,
  colorMode,
  features,
  categoryProp,
  onClick,
  renderPopupBody,
  ...params
}: ChoroplethMapProps) => {
  const data = useTransformedChartData(params);

  const dataByFeatureCat = useMemo(() => Object.fromEntries(data.map((d) => [d.x, d.y])), [data]);

  const minYVal = useMemo(() => Math.min(...data.map((d) => d.y)), [data]);
  const maxYVal = useMemo(() => Math.max(...data.map((d) => d.y)), [data]);

  const calculateColor = useCallback(
    (v: number | undefined): string =>
      colorMode.mode === 'continuous'
        ? interpolateRgb(colorMode.minColor, colorMode.maxColor)(((v ?? minYVal) - minYVal) / (maxYVal - minYVal))
        : colorMode.colorFunction(v),
    [colorMode, minYVal, maxYVal]
  );

  const shapeStyle = useCallback(
    (f: GeoJSONFeatureType): PathOptions => {
      const fProps = f.properties ?? {};
      if (!Object.keys(fProps).includes(categoryProp)) {
        console.warn(`Feature is missing category prop ${categoryProp}`, f);
      }
      const cat: string = fProps[categoryProp] ?? DEFAULT_CATEGORY;
      return {
        color: 'white',
        weight: 2,
        fillColor: calculateColor(dataByFeatureCat[cat]),
        fillOpacity: 1, // actual opacity set by fillColor
      };
    },
    [calculateColor, categoryProp, dataByFeatureCat]
  );

  const [popupContents, setPopupContents] = useState<ReactNode | null>(null);

  const eventHandlers = useMemo(
    () =>
      ({
        click: (e: LeafletMouseEvent) => {
          const feature = e.sourceTarget.feature as GeoJSONFeatureType;
          const fProps = feature.properties ?? {};
          const title = fProps.title ? `${fProps.title} (${fProps[categoryProp]})` : fProps[categoryProp];
          setPopupContents(
            <div>
              <h4 style={{ marginBottom: renderPopupBody ? 6 : 0 }}>
                {onClick ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      if (onClick) onClick(feature);
                      e.preventDefault();
                    }}
                  >
                    {title}
                  </a>
                ) : (
                  <span>{title}</span>
                )}
              </h4>
              {renderPopupBody ? renderPopupBody(feature, dataByFeatureCat[fProps[categoryProp]]) : null}
            </div>
          );
        },
      }) as LeafletEventHandlerFnMap,
    [onClick, categoryProp, dataByFeatureCat, renderPopupBody]
  );

  const geoJsonLayer: Ref<LeafletGeoJSON> = useRef(null);
  useEffect(() => {
    // Bizarre workaround needed for react-leaflet when handling `features` change:
    // See https://github.com/PaulLeCam/react-leaflet/issues/332#issuecomment-731379795
    if (geoJsonLayer.current) {
      geoJsonLayer.current.clearLayers().addData(features);
    }
  }, [features]);

  return (
    <BentoMapContainer height={height} center={center} zoom={zoom} tileLayer={tileLayer}>
      <GeoJSON ref={geoJsonLayer} data={features} style={shapeStyle} eventHandlers={eventHandlers}>
        <Popup>{popupContents}</Popup>
      </GeoJSON>
      {colorMode.mode === 'continuous' ? (
        <MapLegendContinuous
          position={POS_BOTTOM_RIGHT}
          minColor={colorMode.minColor}
          minValue={minYVal}
          maxColor={colorMode.maxColor}
          maxValue={maxYVal}
        />
      ) : (
        <MapLegendDiscrete position={POS_BOTTOM_RIGHT} legendItems={colorMode.legendItems} />
      )}
    </BentoMapContainer>
  );
};

export default BentoChoroplethMap;
