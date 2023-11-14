/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { User } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";

import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";

import {
  Pagination,
  getQueryPaginationInput,
} from "~/components/forum/pagination";
import type { PostSummaryProps } from "~/components/forum/post-summary";
import { PostSummarySkeleton } from "~/components/forum/post-summary-skeleton";
import { SortButton } from "~/components/forum/sort-button";
import { Button } from "~/components/ui/button";
import ForumLayout from "~/layouts/forum-layout";
import { prisma } from "~/server/db";

import { api, type RouterInputs } from "~/utils/api";
import { authenticateUser } from "~/utils/auth";

const PostSummary = dynamic<PostSummaryProps>(
  () =>
    import("~/components/forum/post-summary").then((mod) => mod.PostSummary),
  { ssr: false }
);

const POSTS_PER_PAGE = 20;

interface IProps {
  user: User;
}
const Home: FC<IProps> = ({ user }) => {
  const router = useRouter();
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1;
  const utils = api.useContext();
  const feedQueryPathAndInput: RouterInputs["post"]["feed"] =
    getQueryPaginationInput(POSTS_PER_PAGE, currentPageNumber);

  const feedQuery = api.post.feed.useQuery(feedQueryPathAndInput);
  const likeMutation = api.post.like.useMutation({
    onMutate: async (likedPostId) => {
      await utils.post.feed.invalidate(feedQueryPathAndInput);

      const previousQuery = utils.post.feed.getData(feedQueryPathAndInput);
      try {
        if (previousQuery && user) {
          utils.post.feed.setData(feedQueryPathAndInput, {
            ...previousQuery,

            posts: previousQuery.posts.map((post) =>
              post.id === likedPostId
                ? {
                    ...post,
                    likedBy: [
                      ...post.likedBy,
                      {
                        user: {
                          id: user.id,
                          name: user.name,
                        },
                      },
                    ],
                  }
                : post
            ),
          });
        }
      } catch (err) {}

      return { previousQuery };
    },
    onError: (err, id, context) => {
      if (context?.previousQuery) {
        utils.post.feed.setData(feedQueryPathAndInput, context?.previousQuery);
      }
    },
  });
  const unlikeMutation = api.post.unlike.useMutation({
    onMutate: async (unlikedPostId) => {
      await utils.post.feed.invalidate(feedQueryPathAndInput);

      const previousQuery = utils.post.feed.getData(feedQueryPathAndInput);

      if (previousQuery) {
        utils.post.feed.setData(feedQueryPathAndInput, {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === unlikedPostId
              ? {
                  ...post,
                  likedBy: post.likedBy.filter(
                    (item) => item.user.id !== user.id
                  ),
                }
              : post
          ),
        });
      }

      return { previousQuery };
    },
    onError: (err, id, context) => {
      if (context?.previousQuery) {
        utils.post.feed.setData(feedQueryPathAndInput, context?.previousQuery);
      }
    },
  });

  if (feedQuery.data) {
    return (
      <>
        <Head>
          <title>AF Forums</title>
        </Head>

        <ForumLayout>
          {feedQuery.data.postCount === 0 ? (
            <div className="rounded border px-10 py-20 text-center text-forum-secondary ">
              There are no published posts to show yet.
            </div>
          ) : (
            <>
              <div className="flex justify-between p-4">
                <Link href="/forum/new">
                  <Button className="rounded-full">
                    <span className="sm:hidden">Post</span>
                    <span className="hidden shrink-0 sm:block">
                      Create a post
                    </span>
                  </Button>
                </Link>

                <SortButton />
              </div>
              <div className="flow-root">
                <ul className=" space-y-2 divide-y divide-forum-primary">
                  {feedQuery.data.posts.map((post) => (
                    <li
                      key={post.id}
                      className="px-4 py-10 hover:rounded-2xl hover:bg-slate-50"
                    >
                      <PostSummary
                        post={post}
                        onLike={() => {
                          likeMutation.mutate(post.id);
                        }}
                        onUnlike={() => {
                          unlikeMutation.mutate(post.id);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Pagination
            itemCount={feedQuery.data.postCount}
            itemsPerPage={POSTS_PER_PAGE}
            currentPageNumber={currentPageNumber}
          />
        </ForumLayout>
      </>
    );
  }

  if (feedQuery.isError) {
    return (
      <ForumLayout>
        <div>Error: {feedQuery.error.message}</div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout>
      <div className="flow-root">
        <ul className="-my-12 divide-y divide-forum-primary">
          {[...Array(3)].map((_, idx) => (
            <li key={idx} className="py-10">
              <PostSummarySkeleton />
            </li>
          ))}
        </ul>
      </div>
    </ForumLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const user = await authenticateUser(ctx);

  return user;
}
export default Home;
