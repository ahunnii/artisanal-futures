import type { Shop } from "@prisma/client";
import { Globe, Mail, Phone } from "lucide-react";
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
  ownerPhoto,
  email,
  website,
  phone,
  // address,
  // city,
  // state,
  // zip,
}) => {
  return (
    <div className={cn("flex w-10/12 items-center ", className)}>
      <div className="flex w-8/12 flex-col gap-y-2  p-4">
        <div className="flex flex-col bg-slate-200 p-4 ">
          <h1 className="text-4xl font-semibold">{ownerName}</h1>
          <h2 className="text-2xl">{shopName}</h2>

          <p>{bio}</p>
        </div>
        <div className="flex w-full flex-col bg-slate-200/25 p-4">
          <div className=" flex  w-full justify-around text-sm font-light">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4  " />
              {email}
            </span>
            •{" "}
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4  " />
              {website}
            </span>{" "}
            •{" "}
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4  " />
              {phone}
            </span>{" "}
          </div>

          {/* <p className=" text-sm font-light">
            {`${address}, ${city}, ${state} ${zip}`}
          </p> */}
        </div>
      </div>

      <Image
        width={200}
        height={160}
        src={ownerPhoto! ?? logoPhoto! ?? ""}
        alt="Artisan logo or profile photo"
        className="aspect-[3/4] w-4/12 object-cover "
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
export default ProfileCard;
