import type { Shop } from "@prisma/client";
import type { FC } from "react";
import React from "react";

import { cn } from "~/utils/styles";

type IProps = Shop & React.HTMLAttributes<HTMLDivElement>;

const ProfileCard: FC<IProps> = ({
  shopName,
  ownerName,
  bio,
  ownerPhoto,

  className,
}) => {
  return (
    <div className={cn("flex w-10/12 items-center ", className)}>
      <div className="flex w-8/12 flex-col bg-slate-200 p-4 ">
        <h1 className="text-4xl font-semibold">{ownerName}</h1>
        <h2 className="text-2xl">{shopName}</h2>

        <p>{bio}</p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ownerPhoto ?? ""}
        alt=""
        className="aspect-[3/4] w-4/12 object-cover "
      />
    </div>
  );
};
export default ProfileCard;
