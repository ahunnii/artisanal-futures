import Image from "next/image";
import * as React from "react";
import { isCharacterALetter } from "~/utils/forum/text";

type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  size?: AvatarSize;
  name: string;
  src?: string | null;
};

const dimension: Record<AvatarSize, number> = {
  sm: 34,
  md: 48,
  lg: 128,
};

const initialSize: Record<AvatarSize, string> = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-16 h-16",
};

export function Avatar({ size = "md", name, src }: AvatarProps) {
  const initial = name.charAt(0).toLocaleLowerCase();

  return (
    <div className="relative inline-flex flex-shrink-0 rounded-full">
      {src ? (
        <>
          <Image
            src={src}
            alt={name}
            width={dimension[size]}
            height={dimension[size]}
            className="rounded-full object-cover "
          />
          <div className="absolute inset-0 rounded-full border border-[rgba(0,0,0,0.04)]" />
        </>
      ) : (
        <div className="grid">
          <div className="col-start-1 col-end-1 row-start-1 row-end-1 flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/avatar?name=${encodeURIComponent(name)}`}
              alt={name}
              width={dimension[size]}
              height={dimension[size]}
            />
          </div>
          {isCharacterALetter(initial) && (
            <div className="relative col-start-1 col-end-1 row-start-1 row-end-1 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/letters/${initial}.svg`}
                className={initialSize[size]}
                alt=""
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
