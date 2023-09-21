import formatDistanceToNow from "date-fns/formatDistanceToNow";
import Link from "next/link";
import { Avatar } from "~/components/forum/avatar";
import type { Author } from "~/types";

type AuthorWithDateProps = {
  author: Author;
  date: Date;
};

export function AuthorWithDate({ author, date }: AuthorWithDateProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link href={`/profile/${author.id}`}>
        <a className="relative inline-flex">
          <span className="hidden sm:flex">
            <Avatar name={author.name!} src={author.image} />
          </span>
          <span className="flex sm:hidden">
            <Avatar name={author.name!} src={author.image} size="sm" />
          </span>
        </a>
      </Link>
      <div className="flex-1 text-sm sm:text-base">
        <div>
          <Link href={`/profile/${author.id}`}>
            <a className="hover:text-blue font-medium tracking-tight transition-colors">
              {author.name}
            </a>
          </Link>
        </div>

        <p className="tracking-tight text-secondary">
          <time dateTime={date.toISOString()}>{formatDistanceToNow(date)}</time>{" "}
          ago
        </p>
      </div>
    </div>
  );
}
