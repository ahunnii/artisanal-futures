import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Link from "next/link";
import { Avatar } from "~/apps/forum/components/avatar";
import type { Author } from "~/types";

type AuthorWithDateProps = {
  author: Author;
  date: Date;
};

export function AuthorWithDate({ author, date }: AuthorWithDateProps) {
  return (
    <div className=" flex items-center gap-2 sm:gap-4">
      <Link href={`/forum/profile/${author.id}`}>
        <span className="relative inline-flex">
          <span className="hidden sm:flex">
            <Avatar name={author.name!} src={author.image} />
          </span>
          <span className="flex sm:hidden">
            <Avatar name={author.name!} src={author.image} size="sm" />
          </span>
        </span>
      </Link>
      <div className="flex-1 text-sm sm:text-base">
        <div>
          <Link href={`/forum/profile/${author.id}`}>
            <span className="font-medium tracking-tight transition-colors hover:text-forum-blue">
              {author.name}
            </span>
          </Link>
        </div>

        <p className="tracking-tight text-forum-primary">
          <time dateTime={date.toISOString()}>{formatDistanceToNow(date)}</time>{" "}
          ago
        </p>
      </div>
    </div>
  );
}
