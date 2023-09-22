import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { Avatar } from "~/components/forum/avatar";
import { Button } from "~/components/forum/button";
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from "~/components/forum/dialog";
import { IconButton } from "~/components/forum/icon-button";
import { EditIcon } from "~/components/forum/icons";
import { Layout } from "~/components/forum/layout";
import {
  Pagination,
  getQueryPaginationInput,
} from "~/components/forum/pagination";
import type { PostSummaryProps } from "~/components/forum/post-summary";
import { PostSummarySkeleton } from "~/components/forum/post-summary-skeleton";
import { TextField } from "~/components/forum/text-field";
import { env } from "~/env.mjs";
import { RouterInputs, api } from "~/utils/api";
import { uploadImage } from "~/utils/forum/cloudinary";

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

ProfilePage.auth = true;

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
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
              <h1 className="bg-primary text-2xl font-semibold tracking-tight md:text-3xl">
                {profileQuery.data.name}
              </h1>
              {profileQuery.data.title && (
                <p className="text-lg tracking-tight text-secondary">
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
      </>
    );
  }

  if (profileQuery.isError) {
    return <div>Error: {profileQuery.error.message}</div>;
  }

  return (
    <div className="relative flex animate-pulse items-center gap-8 overflow-hidden py-8">
      <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1">
        <div className="h-8 w-60 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-2 h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <DotPattern />
    </div>
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
    onError: (err, id, context: any) => {
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
    onError: (err, id, context: any) => {
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
            <div className="rounded border px-10 py-20 text-center text-secondary">
              This user hasn&apos;t published any posts yet.
            </div>
          ) : (
            <ul className="-my-12 divide-y divide-primary">
              {profileFeedQuery.data.posts.map((post) => (
                <li key={post.id} className="py-10">
                  <PostSummary
                    hideAuthor
                    post={post}
                    onLike={() => {
                      likeMutation.mutate(post.id as number);
                    }}
                    onUnlike={() => {
                      unlikeMutation.mutate(post.id as number);
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
      <ul className="-my-12 divide-y divide-primary">
        {[...Array(3)].map((_, idx) => (
          <li key={idx} className="py-10">
            <PostSummarySkeleton hideAuthor />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DotPattern() {
  return (
    <svg
      className="-z-1 absolute inset-0"
      width={720}
      height={240}
      fill="none"
      viewBox="0 0 720 240"
    >
      <defs>
        <pattern
          id="dot-pattern"
          x={0}
          y={0}
          width={31.5}
          height={31.5}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={1.5}
            cy={1.5}
            r={1.5}
            className="text-gray-100 dark:text-gray-700"
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width={720} height={240} fill="url(#dot-pattern)" />
    </svg>
  );
}

type EditFormData = {
  name: string;
  title: string | null;
};

function EditProfileDialog({
  user,
  isOpen,
  onClose,
}: {
  user: {
    name: string;
    title: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<EditFormData>({
    defaultValues: {
      name: user.name,
      title: user.title,
    },
  });
  const router = useRouter();
  const utils = api.useContext();
  const editUserMutation = api.user.edit.useMutation({
    onSuccess: () => {
      window.location.reload();
      return utils.user.profile.invalidate(
        getProfileQueryPathAndInput(String(router.query.userId))
      );
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  function handleClose() {
    onClose();
    reset();
  }

  const onSubmit: SubmitHandler<EditFormData> = (data) => {
    editUserMutation.mutate(
      {
        name: data.name,
        title: data.title,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <DialogContent>
          <DialogTitle>Edit profile</DialogTitle>
          <div className="mt-6 space-y-6">
            <TextField
              {...register("name", { required: true })}
              label="Name"
              required
            />

            <TextField {...register("title")} label="Title" />
          </div>
          <DialogCloseButton onClick={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            isLoading={editUserMutation.isLoading}
            loadingChildren="Saving"
          >
            Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function UpdateAvatarDialog({
  user,
  isOpen,
  onClose,
}: {
  user: {
    name: string;
    image: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = React.useState(user.image);
  const updateUserAvatarMutation = api.user.updateAvatar.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
  const uploadImageMutation = api.user.uploadImage.useMutation(
    // (file: File) => {
    //   return uploadImage(file);
    // },
    {
      onError: (error: any) => {
        toast.error(`Error uploading image: ${error.message}`);
      },
    }
  );

  function handleClose() {
    onClose();
    setUploadedImage(user.image);
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <DialogContent>
        <DialogTitle>Update avatar</DialogTitle>
        <DialogCloseButton onClick={handleClose} />
        <div className="mt-8 flex justify-center">
          <Avatar name={user.name} src={uploadedImage} size="lg" />
        </div>
        <div className="mt-6 grid grid-flow-col gap-6">
          <div className="text-center">
            <Button
              variant="secondary"
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              Choose file…
            </Button>
            <input
              ref={fileInputRef}
              name="user-image"
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              className="hidden"
              onChange={(event) => {
                const files = event.target.files;

                if (files && files.length > 0) {
                  const file = files[0];
                  if (file.size > 5242880) {
                    toast.error("Image is bigger than 5MB");
                    return;
                  }
                  setUploadedImage(URL.createObjectURL(files[0]));
                }
              }}
            />
            <p className="mt-2 text-xs text-secondary">
              JPEG, PNG, GIF / 5MB max
            </p>
          </div>
          {uploadedImage && (
            <div className="text-center">
              <Button
                variant="secondary"
                className="!text-red"
                onClick={() => {
                  fileInputRef.current!.value = "";
                  URL.revokeObjectURL(uploadedImage);
                  setUploadedImage(null);
                }}
              >
                Remove photo
              </Button>
              <p className="mt-2 text-xs text-secondary">
                And use default avatar
              </p>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          isLoading={
            updateUserAvatarMutation.isLoading || uploadImageMutation.isLoading
          }
          loadingChildren="Saving changes"
          onClick={async () => {
            if (user.image === uploadedImage) {
              handleClose();
            } else {
              const files = fileInputRef.current?.files;

              if (files && files.length > 0) {
                uploadImageMutation.mutate(files[0], {
                  onSuccess: (uploadedImage) => {
                    updateUserAvatarMutation.mutate({
                      image: uploadedImage.url,
                    });
                  },
                });
              } else {
                updateUserAvatarMutation.mutate({
                  image: null,
                });
              }
            }
          }}
        >
          Save changes
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProfilePage;
