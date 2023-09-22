import type { Shop } from "@prisma/client";
import { Store, User } from "lucide-react";

import type { FC } from "react";
import BlurImage from "../ui/blur-image";

const ShopCard: FC<Shop> = ({
  id,
  ownerName,
  shopName,
  website,
  logoPhoto,
  bio,
  ownerPhoto,
}) => {
  return (
    <div className="w-full rounded bg-slate-50 p-4 shadow">
      <div className="relative aspect-square w-full">
        <BlurImage src={logoPhoto ?? ""} alt="" />
      </div>

      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{ownerName}</h3>
          <p className="font-normal text-slate-500">{shopName}</p>
        </div>

        <div>
          {bio && ownerPhoto && (
            <a
              className="block rounded bg-slate-400 p-2 text-white"
              href={`/shops/${id}`}
              aria-label="Head to artisan profile"
            >
              <User />
            </a>
          )}

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

export default ShopCard;
