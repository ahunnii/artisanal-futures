import type { Shop } from "@prisma/client";

import Image from "next/image";
import type { FC } from "react";
import React from "react";

import { cn } from "~/utils/styles";
import { ProfileContactBar } from "./profile-contact-bar";

type IProps = Partial<Shop> & React.HTMLAttributes<HTMLDivElement>;

const ProfileCard: FC<IProps> = ({
  shopName,
  ownerName,
  bio,
  className,
  logoPhoto,
  ownerPhoto,
  email,
  website,
  phone,
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center lg:w-10/12 lg:flex-row",
        className
      )}
    >
      <div className="flex w-full flex-col gap-y-2 p-4  lg:w-8/12">
        <div className="flex flex-col bg-slate-200 p-4 ">
          <h1 className="text-4xl font-semibold">{ownerName}</h1>
          <h2 className="text-2xl">{shopName}</h2>
          <p>{bio}</p>
        </div>
        <ProfileContactBar email={email} website={website} phone={phone} />
      </div>

      <Image
        width={200}
        height={160}
        src={logoPhoto ?? ownerPhoto ?? "/placeholder-image.webp"}
        alt="Artisan logo or profile photo"
        className="aspect-[3/4] w-4/12 rounded-md object-cover shadow-md"
        priority
        blurDataURL={logoPhoto ?? ownerPhoto ?? "/placeholder-image.webp"}
        placeholder="blur"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
export default ProfileCard;
