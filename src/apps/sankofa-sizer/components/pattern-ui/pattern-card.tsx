import React from 'react';
import { Card, CardContent } from "~/components/ui/card";
import { useDropzone } from 'react-dropzone';
import styles from './Custom.module.css';

// Define the props interface
interface PatternCardProps {
  imageUrl: string;
  onImageUpdate: (newUrl: string) => void;
}

const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg';

const PatternCard: React.FC<PatternCardProps> = ({ imageUrl, onImageUpdate }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: acceptedFiles => {
      if (acceptedFiles[0]) {
        const newImageUrl = URL.createObjectURL(acceptedFiles[0]);
        onImageUpdate(newImageUrl);
      }
    }
  });

  return (
    <Card>
      <CardContent {...getRootProps()} style={{ cursor: 'pointer' }}>
        <input {...getInputProps()} />
        <img src={imageUrl} className={styles.cardImage} alt="pattern" />
      </CardContent>
    </Card>
  );
};

export default PatternCard;
