const NoData = ({ height }: NoDataProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `${height}px`,
        width: '100%',
      }}
    >
      No Data
    </div>
  );
};

interface NoDataProps {
  height: number;
}

export default NoData;
