import React, { useState, useEffect } from 'react';
import styles from './Custom.module.css';
import ImageContainer from './pattern-container'

const emojis = [
  ["../img/pattern_icon.png", "Pattern 1"],
  ["../img/pattern_icon.png", "Pattern 2"],
  ["../img/pattern_icon.png", "Pattern 3"],
  ["../img/pattern_icon.png", "Pattern 4"],
  ["../img/pattern_icon.png", "Pattern 5"],
];

const PatternCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageUpdate, setImageUpdate] = useState(0);

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % emojis.length);
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + emojis.length) % emojis.length);
  };

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (typeof index === 'number' && index >= 0 && index < emojis.length) {
        if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result && emojis[index]) {
                emojis[index][0] = reader.result as string;
                setImageUpdate(imageUpdate + 1); // Force re-render
            }
        };
        if (file) {
            reader.readAsDataURL(file);
        }
        }
    }
  };

  const itemTransform = (index: number) => {
    const distanceFromActive = index - activeIndex;
    const scale = 1 - 0.1 * Math.abs(distanceFromActive); 
    const translateY = distanceFromActive * 100;
    return `translate(-50%, ${translateY}px) scale(${scale})`;
  };

  const calculateZIndex = (index: number) => {
    const distanceFromActive = Math.abs(index - activeIndex);
    return emojis.length - distanceFromActive;
  };

  return (
    <div className={styles.wrapper}>
                <button onClick={goToPrev}>Previous</button>
        <button onClick={goToNext}>Next</button>

      <div className={styles.carousel}>
        {emojis.map((emoji, index) => (
          <div
            key={index}
            className={`${styles.carouselItem} ${index === activeIndex ? styles.active : ''}`}
            style={{
                transform: itemTransform(index),
                zIndex: calculateZIndex(index) 
              }}
            onClick={() => handleItemClick(index)}
          >
            <div className={styles.carouselItemHead}>
              <img src={emoji[0]} alt={emoji[1]} key={imageUpdate} />
            </div>
            <div className={styles.carouselItemBody}>
              <p className={styles.title}>{emoji[1]}</p>
              <input type="file" onChange={(event) => handleImageUpload(event, index)} />
            </div>
          </div>
        ))}
      </div>

        <ImageContainer 
            imageUrl={emojis[activeIndex][0]}
        />
      </div>
  );
}

export default PatternCarousel;