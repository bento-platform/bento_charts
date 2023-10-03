import { CHART_WRAPPER_STYLE } from '../../constants/chartConstants';
import { ForwardedRef, forwardRef, ReactNode } from 'react';

interface ChartWrapperProps {
  children: ReactNode;
}

const ChartWrapper = forwardRef(({children}: ChartWrapperProps, ref: ForwardedRef<HTMLDivElement>) => (
  <div style={CHART_WRAPPER_STYLE} ref={ref}>
    {children}
  </div>
));

export default ChartWrapper;