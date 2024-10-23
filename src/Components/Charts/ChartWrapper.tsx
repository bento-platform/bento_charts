import { ForwardedRef, forwardRef, ReactNode } from 'react';
import { CHART_WRAPPER_STYLE } from '../../constants/chartConstants';

interface ChartWrapperProps {
  responsive: boolean;
  children: ReactNode;
}

const ChartWrapper = forwardRef(({ responsive, children }: ChartWrapperProps, ref: ForwardedRef<HTMLDivElement>) => (
  <div style={{ ...CHART_WRAPPER_STYLE, ...(responsive ? {} : { overflowX: 'auto', overflowY: 'hidden' }) }} ref={ref}>
    {children}
  </div>
));
ChartWrapper.displayName = 'ChartWrapper';

export default ChartWrapper;
