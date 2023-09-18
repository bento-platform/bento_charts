import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GeoJSON, MapContainer, Popup } from 'react-leaflet';
import { interpolateRgb } from 'd3-interpolate';
import type { MapControlPosition, ChoroplethMapProps } from '../../types/chartTypes';
import BentoOSMTileLayer from '../BentoOSMTileLayer';

import type { Feature as GeoJSONFeatureType } from 'geojson';
import type { PathOptions, GeoJSON as LeafletGeoJSON, LeafletMouseEvent, LeafletEventHandlerFnMap } from 'leaflet';
import MapLegendContinuous from './controls/MapLegendContinuous';

const DEFAULT_CATEGORY = '';
const POS_BOTTOM_RIGHT: MapControlPosition = ['bottom', 'right'];

const BentoChoroplethMap = ({
  data,
  height,
  center,
  zoom,
  colorMode,
  features,
  categoryProp,
  onClick,
}: ChoroplethMapProps) => {
  const dataByFeatureCat = useMemo(() => Object.fromEntries(data.map((d) => [d.x, d.y])), [data]);

  const minYVal = useMemo(() => Math.min(...data.map((d) => d.y)), [data]);
  const maxYVal = useMemo(() => Math.max(...data.map((d) => d.y)), [data]);

  const interpolator = useMemo(() => interpolateRgb(colorMode.minColor, colorMode.maxColor), [colorMode]);

  const calculateColor = useCallback(
    (v: number | undefined): string => interpolator(((v ?? minYVal) - minYVal) / (maxYVal - minYVal)),
    [interpolator, minYVal, maxYVal]
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
    [data, features]
  );

  const [popupContents, setPopupContents] = useState<React.ReactNode | null>(null);

  const eventHandlers = useMemo(
    () =>
      ({
        click: (e: LeafletMouseEvent) => {
          const feature = e.sourceTarget.feature as GeoJSONFeatureType;
          const fProps = feature.properties ?? {};
          const title = fProps.title ? `${fProps.title} (${fProps[categoryProp]})` : fProps[categoryProp];
          setPopupContents(
            <div>
              {onClick ? (
                <a
                  href="#"
                  onClick={() => {
                    if (onClick) onClick(feature);
                  }}
                >
                  {title}
                </a>
              ) : (
                <span>{title}</span>
              )}
            </div>
          );
        },
      } as LeafletEventHandlerFnMap),
    [onClick, categoryProp]
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
    <div>
      <MapContainer style={{ height }} center={center} zoom={zoom}>
        <BentoOSMTileLayer />
        <GeoJSON ref={geoJsonLayer} data={features} style={shapeStyle} eventHandlers={eventHandlers}>
          <Popup>{popupContents}</Popup>
        </GeoJSON>
        <MapLegendContinuous
          position={POS_BOTTOM_RIGHT}
          minColor={colorMode.minColor}
          minValue={minYVal}
          maxColor={colorMode.maxColor}
          maxValue={maxYVal}
        />
      </MapContainer>
    </div>
  );
};

export default BentoChoroplethMap;