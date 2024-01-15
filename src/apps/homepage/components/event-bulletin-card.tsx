import Image from "next/image";

const EventBulletinCard = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <Image
      width={200}
      height={160}
      src={imageUrl}
      alt="Details on a new or upcoming event"
      className="aspect-auto w-full "
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};
export default EventBulletinCard;
