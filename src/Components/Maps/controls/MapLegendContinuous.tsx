import type { ControlPosition } from 'leaflet';
import { controlPositionClasses } from './utils';

export interface MapLegendDiscreteProps {
  position: ControlPosition;
  minValue: number;
  minColor: string;
  maxValue: number;
  maxColor: string;
}

const MapLegendContinuous = ({ position, minValue, minColor, maxValue, maxColor }: MapLegendDiscreteProps) => {
  return (
    <div className={controlPositionClasses[position]}>
      <div className="leaflet-control bento-charts--map--legend">
        <div className="bento-charts--map--legend--scale">
          <div
            className="bento-charts--continuous-scale"
            style={{ background: `linear-gradient(0deg, ${minColor} 0%, ${maxColor} 100%)` }}
          />
          <div className="bento-charts--map--legend--values">
            <span>{maxValue}</span>
            <span>{minValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegendContinuous;
