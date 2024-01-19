// ImageDisplay.tsx
import React from 'react';
import styles from './Custom.module.css';

interface ImageDisplayProps {
  items: { id: number; imageUrl: string }[];
  currentIndex: number;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ items, currentIndex }) => {
  const currentItem = items[currentIndex];

  return (
    <div className={styles.imageDisplay}>
      {currentItem && <img src={currentItem.imageUrl} alt={`Item ${currentItem.id}`} />}
    </div>
  );
};
export default ImageDisplay;
