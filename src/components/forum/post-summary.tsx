import * as Tooltip from "@radix-ui/react-tooltip";
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
import type { RouterOutputs } from "~/utils/api";
import { summarize } from "~/utils/forum/text";

import { classNames } from "~/utils/styles";

export type PostSummaryProps = {
  post: RouterOutputs["post"]["feed"]["posts"][number];
  hideAuthor?: boolean;
  onLike: () => void;
  onUnlike: () => void;
};

export function PostSummary({
  post,
  hideAuthor = false,
  onLike,
  onUnlike,
}: PostSummaryProps) {
  const { summary, hasMore } = React.useMemo(
    () => summarize(post.contentHtml as string),
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
        <Link href={`/post/${post.id}`}>
          <a>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {post.title}
            </h2>
          </a>
        </Link>

        <div className={classNames(hideAuthor ? "mt-2" : "mt-6")}>
          {hideAuthor ? (
            <p className="tracking-tight text-secondary">
              <time dateTime={post.createdAt.toISOString()}>
                {formatDistanceToNow(post.createdAt as Date)}
              </time>{" "}
              ago
            </p>
          ) : (
            <AuthorWithDate author={post.author} date={post.createdAt} />
          )}
        </div>

        <HtmlView html={summary} className={hideAuthor ? "mt-4" : "mt-6"} />

        <div className="clear-both mt-4 flex items-center gap-4">
          {hasMore && (
            <Link href={`/post/${post.id}`}>
              <a className="text-blue inline-flex items-center font-medium transition-colors">
                Continue reading <ChevronRightIcon className="ml-1 h-4 w-4" />
              </a>
            </Link>
          )}
          <div className="ml-auto flex gap-6">
            <Tooltip.Root delayDuration={300}>
              <Tooltip.Trigger
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
                    <HeartFilledIcon className="text-red h-4 w-4" />
                  ) : (
                    <HeartIcon className="text-red h-4 w-4" />
                  )}
                  <span className="text-sm font-semibold tabular-nums">
                    {likeCount}
                  </span>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content
                side="bottom"
                sideOffset={4}
                className={classNames(
                  "bg-secondary-inverse text-secondary-inverse max-w-[260px] rounded px-3 py-1.5 shadow-lg sm:max-w-sm",
                  likeCount === 0 && "hidden"
                )}
              >
                <p className="text-sm">
                  {post.likedBy
                    .slice(0, MAX_LIKED_BY_SHOWN)
                    .map((item) =>
                      item.user.id === session!.user.id ? "You" : item.user.name
                    )
                    .join(", ")}
                  {likeCount > MAX_LIKED_BY_SHOWN &&
                    ` and ${likeCount - MAX_LIKED_BY_SHOWN} more`}
                </p>
                <Tooltip.Arrow
                  offset={22}
                  className="fill-gray-800 dark:fill-gray-50"
                />
              </Tooltip.Content>
            </Tooltip.Root>

            <div className="inline-flex items-center gap-1.5">
              <MessageIcon className="h-4 w-4 text-secondary" />
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
