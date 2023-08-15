import { Store, User } from "lucide-react";
import type { FC } from "react";
import type { Shop } from "~/types";

const ArtisanCard: FC<Shop> = ({
  id,
  owner_name,
  business_name,
  website,
  cover_photo,
}) => {
  return (
    <div className="w-full rounded bg-slate-50 p-4 shadow">
      <img src={cover_photo} alt="" className="aspect-square object-cover" />

      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{owner_name}</h3>
          <p className="font-normal text-slate-500">{business_name}</p>
        </div>

        <div>
          <a
            className="block rounded bg-slate-400 p-2 text-white"
            href={`/shops/${id}`}
            aria-label="Head to artisan profile"
          >
            <User />
          </a>
          {website && (
            <a
              className="block rounded bg-slate-500 p-2 text-white"
              href={website}
              aria-label="Head to artisan profile"
            >
              <Store />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanCard;
