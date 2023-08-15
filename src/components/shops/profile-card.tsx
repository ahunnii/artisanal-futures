import type { FC } from "react";
import React from "react";
import type { Profile } from "~/types";
import { cn } from "~/utils/styles";

type IProps = Profile & React.HTMLAttributes<HTMLDivElement>;

const ProfileCard: FC<IProps> = ({
  id,
  business_name,
  owner_name,
  bio,
  profile_photo,
  website,
  className,
}) => {
  return (
    <div className={cn("flex w-10/12 items-center ", className)}>
      <div className="flex w-8/12 flex-col bg-slate-200 p-4 ">
        <h1 className="text-4xl font-semibold">{owner_name}</h1>
        <h2 className="text-2xl">{business_name}</h2>

        <p>{bio}</p>
      </div>

      <img
        src={profile_photo}
        alt=""
        className="aspect-[3/4] w-4/12 object-cover "
      />
    </div>
  );
};
export default ProfileCard;
