import React, { ForwardedRef, forwardRef, ReactNode } from 'react';
import { CHART_WRAPPER_STYLE } from '../../constants/chartConstants';

interface ChartWrapperProps {
  children: ReactNode;
}

const ChartWrapper = forwardRef(({ children }: ChartWrapperProps, ref: ForwardedRef<HTMLDivElement>) => (
  <div style={CHART_WRAPPER_STYLE} ref={ref}>
    {children}
  </div>
));
ChartWrapper.displayName = 'ChartWrapper';

export default ChartWrapper;
