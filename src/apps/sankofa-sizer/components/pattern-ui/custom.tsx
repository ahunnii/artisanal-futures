import React, { useState, useRef, useEffect } from 'react';
import PatternCard from './pattern-card';
import ImageDisplay from './ImageDisplay';
import styles from './Custom.module.css';

interface CarouselItem {
  id: number;
  imageUrl: string;
}

const Carousel: React.FC = () => {
  // Each item now has an id and a default image URL
  const initialItems = [
    { id: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg' },
    { id: 2, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg' },
    { id: 3, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg' }
  ];

  const itemHeight = 100; // Height of each item in pixels
  const [items, setItems] = useState<CarouselItem[]>(initialItems);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  const getDisplayedItems = () => {
    const totalItems = items.length;
    let displayItems = [];

    // Calculate previous, current, and next items indices
    const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
    const nextIndex = (currentIndex + 1) % totalItems;

    // Add items in order: previous, current, next
    displayItems.push(items[prevIndex]);
    displayItems.push(items[currentIndex]);
    displayItems.push(items[nextIndex]);

    return displayItems;
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const offset = (carouselRef.current.offsetHeight - itemHeight) / 2;
      carouselRef.current.scrollTop = itemHeight - offset;
    }
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => {
      return prevIndex === 0 ? items.length - 1 : prevIndex - 1;
    });
  };

  const displayedItems = getDisplayedItems();

  return (
    <div className={styles.parentContainer}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        className={styles.carouselContainer}
      >
        <button className={styles.arrowButton} onClick={handlePrev}>
          <div className={styles.arrowIcon}></div>
        </button>
        <div
          ref={carouselRef}
          className={styles.carouselContainer}
          style={{
            height: itemHeight + 45,
            overflowY: 'hidden',
          }}
        >
          {displayedItems.map((item) => (
            item && (
              <div key={item.id} className={styles.card}>
                <PatternCard
                  imageUrl={item.imageUrl}
                  onImageUpdate={(newUrl) => {
                    const updatedItems = items.map(it => 
                      it.id === item.id ? { ...it, imageUrl: newUrl } : it
                    );
                    setItems(updatedItems);
                  }}
                />
                Item {item.id}
              </div>
            )
          ))}
        </div>
        <button className={styles.arrowButton} onClick={handleNext}>
          <div className={`${styles.arrowIcon} ${styles.down}`}></div>
        </button>
      </div>

      <ImageDisplay items={items} currentIndex={currentIndex} />

    </div>
  );
};

export default Carousel;
