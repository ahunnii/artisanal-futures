import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { RndDragCallback, RndResizeCallback, Position, ResizableDelta } from 'react-rnd';

interface ImageContainerProps {
  imageUrl: string;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageUrl }) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<{ width: string, height: string }>({ width: '100%', height: '100%' });
  const [originalSize, setOriginalSize] = useState<{ width: string, height: string }>({ width: '100%', height: '100%' });
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      const { width, height } = svgRef.current.getBoundingClientRect();
      setOriginalSize({ width, height });
    }
  }, [svgRef]);

  const handleDragStop: RndDragCallback = (e, d) => {
    setPosition({ x: d.x, y: d.y });
  };

  const handleResizeStop: RndResizeCallback = (e, direction, ref, delta, position) => {
    setSize({ width: ref.style.width, height: ref.style.height });
    setPosition({ x: position.x, y: position.y });
  };

  const scale = {
    width: parseFloat(size.width) / parseFloat(originalSize.width),
    height: parseFloat(size.height) / parseFloat(originalSize.height),
  };

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', cursor: 'move', border: '1' }}
    >
        Hei
        <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width={48 * scale.width}
            height={48 * scale.height}
            fill="currentColor"
            viewBox="0 0 16 16"
      >
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
      </svg>

    </Rnd>
  );
};

export default ImageContainer;
