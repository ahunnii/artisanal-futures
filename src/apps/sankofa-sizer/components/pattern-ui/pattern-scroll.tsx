import React, { useState } from 'react';
import { 
    Carousel, 
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "~/components/ui/carousel"
import { Card, CardContent } from "~/components/ui/card"
import { useDropzone } from 'react-dropzone';

const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg';

const PatternScroll = () => {
  const [images, setImages] = useState([defaultImage]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
        'image/png': ['.png'],
        'image/jpg': ['.jpg'],
        'image/jpeg': ['.jpeg'],
        'text/html': ['.html', '.htm'],
        },
    onDrop: acceptedFiles => {
      setImages(prev => [...prev, ...acceptedFiles.map(file => URL.createObjectURL(file))]);
    }
  });
/*
      <Carousel
        opts={{
          align: "start",
          loop: true
        }}
        orientation="vertical"
        className="w-full max-w-xs"
      >
        <CarouselContent className="-ml-4">
          {images.map((img, index) => (
                <CarouselItem key={index} className="pl-4">
                    <img src={img} width="15%" alt="pattern" />
                </CarouselItem>

          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      </div>

    <div {...getRootProps()} className="dropzone">    
        <input {...getInputProps()} />
    </div>
*/

  return (

    <Carousel 
        opts={{
            align: "center",
            loop: true,
            visibleSlides: 3,
            slidePadding: 15
            }}
        orientation="horizontal"
        className="w-full max-w-xs">
        <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                <div className="p-1">
                    <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                            <div {...getRootProps()} className="dropzone">
                            <img src={defaultImage} width="25%" alt="pattern" />
                                <input {...getInputProps()} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
    </Carousel>

  );
};

export default PatternScroll;
