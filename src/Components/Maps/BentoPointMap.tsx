import { Marker, Popup } from 'react-leaflet';
import BentoMapContainer from './BentoMapContainer';
import type { PointMapProps } from '../../types/mapTypes';

const BentoPointMap = ({ height, center, zoom, tileLayer, data, onClick, renderPopupBody }: PointMapProps) => {
  return (
    <BentoMapContainer height={height} center={center} zoom={zoom} tileLayer={tileLayer}>
      {data.map((point, i) => {
        const { coordinates, title } = point;

        // We expect points in [long, lat] order (consistent with GeoJSON), but Leaflet wants them in [lat, long].
        const coordinatesLatLongOrder: [number, number] = [coordinates[1], coordinates[0]];

        return (
          <Marker key={i} position={coordinatesLatLongOrder}>
            <Popup>
              <h4 style={{ marginBottom: renderPopupBody ? 6 : 0 }}>
                {onClick ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      onClick(point);
                      e.preventDefault();
                    }}
                  >
                    {title}
                  </a>
                ) : (
                  <>{title}</>
                )}
              </h4>
              {renderPopupBody ? renderPopupBody(point) : null}
            </Popup>
          </Marker>
        );
      })}
    </BentoMapContainer>
  );
};

export default BentoPointMap;
