/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";

import { Avatar } from "~/components/forum/avatar";
import { IconButton } from "~/components/forum/icon-button";
import { EditIcon } from "~/components/forum/icons";

import {
  Pagination,
  getQueryPaginationInput,
} from "~/components/forum/pagination";
import type { PostSummaryProps } from "~/components/forum/post-summary";
import { PostSummarySkeleton } from "~/components/forum/post-summary-skeleton";
import DotPattern from "~/components/forum/profile/dot-pattern";
import EditProfileDialog from "~/components/forum/profile/edit-profile-dialog";
import UpdateAvatarDialog from "~/components/forum/profile/update-avatar-dialog";

import { env } from "~/env.mjs";
import ForumLayout from "~/layouts/forum-layout";
import { api, type RouterInputs } from "~/utils/api";
import { authenticateUser } from "~/utils/auth";

const PostSummary = dynamic<PostSummaryProps>(
  () =>
    import("~/components/forum/post-summary").then((mod) => mod.PostSummary),
  { ssr: false }
);

const POSTS_PER_PAGE = 20;

function getProfileQueryPathAndInput(
  id: string
): RouterInputs["user"]["profile"] {
  return { id };
}

const ProfilePage = () => {
  return (
    <>
      <ProfileInfo />
      <ProfileFeed />
    </>
  );
};

