import { TileLayer } from 'react-leaflet';
import { OSM_TILE_LAYER_ATTRIBUTION, OSM_TILE_LAYER_TEMPLATE } from '../../constants/mapConstants';

const BentoOSMTileLayer = () => <TileLayer attribution={OSM_TILE_LAYER_ATTRIBUTION} url={OSM_TILE_LAYER_TEMPLATE} />;

export default BentoOSMTileLayer;
