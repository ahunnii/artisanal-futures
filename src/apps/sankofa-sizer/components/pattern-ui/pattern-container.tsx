import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { RndDragCallback, RndResizeCallback, Position } from 'react-rnd';
import { getStroke } from 'perfect-freehand';

interface ImageContainerProps {
  imageUrl: string;
}

function getSvgPathFromStroke(stroke) {
    if (!stroke.length) return ''
  
    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length]
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
        return acc
      },
      ['M', ...stroke[0], 'Q']
    )
  
    d.push('Z')
    return d.join(' ')
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageUrl }) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<{ width: string, height: string }>({ width: '100%', height: '100%' });
  const [originalSize, setOriginalSize] = useState<{ width: string, height: string }>({ width: '100%', height: '100%' });
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState([]);
  const [pathData, setPathData] = useState('');
  const svgRef = useRef(null);
  const pointsRef = useRef([]);


  useEffect(() => {
    if (svgRef.current) {
      const { width, height } = svgRef.current.getBoundingClientRect();
      setOriginalSize({ width, height });
    }
  }, [svgRef]);

  useEffect(() => {
    console.log('Running useEffect');
    const stroke = getStroke(pointsRef.current, {
      size: 16,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    });
    console.log('Stroke:', stroke);
    const newPathData = getSvgPathFromStroke(stroke);
    console.log('New Path Data:', newPathData);
    setPathData(newPathData);
  }, [points]); // Dependency on points will trigger the effect


  const handleDragStop: RndDragCallback = (e, d) => {
    setPosition({ x: d.x, y: d.y });
  };

  const handleResizeStop: RndResizeCallback = (e, direction, ref, delta, position) => {
    setSize({ width: ref.style.width, height: ref.style.height });
    setPosition({ x: position.x, y: position.y });
  };

  const handlePointerDown = (e) => {
    if (!isEditing) return;
    e.target.setPointerCapture(e.pointerId);
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    const newPoints = [[x, y, e.pressure]];
    pointsRef.current = newPoints;
    setPoints(newPoints);
  };
  
  const handlePointerMove = (e) => {
    if (!isEditing || e.buttons !== 1) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    const newPoints = [...pointsRef.current, [x, y, e.pressure]];
    pointsRef.current = newPoints;
    setPoints(newPoints);
  };

    const scale = {
    width: parseFloat(size.width) / parseFloat(originalSize.width),
    height: parseFloat(size.height) / parseFloat(originalSize.height),
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={isEditing}
        onChange={(e) => setIsEditing(e.target.checked)}
        aria-label="primary checkbox"
        style={{ left: '100px',top: '100px', position: 'absolute', zIndex: '300' }}
      />
      {isEditing && <div>Editing...</div>}
      {/**/}
      <Rnd
        size={size}
        position={position}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        disableDragging={isEditing}
        
        enableResizing={!isEditing}
        style={{ 
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            cursor: 'move',
            border: '1'
        }}
      >
        <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width="100dvw"
            height="100dvh"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            style={{ 
                border: '3px solid black',
                pointerEvents: 'auto'
            }}
        >
              <path d={pathData} />
        </svg>
      </Rnd>

    </div>
  );
};

export default ImageContainer;
