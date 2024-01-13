import Image, { type ImageProps } from "next/image";
import { useState, type FC } from "react";
import { cn } from "~/utils/styles";

interface IProps extends ImageProps {
  src: string;
}

const BlurImage: FC<IProps> = ({ src, ...props }) => {
  const [isLoading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      {...props}
      src={imgSrc}
      fill
      priority
      alt=""
      onError={() => setImgSrc("/background-fallback.jpg")}
      className={cn(
        "duration-700 ease-in-out",
        isLoading
          ? "scale-100 blur-xl grayscale"
          : "scale-100 blur-0 grayscale-0"
      )}
      onLoadingComplete={() => setLoading(false)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};

export default BlurImage;
// "scale-110 blur-2xl grayscale"
