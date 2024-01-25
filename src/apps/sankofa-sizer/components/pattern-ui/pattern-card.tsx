import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "~/components/ui/card";
import styles from './Custom.module.css';

// Define the props interface
interface PatternCardProps {
  imageUrl: string;
}

const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg';

const PatternCard: React.FC<PatternCardProps> = ({ imageUrl }) => {
  const [imageSrc, setImageSrc] = useState(imageUrl || defaultImage);

  useEffect(() => {
    setImageSrc(imageUrl);
  }, [imageUrl]);

  return (
    <Card>
      <CardContent>
        <img src={imageSrc} className={styles.cardImage} alt="pattern" />
      </CardContent>
    </Card>
  );
};

export default PatternCard;