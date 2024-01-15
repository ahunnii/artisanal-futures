import { Globe, Mail, Phone } from "lucide-react";

type ArtisanLinks = {
  website: string | undefined | null;
  email: string | undefined | null;
  phone: string | undefined | null;
};

export const ProfileContactBar = ({ website, email, phone }: ArtisanLinks) => {
  return (
    <div className="flex w-full flex-col bg-slate-200/25 p-4">
      <div className=" flex  w-full flex-col justify-around text-sm font-light max-lg:space-y-3 lg:flex-row">
        <span className="flex items-center gap-2">
          <Mail className="h-4 w-4  " />
          {email ?? "No email provided"}
        </span>
        <span className="max-lg:hidden"> • </span>
        <span className="flex items-center gap-2">
          <Globe className="h-4 w-4  " />
          {website ?? "No website provided"}
        </span>{" "}
        <span className="max-lg:hidden"> • </span>
        <span className="flex items-center gap-2">
          <Phone className="h-4 w-4  " />
          {phone ?? "No phone provided"}
        </span>{" "}
      </div>
    </div>
  );
};
