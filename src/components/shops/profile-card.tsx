import { Shop } from "@prisma/client";
import type { FC } from "react";
import React from "react";
import type { Profile } from "~/types";
import { cn } from "~/utils/styles";

type IProps = Shop & React.HTMLAttributes<HTMLDivElement>;

const ProfileCard: FC<IProps> = ({
  id,
  shopName,
  ownerName,
  bio,
  ownerPhoto,
  website,
  className,
}) => {
  return (
    <div className={cn("flex w-10/12 items-center ", className)}>
      <div className="flex w-8/12 flex-col bg-slate-200 p-4 ">
        <h1 className="text-4xl font-semibold">{ownerName}</h1>
        <h2 className="text-2xl">{shopName}</h2>

        <p>{bio}</p>
      </div>

      <img
        src={ownerPhoto ?? ""}
        alt=""
        className="aspect-[3/4] w-4/12 object-cover "
      />
    </div>
  );
};
export default ProfileCard;
