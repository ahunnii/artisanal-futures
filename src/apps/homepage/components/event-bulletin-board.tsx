import EventBulletinCard from "./event-bulletin-card";

export type BulletinBoardEvent = {
  imageUrl: string;
};

const EventBulletinBoard = ({
  upcomingEvents,
}: {
  upcomingEvents: BulletinBoardEvent[];
}) => {
  return (
    <>
      <h1 className="mt-12  px-4 pt-4 text-2xl font-semibold">
        Artisan Bulletin Board
      </h1>
      <p className="mb-3  px-4 text-muted-foreground">
        Check out current and upcoming events, workshops, and other cool stuff
      </p>

      <div className=" rounded border border-slate-200 shadow-inner">
        {upcomingEvents?.length === 0 ? (
          <p className="p-4 font-bold text-muted-foreground">
            Nothing new yet, but check back later!
          </p>
        ) : (
          <div className=" grid grid-cols-2 gap-5 p-4 md:grid-cols-3 md:gap-10">
            {upcomingEvents.map((item, idx) => (
              <EventBulletinCard imageUrl={item.imageUrl} key={idx} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EventBulletinBoard;
