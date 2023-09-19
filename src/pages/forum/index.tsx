import { Layout } from "~/components/forum/layout";
import {
  getQueryPaginationInput,
  Pagination,
} from "~/components/forum/pagination";
import type { PostSummaryProps } from "~/components/forum/post-summary";
import { PostSummarySkeleton } from "~/components/forum/post-summary-skeleton";
// import { InferQueryPathAndInput, trpc } from '~/lib/trpc'
import { useAuth, useUser } from "@clerk/nextjs";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";
import type { NextPageWithAuthAndLayout } from "~/types";
import { api } from "~/utils/api";

const PostSummary = dynamic<PostSummaryProps>(
  () =>
    import("~/components/forum/post-summary").then((mod) => mod.PostSummary),
  { ssr: false }
);

const POSTS_PER_PAGE = 20;

const Home: NextPageWithAuthAndLayout = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1;
  const utils = api.useContext();
  const feedQuery = api.post.feed.useQuery({
    ...getQueryPaginationInput(POSTS_PER_PAGE, currentPageNumber),
  });

  const likeMutation = api.post.like.useMutation({
    onMutate: async (likedPostId) => {
      await utils.post.feed.invalidate();

      const previousQuery = await utils.post.feed.fetch();

      if (previousQuery) {
        utils.post.feed.setData({
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === likedPostId
              ? {
                  ...post,
                  likedBy: [
                    ...post.likedBy,
                    {
                      user: { id: userId, name: user?.fullName ?? "Anonymous" },
                    },
                  ],
                }
              : post
          ),
        });
      }

      return { previousQuery };
    },
    onError: (err, id, context: any) => {
      if (context?.previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, context.previousQuery);
      }
    },
  });
  const unlikeMutation = api.post.unlike.useMutation({
    onMutate: async (unlikedPostId) => {
      await utils.cancelQuery(feedQueryPathAndInput);

      const previousQuery = utils.getQueryData(feedQueryPathAndInput);

      if (previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === unlikedPostId
              ? {
                  ...post,
                  likedBy: post.likedBy.filter(
                    (item) => item.user.id !== userId
                  ),
                }
              : post
          ),
        });
      }

      return { previousQuery };
    },
    onError: (err, id, context: any) => {
      if (context?.previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, context.previousQuery);
      }
    },
  });

  if (feedQuery.data) {
    return (
      <>
        <Head>
          <title>Beam</title>
        </Head>

        {feedQuery.data.postCount === 0 ? (
          <div className="rounded border px-10 py-20 text-center text-secondary">
            There are no published posts to show yet.
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-my-12 divide-y divide-primary">
              {feedQuery.data.posts.map((post) => (
                <li key={post.id} className="py-10">
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
        )}

        <Pagination
          itemCount={feedQuery.data.postCount}
          itemsPerPage={POSTS_PER_PAGE}
          currentPageNumber={currentPageNumber}
        />
      </>
    );
  }

  if (feedQuery.isError) {
    return <div>Error: {feedQuery.error.message}</div>;
  }

  return (
    <div className="flow-root">
      <ul className="-my-12 divide-y divide-primary">
        {[...Array(3)].map((_, idx) => (
          <li key={idx} className="py-10">
            <PostSummarySkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
};

Home.auth = true;

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
