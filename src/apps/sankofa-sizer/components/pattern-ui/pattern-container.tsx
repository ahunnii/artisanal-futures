import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { RndDragCallback, RndResizeCallback, Position, ResizableDelta } from 'react-rnd';

interface ImageContainerProps {
  imageUrl: string;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageUrl }) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<{ width: string, height: string }>({ width: '100%', height: '100%' });

  const handleDragStop: RndDragCallback = (e, d) => {
    setPosition({ x: d.x, y: d.y });
  };

  const handleResizeStop: RndResizeCallback = (e, direction, ref, delta, position) => {
    setSize({ width: ref.style.width, height: ref.style.height });
    setPosition({ x: position.x, y: position.y });
  };

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', cursor: 'move', border: '1' }}
    />
  );
};

export default ImageContainer;
