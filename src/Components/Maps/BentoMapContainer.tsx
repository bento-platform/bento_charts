import type { ReactNode } from 'react';
import { MapContainer } from 'react-leaflet';
import L, { Point } from 'leaflet';

import BentoOSMTileLayer from './BentoOSMTileLayer';
import type { BaseMapProps } from '../../types/mapTypes';

import iconPng from 'leaflet/dist/images/marker-icon.png';
import icon2XPng from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadowPng from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: iconPng,
  iconRetinaUrl: icon2XPng,
  iconSize: new Point(25, 41),
  iconAnchor: new Point(12, 41),
  popupAnchor: new Point(1, -41),
  shadowUrl: iconShadowPng,
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapContainerProps extends BaseMapProps {
  children: ReactNode;
}

const BentoMapContainer = ({ height, center, zoom, children, tileLayer }: MapContainerProps) => (
  <MapContainer style={{ height }} center={center} zoom={zoom}>
    {tileLayer ?? <BentoOSMTileLayer />}
    {children}
  </MapContainer>
);

export default BentoMapContainer;
