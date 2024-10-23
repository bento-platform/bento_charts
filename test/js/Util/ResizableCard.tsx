import { Card, Slider, Space } from 'antd';

const ResizableCard: React.FC<ResizableCardProps> = ({ title, sizeState, onSizeChange, children }) => {
  const onChangeWidth = (value: number) => {
    onSizeChange({ width: value, height: sizeState.height });
  };

  const onChangeHeight = (value: number) => {
    onSizeChange({ width: sizeState.width, height: value });
  };

  return (
    <Space direction="vertical">
      <div style={{ width: '500px' }}>
        <Slider min={50} max={800} onChange={onChangeWidth} value={sizeState.width + 50} />
        <Slider min={50} max={800} onChange={onChangeHeight} value={sizeState.height + 50} />
      </div>
      <Card title={title} style={sizeState}>
        {children}
      </Card>
    </Space>
  );
};

interface ResizableCardProps {
  title: string;
  sizeState: { width: number; height: number };
  onSizeChange: (size: { width: number; height: number }) => void;
  children?: React.ReactNode;
}

export default ResizableCard;
