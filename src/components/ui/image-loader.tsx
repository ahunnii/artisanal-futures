import { Skeleton } from "~/components/ui/skeleton";

const ImageLoader = () => {
  return (
    <div className="flex ">
      <Skeleton className="h-[200px] w-[200px] rounded bg-slate-300/75" />
    </div>
  );
};
export default ImageLoader;
