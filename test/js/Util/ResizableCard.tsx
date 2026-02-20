import type { ReactNode } from 'react';
import { Card, Flex, Slider, Space } from 'antd';

const ResizableCard = ({ title, sizeState, onSizeChange, children }: ResizableCardProps) => {
  const onChangeWidth = (value: number) => {
    onSizeChange({ width: value, height: sizeState.height });
  };

  const onChangeHeight = (value: number) => {
    onSizeChange({ width: sizeState.width, height: value });
  };

  return (
    <Space orientation="vertical">
      <Flex vertical={true} style={{ width: 500 }}>
        <Flex align="center">
          <label style={{ width: 60 }}>Width:</label>
          <Slider min={50} max={800} onChange={onChangeWidth} value={sizeState.width + 50} style={{ flex: 1 }} />
        </Flex>
        <Flex align="center">
          <label style={{ width: 60 }}>Height:</label>
          <Slider min={50} max={800} onChange={onChangeHeight} value={sizeState.height + 50} style={{ flex: 1 }} />
        </Flex>
      </Flex>
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
  children?: ReactNode;
}

export default ResizableCard;
