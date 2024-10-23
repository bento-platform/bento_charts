import type { ControlPosition } from 'leaflet';
import type { MapDiscreteLegendItem } from '../../../types/mapTypes';
import { controlPositionClasses } from './utils';

export interface MapLegendDiscreteProps {
  position: ControlPosition;
  legendItems: MapDiscreteLegendItem[];
}

const MapLegendDiscrete = ({ position, legendItems }: MapLegendDiscreteProps) => {
  return (
    <div className={controlPositionClasses[position]}>
      <div className="leaflet-control bento-charts--map--legend">
        <ul>
          {legendItems.map(({ label, color }, i) => (
            <li key={i}>
              <span
                className="bento-charts--map--legend--patch"
                style={{ backgroundColor: color ?? `rgba(255, 255, 255, 0)` }}
              />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapLegendDiscrete;
