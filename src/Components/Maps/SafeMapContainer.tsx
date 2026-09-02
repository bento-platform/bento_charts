import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { LeafletContext, createLeafletContext, type LeafletContextInterface } from '@react-leaflet/core';
import { Map as LeafletMap, type LatLngExpression } from 'leaflet';

interface SafeMapContainerProps {
  style?: CSSProperties;
  center: LatLngExpression;
  zoom: number;
  children?: ReactNode;
}

// Works around react-leaflet 4.2.1's MapContainer double-initializing its Leaflet map under
// Strict Mode (stale useCallback closure survives the double-invoked ref): see
// https://github.com/PaulLeCam/react-leaflet/issues/1102. A plain effect avoids this since
// Strict Mode's cleanup (map.remove()) runs before the effect re-fires.
// TODO: drop this file, BentoMapContainer's use of it, and the explicit @react-leaflet/core
// peerDependency once react-leaflet <5 support is dropped (planned alongside the React 18 -> 19
// bump) — react-leaflet 5.0.0's MapContainer already fixes this with a ref-based guard.
const SafeMapContainer = ({ style, center, zoom, children }: SafeMapContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [context, setContext] = useState<LeafletContextInterface | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const map = new LeafletMap(node).setView(center, zoom);
    setContext(createLeafletContext(map));

    return () => {
      map.remove();
      setContext(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={style} ref={containerRef}>
      {context ? <LeafletContext.Provider value={context}>{children}</LeafletContext.Provider> : null}
    </div>
  );
};

export default SafeMapContainer;
