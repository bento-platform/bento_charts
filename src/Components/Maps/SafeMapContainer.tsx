import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { LeafletContext, createLeafletContext, type LeafletContextInterface } from '@react-leaflet/core';
import { Map as LeafletMap, type LatLngExpression } from 'leaflet';

interface SafeMapContainerProps {
  style?: CSSProperties;
  center: LatLngExpression;
  zoom: number;
  children?: ReactNode;
}

// react-leaflet's own MapContainer guards map creation with a useCallback(fn, [])-frozen
// `context === null` check, which React 18 Strict Mode's double-invoked ref callback defeats:
// the second invocation still sees the first render's stale `null` closure and constructs a
// second Leaflet map on the same DOM node, which throws. A plain effect doesn't have this
// problem, since Strict Mode runs its cleanup (map.remove()) before invoking the effect again.
// See https://github.com/PaulLeCam/react-leaflet/issues/1102
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