function ProfileInfo() {
  const { data: session } = useSession();
  const router = useRouter();
  const profileQueryPathAndInput = getProfileQueryPathAndInput(
    String(router.query.userId)
  );
  const profileQuery = api.user.profile.useQuery(profileQueryPathAndInput);

  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
    React.useState(false);
  const [isUpdateAvatarDialogOpen, setIsUpdateAvatarDialogOpen] =
    React.useState(false);

  if (profileQuery.data) {
    const profileBelongsToUser = profileQuery.data.id === session!.user.id;

    return (
      <>
        <Head>
          <title>{profileQuery.data.name} - Beam</title>
        </Head>
        <ForumLayout>
          <div className="relative flex items-center gap-4 overflow-hidden py-8">
            <div className="flex items-center gap-8">
              {env.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD && profileBelongsToUser ? (
                <button
                  aria-label="Edit avatar"
                  type="button"
                  className="group relative inline-flex"
                  onClick={() => {
                    setIsUpdateAvatarDialogOpen(true);
                  }}
                >
                  <Avatar
                    name={profileQuery.data.name!}
                    src={profileQuery.data.image}
                    size="lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-gray-900 opacity-0 transition-opacity group-hover:opacity-50" />
                  <div className="absolute left-1/2 top-1/2 inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-gray-900 opacity-0 transition-opacity group-hover:opacity-100">
                    <EditIcon className="h-4 w-4 text-white" />
                  </div>
                </button>
              ) : (
                <Avatar
                  name={profileQuery.data.name!}
                  src={profileQuery.data.image}
                  size="lg"
                />
              )}

              <div className="flex-1">
                <h1 className="bg-forum-primary text-2xl font-semibold tracking-tight md:text-3xl">
                  {profileQuery.data.name}
                </h1>
                {profileQuery.data.title && (
                  <p className="text-lg tracking-tight text-forum-secondary">
                    {profileQuery.data.title}
                  </p>
                )}
              </div>
            </div>

            {profileBelongsToUser && (
              <div className="ml-auto mr-10">
                <IconButton
                  variant="secondary"
                  onClick={() => {
                    setIsEditProfileDialogOpen(true);
                  }}
                >
                  <EditIcon className="h-4 w-4" />
                </IconButton>
              </div>
            )}

            <DotPattern />
          </div>

          <EditProfileDialog
            user={{
              name: profileQuery.data.name!,
              title: profileQuery.data.title,
            }}
            isOpen={isEditProfileDialogOpen}
            onClose={() => {
              setIsEditProfileDialogOpen(false);
            }}
          />

          <UpdateAvatarDialog
            key={profileQuery.data.image}
            user={{
              name: profileQuery.data.name!,
              image: profileQuery.data.image,
            }}
            isOpen={isUpdateAvatarDialogOpen}
            onClose={() => {
              setIsUpdateAvatarDialogOpen(false);
            }}
          />
        </ForumLayout>
      </>
    );
  }

  if (profileQuery.isError) {
    return (
      <ForumLayout>
        <div>Error: {profileQuery.error.message}</div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout>
      <div className="relative flex animate-pulse items-center gap-8 overflow-hidden py-8">
        <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="h-8 w-60 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <DotPattern />
      </div>
    </ForumLayout>
  );
}

function ProfileFeed() {
  const { data: session } = useSession();
  const router = useRouter();
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1;
  const utils = api.useContext();
  const profileFeedQueryPathAndInput: RouterInputs["post"]["feed"] = {
    ...getQueryPaginationInput(POSTS_PER_PAGE, currentPageNumber),
    authorId: String(router.query.userId),
  };

  const profileFeedQuery = api.post.feed.useQuery(profileFeedQueryPathAndInput);
  const likeMutation = api.post.like.useMutation({
    onMutate: async (likedPostId) => {
      await utils.post.feed.invalidate(profileFeedQueryPathAndInput);

      const previousQuery = utils.post.feed.getData(
        profileFeedQueryPathAndInput
      );

      if (previousQuery && session) {
        utils.post.feed.setData(profileFeedQueryPathAndInput, {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === likedPostId
              ? {
                  ...post,
                  likedBy: [
                    ...post.likedBy,
                    {
                      user: {
                        id: session.user.id ?? null,
                        name: session.user.name ?? null,
                      },
                    },
                  ],
                }
              : post
          ),
        });
      }

      return { previousQuery };
    },
    onError: (err, id, context) => {
      if (context?.previousQuery) {
        utils.post.feed.setData(
          profileFeedQueryPathAndInput,
          context.previousQuery
        );
      }
    },
  });
  const unlikeMutation = api.post.unlike.useMutation({
    onMutate: async (unlikedPostId) => {
      await utils.post.feed.invalidate(profileFeedQueryPathAndInput);

      const previousQuery = utils.post.feed.getData(
        profileFeedQueryPathAndInput
      );

      if (previousQuery) {
        utils.post.feed.setData(profileFeedQueryPathAndInput, {
          ...previousQuery,
          posts: previousQuery.posts.map((post) =>
            post.id === unlikedPostId
              ? {
                  ...post,
                  likedBy: post.likedBy.filter(
                    (item) => item.user.id !== session!.user.id
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
        utils.post.feed.setData(
          profileFeedQueryPathAndInput,
          context.previousQuery
        );
      }
    },
  });

  if (profileFeedQuery.data) {
    return (
      <>
        <div className="mt-28 flow-root">
          {profileFeedQuery.data.postCount === 0 ? (
            <div className="rounded border px-10 py-20 text-center text-forum-secondary">
              This user hasn&apos;t published any posts yet.
            </div>
          ) : (
            <ul className="-my-12 divide-y divide-forum-primary">
              {profileFeedQuery.data.posts.map((post) => (
                <li key={post.id} className="py-10">
                  <PostSummary
                    hideAuthor
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
          )}
        </div>

        <Pagination
          itemCount={profileFeedQuery.data.postCount}
          itemsPerPage={POSTS_PER_PAGE}
          currentPageNumber={currentPageNumber}
        />
      </>
    );
  }

  if (profileFeedQuery.isError) {
    return <div className="mt-28">Error: {profileFeedQuery.error.message}</div>;
  }

  return (
    <div className="mt-28 flow-root">
      <ul className="-my-12 divide-y divide-forum-primary">
        {[...Array(3)].map((_, idx) => (
          <li key={idx} className="py-10">
            <PostSummarySkeleton hideAuthor />
          </li>
        ))}
      </ul>
    </div>
  );
}
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const user = await authenticateUser(ctx);
  return user;
}

export default ProfilePage;
