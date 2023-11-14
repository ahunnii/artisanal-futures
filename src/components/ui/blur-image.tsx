import Image, { type ImageProps } from "next/image";
import { useState, type FC } from "react";
import { cn } from "~/utils/styles";

interface IProps extends ImageProps {
  src: string;
}

const BlurImage: FC<IProps> = ({ src, ...props }) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      {...props}
      src={src}
      fill
      objectFit="cover"
      alt=""
      className={cn(
        "duration-700 ease-in-out",
        isLoading
          ? "scale-100 blur-xl grayscale"
          : "scale-100 blur-0 grayscale-0"
      )}
      onLoadingComplete={() => setLoading(false)}
    />
  );
};

export default BlurImage;
// "scale-110 blur-2xl grayscale"
