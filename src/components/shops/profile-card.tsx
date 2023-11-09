import type { Shop } from "@prisma/client";
import Image from "next/image";
import type { FC } from "react";
import React from "react";

import { cn } from "~/utils/styles";

type IProps = Partial<Shop> & React.HTMLAttributes<HTMLDivElement>;

const ProfileCard: FC<IProps> = ({
  shopName,
  ownerName,
  bio,
  className,
  logoPhoto,
}) => {
  return (
    <div className={cn("flex w-10/12 items-center ", className)}>
      <div className="flex w-8/12 flex-col bg-slate-200 p-4 ">
        <h1 className="text-4xl font-semibold">{ownerName}</h1>
        <h2 className="text-2xl">{shopName}</h2>

        <p>{bio}</p>
      </div>

      <Image
        width={200}
        height={160}
        src={logoPhoto ?? ""}
        alt="Artisan logo or profile photo"
        className="aspect-[3/4] w-4/12 object-cover "
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
export default ProfileCard;
