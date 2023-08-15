import { cn } from "~/utils/styles";

const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("mx-auto h-full w-full max-w-7xl", className)}>
      {children}
    </div>
  );
};

export default Container;
