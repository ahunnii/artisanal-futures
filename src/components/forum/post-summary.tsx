/* eslint-disable @typescript-eslint/no-unsafe-argument */
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useSession } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
import { AuthorWithDate } from "~/components/forum/author-with-date";
import { Banner } from "~/components/forum/banner";
import { HtmlView } from "~/components/forum/html-view";
import {
  ChevronRightIcon,
  HeartFilledIcon,
  HeartIcon,
  MessageIcon,
} from "~/components/forum/icons";
import { MAX_LIKED_BY_SHOWN } from "~/components/forum/like-button";
import {
  Tooltip,
  // TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { RouterOutputs } from "~/utils/api";
import { summarize } from "~/utils/forum/text";

import { classNames } from "~/utils/styles";

export type PostSummaryProps = {
  post: RouterOutputs["post"]["feed"]["posts"][number];
  hideAuthor?: boolean;
  onLike: () => void;
  onUnlike: () => void;
};

export function PostSummary({ post, hideAuthor = false }: PostSummaryProps) {
  const { summary, hasMore } = React.useMemo(
    () => summarize(post.contentHtml),
    [post.contentHtml]
  );
  const { data: session } = useSession();

  const isLikedByCurrentUser = Boolean(
    post.likedBy.find((item) => item.user.id === session!.user.id)
  );
  const likeCount = post.likedBy.length;

  return (
    <div>
      {post.hidden && (
        <Banner className="mb-6">
          This post has been hidden and is only visible to administrators.
        </Banner>
      )}
      <div className={classNames(post.hidden ? "opacity-50" : "")}>
        <Link href={`/forum/post/${post.id}`}>
          <span>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {post.title}
            </h2>
          </span>
        </Link>

        <div className={classNames(hideAuthor ? "mt-2" : "mt-6")}>
          {hideAuthor ? (
            <p className="tracking-tight text-forum-secondary">
              <time dateTime={post.createdAt.toISOString()}>
                {formatDistanceToNow(post.createdAt)}
              </time>{" "}
              ago
            </p>
          ) : (
            <AuthorWithDate author={post.author} date={post.createdAt} />
          )}
        </div>
        <Link href={`/forum/post/${post.id}`}>
          <HtmlView html={summary} className={hideAuthor ? "mt-4" : "mt-6"} />
        </Link>
        <div className="clear-both mt-4 flex items-center gap-4">
          {hasMore && (
            <Link href={`/forum/post/${post.id}`}>
              <span className="inline-flex items-center font-medium text-forum-blue transition-colors">
                Continue reading <ChevronRightIcon className="ml-1 h-4 w-4" />
              </span>
            </Link>
          )}
          <div className="ml-auto flex gap-6">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                >
                  <div className="inline-flex items-center gap-1.5">
                    {isLikedByCurrentUser ? (
                      <HeartFilledIcon className="h-4 w-4 text-forum-red" />
                    ) : (
                      <HeartIcon className="h-4 w-4 text-forum-red" />
                    )}
                    <span className="text-sm font-semibold tabular-nums">
                      {likeCount}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={4}
                  className={classNames(
                    "max-w-[260px] rounded bg-forum-secondary-inverse px-3 py-1.5 text-forum-secondary-inverse shadow-lg sm:max-w-sm",
                    likeCount === 0 && "hidden"
                  )}
                >
                  <p className="text-sm">
                    {post.likedBy
                      .slice(0, MAX_LIKED_BY_SHOWN)
                      .map((item) =>
                        item.user.id === session!.user.id
                          ? "You"
                          : item.user.name
                      )
                      .join(", ")}
                    {likeCount > MAX_LIKED_BY_SHOWN &&
                      ` and ${likeCount - MAX_LIKED_BY_SHOWN} more`}
                  </p>
                  {/* <TooltipArrow
                    offset={22}
                    className="fill-gray-800 dark:fill-gray-50"
                  /> */}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="inline-flex items-center gap-1.5">
              <MessageIcon className="h-4 w-4 text-forum-secondary" />
              <span className="text-sm font-semibold tabular-nums">
                {post._count.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
