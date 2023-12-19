import Image, { type ImageProps } from "next/image";
import React, { useEffect, useState } from "react";
import wait from "waait";
import { cn } from "~/utils/styles";

interface ImageCrossFadeProps extends ImageProps {
  src: string;
  width: number;
  height: number;
}

const ImageCrossFade = ({
  src,
  width,
  height,
  alt,
  sizes,
  className,
}: ImageCrossFadeProps) => {
  const [fadeIn, setFadeIn] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadedImage, setLoadedImage] = useState<string>(src);

  useEffect(() => {
    setLoaded(false);
    setFadeIn(true);
  }, [src]);

  return (
    <>
      {fadeIn && (
        <Image
          onLoadingComplete={() => {
            setLoaded(true);
            void wait(1100).then(() => {
              setLoadedImage(src);
            });
          }}
          alt={alt}
          src={src}
          priority
          width={width}
          height={height}
          sizes={sizes}
          className={cn(
            `transition-opacity duration-1000`,
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      )}
      {loadedImage && (
        <Image
          onLoadingComplete={() => {
            setFadeIn(false);
          }}
          alt=""
          src={loadedImage}
          priority
          width={width}
          height={height}
          className={`w-full`}
        />
      )}
    </>
  );
};

export default React.memo(ImageCrossFade);
