import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const BackToButton = ({
  link,
  title,
}: {
  link: string;
  title?: string;
}) => {
  return (
    <Link href={link}>
      <Button className="flex px-0 text-sm text-zinc-500" variant={"link"}>
        <ArrowLeft className="h-6 w-6" /> {title ?? "Go back"}
      </Button>
    </Link>
  );
};
