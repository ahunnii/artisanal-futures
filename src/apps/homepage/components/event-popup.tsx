import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

//Intended to be used on the homepage to expand additional details about an artisan's event
const EventPopup = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <strong className="cursor-pointer hover:text-slate-700">
          Click here for details!
        </strong>
      </DialogTrigger>
      <DialogContent>
        <div className="grid gap-4 py-4">
          <Image
            width={200}
            height={160}
            src={imageUrl}
            alt="Details "
            className="aspect-auto w-full "
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventPopup;
