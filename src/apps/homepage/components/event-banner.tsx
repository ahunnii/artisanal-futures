import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

const EventBanner = ({
  description,
  children,
}: {
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full cursor-pointer rounded-md bg-green-400/30 p-2 text-center font-medium shadow hover:bg-green-400/40">
          <p>
            {description} <strong>Click here for details!</strong>
          </p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="grid gap-4 py-4">
          {children}
          {/* <Image
            width={200}
            height={160}
            src={}
            alt="Details "
            className="aspect-auto w-full "
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          /> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventBanner;
