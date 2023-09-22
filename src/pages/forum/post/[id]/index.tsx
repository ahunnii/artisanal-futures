import { AuthorWithDate } from "~/components/forum/author-with-date";
import { Avatar } from "~/components/forum/avatar";
import { Banner } from "~/components/forum/banner";
import { Button } from "~/components/forum/button";
import { ButtonLink } from "~/components/forum/button-link";
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/forum/dialog";
import { HtmlView } from "~/components/forum/html-view";
import { IconButton } from "~/components/forum/icon-button";
import {
  DotsIcon,
  EditIcon,
  EyeClosedIcon,
  EyeIcon,
  MessageIcon,
  TrashIcon,
} from "~/components/forum/icons";
import { Layout } from "~/components/forum/layout";
import { LikeButton } from "~/components/forum/like-button";
import { MarkdownEditor } from "~/components/forum/markdown-editor";
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItems,
  MenuItemsContent,
} from "~/components/forum/menu";

import { api, type RouterInputs, type RouterOutputs } from "~/utils/api";

import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import ForumLayout from "~/layouts/forum-layout";

function getPostQueryPathAndInput(id: number): RouterInputs["post"]["detail"] {
  return { id };
}

const PostPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const utils = api.useContext();
  const postQueryPathAndInput = getPostQueryPathAndInput(
    Number(router.query.id)
  );
  const postQuery = api.post.detail.useQuery(postQueryPathAndInput);
  const likeMutation = api.post.like.useMutation({
    onMutate: async (likedPostId) => {
      await utils.post.detail.invalidate(postQueryPathAndInput);

      const previousPost = utils.post.detail.getData(postQueryPathAndInput);

      if (previousPost && session) {
        utils.post.detail.setData(postQueryPathAndInput, {
          ...previousPost,
          likedBy: [
            ...previousPost.likedBy,
            {
              user: {
                id: session.user.id ?? null,
                name: session.user.name ?? null,
              },
            },
          ],
        });
      }

      return { previousPost };
    },
    onError: (err, id, context: any) => {
      if (context?.previousPost) {
        utils.post.detail.setData(postQueryPathAndInput, context.previousPost);
      }
    },
  });
  const unlikeMutation = api.post.unlike.useMutation({
    onMutate: async (unlikedPostId) => {
      await utils.post.detail.invalidate(postQueryPathAndInput);

      const previousPost = utils.post.detail.getData(postQueryPathAndInput);

      if (previousPost) {
        utils.post.detail.setData(postQueryPathAndInput, {
          ...previousPost,
          likedBy: previousPost.likedBy.filter(
            (item) => item.user.id !== session!.user.id
          ),
        });
      }

      return { previousPost };
    },
    onError: (err, id, context: any) => {
      if (context?.previousPost) {
        utils.post.detail.setData(postQueryPathAndInput, context.previousPost);
      }
    },
  });
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false);
  const [isConfirmHideDialogOpen, setIsConfirmHideDialogOpen] =
    React.useState(false);
  const [isConfirmUnhideDialogOpen, setIsConfirmUnhideDialogOpen] =
    React.useState(false);

  function handleHide() {
    setIsConfirmHideDialogOpen(true);
  }

  function handleUnhide() {
    setIsConfirmUnhideDialogOpen(true);
  }

  function handleEdit() {
    router.push(`/forum/post/${postQuery.data?.id}/edit`).catch((e) => {
      console.error(e);
    });
  }

  function handleDelete() {
    setIsConfirmDeleteDialogOpen(true);
  }

  if (postQuery.data) {
    const isUserAdmin = session!.user.role === "ADMIN";
    const postBelongsToUser = postQuery.data.author.id === session!.user.id;

    return (
      <>
        <Head>
          <title>{postQuery.data.title} - AF Forums</title>
        </Head>
        <ForumLayout>
          <article className="divide-y divide-forum-primary">
            <div className="pb-12">
              {postQuery.data.hidden && (
                <Banner className="mb-6">
                  This post has been hidden and is only visible to
                  administrators.
                </Banner>
              )}

              <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
                  {postQuery.data.title}
                </h1>
                {(postBelongsToUser || isUserAdmin) && (
                  <>
                    <div className="flex md:hidden">
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          variant="secondary"
                          title="More"
                        >
                          <DotsIcon className="h-4 w-4" />
                        </MenuButton>

                        <MenuItems className="w-28">
                          <MenuItemsContent>
                            {isUserAdmin &&
                              (postQuery.data.hidden ? (
                                <MenuItemButton onClick={handleUnhide}>
                                  Unhide
                                </MenuItemButton>
                              ) : (
                                <MenuItemButton onClick={handleHide}>
                                  Hide
                                </MenuItemButton>
                              ))}
                            {postBelongsToUser && (
                              <>
                                <MenuItemButton onClick={handleEdit}>
                                  Edit
                                </MenuItemButton>
                                <MenuItemButton
                                  className="!text-forum-red"
                                  onClick={handleDelete}
                                >
                                  Delete
                                </MenuItemButton>
                              </>
                            )}
                          </MenuItemsContent>
                        </MenuItems>
                      </Menu>
                    </div>
                    <div className="hidden md:flex md:gap-4">
                      {isUserAdmin &&
                        (postQuery.data.hidden ? (
                          <IconButton
                            variant="secondary"
                            title="Unhide"
                            onClick={handleUnhide}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        ) : (
                          <IconButton
                            variant="secondary"
                            title="Hide"
                            onClick={handleHide}
                          >
                            <EyeClosedIcon className="h-4 w-4" />
                          </IconButton>
                        ))}
                      {postBelongsToUser && (
                        <>
                          <IconButton
                            variant="secondary"
                            title="Edit"
                            onClick={handleEdit}
                          >
                            <EditIcon className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            variant="secondary"
                            title="Delete"
                            onClick={handleDelete}
                          >
                            <TrashIcon className="h-4 w-4 text-forum-red" />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6">
                <AuthorWithDate
                  author={postQuery.data.author}
                  date={postQuery.data.createdAt}
                />
              </div>
              <HtmlView html={postQuery.data.contentHtml} className="mt-8" />
              <div className="clear-both mt-6 flex items-center gap-4">
                <LikeButton
                  likedBy={postQuery.data.likedBy}
                  onLike={() => {
                    likeMutation.mutate(postQuery.data.id as number);
                  }}
                  onUnlike={() => {
                    unlikeMutation.mutate(postQuery.data.id as number);
                  }}
                />
                <ButtonLink
                  href={`/forum/post/${postQuery.data.id}#comments`}
                  variant="secondary"
                >
                  <MessageIcon className="h-4 w-4 text-forum-secondary" />
                  <span className="ml-1.5">
                    {postQuery.data.comments.length}
                  </span>
                </ButtonLink>
              </div>
            </div>

            <div id="comments" className="space-y-12 pt-12">
              {postQuery.data.comments.length > 0 && (
                <ul className="space-y-12">
                  {postQuery.data.comments.map((comment) => (
                    <li key={comment.id}>
                      <Comment postId={postQuery.data.id} comment={comment} />
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-start gap-2 sm:gap-4">
                <span className="hidden sm:inline-block">
                  <Avatar
                    name={session?.user?.name ?? "Anonymous"}
                    src={session?.user?.image ?? ""}
                  />
                </span>
                <span className="inline-block sm:hidden">
                  <Avatar
                    name={session?.user?.name ?? "Anonymous"}
                    src={session?.user?.image ?? ""}
                    size="sm"
                  />
                </span>
                <AddCommentForm postId={postQuery.data.id} />
              </div>
            </div>
          </article>

          <ConfirmDeleteDialog
            postId={postQuery.data.id}
            isOpen={isConfirmDeleteDialogOpen}
            onClose={() => {
              setIsConfirmDeleteDialogOpen(false);
            }}
          />

          <ConfirmHideDialog
            postId={postQuery.data.id}
            isOpen={isConfirmHideDialogOpen}
            onClose={() => {
              setIsConfirmHideDialogOpen(false);
            }}
          />

          <ConfirmUnhideDialog
            postId={postQuery.data.id}
            isOpen={isConfirmUnhideDialogOpen}
            onClose={() => {
              setIsConfirmUnhideDialogOpen(false);
            }}
          />
        </ForumLayout>
      </>
    );
  }

  if (postQuery.isError) {
    return (
      <ForumLayout>
        <div>Error: {postQuery.error.message}</div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout>
      <div className="animate-pulse">
        <div className="h-9 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1">
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="mt-7 space-y-3">
          {[...Array(3)].map((_, idx) => (
            <React.Fragment key={idx}>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-5 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="col-span-1 h-5 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 h-5 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="col-span-2 h-5 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="h-5 w-3/5 rounded bg-gray-200 dark:bg-gray-700" />
            </React.Fragment>
          ))}
        </div>
        <div className="mt-6 flex gap-4">
          <div className="h-button w-16 rounded-full border border-forum-secondary" />
          <div className="h-button w-16 rounded-full border border-forum-secondary" />
        </div>
      </div>
    </ForumLayout>
  );
};

function Comment({
  postId,
  comment,
}: {
  postId: number;
  comment: RouterOutputs["post"]["detail"]["comments"][number];
}) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false);

  const commentBelongsToUser = comment.author.id === session!.user.id;

  if (isEditing) {
    return (
      <div className="flex items-start gap-4">
        <Avatar name={comment.author.name!} src={comment.author.image} />
        <EditCommentForm
          postId={postId}
          comment={comment}
          onDone={() => {
            setIsEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <AuthorWithDate author={comment.author} date={comment.createdAt} />
        {commentBelongsToUser && (
          <Menu>
            <MenuButton as={IconButton} variant="secondary" title="More">
              <DotsIcon className="h-4 w-4" />
            </MenuButton>

            <MenuItems className="w-28">
              <MenuItemsContent>
                <MenuItemButton
                  className="hover:text-white"
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  Edit
                </MenuItemButton>
                <MenuItemButton
                  className="!text-forum-red hover:text-white"
                  onClick={() => {
                    setIsConfirmDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </MenuItemButton>
              </MenuItemsContent>
            </MenuItems>
          </Menu>
        )}
      </div>

      <div className="mt-4 pl-11 sm:pl-16">
        <HtmlView html={comment.contentHtml} />
      </div>

      <ConfirmDeleteCommentDialog
        postId={postId}
        commentId={comment.id}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => {
          setIsConfirmDeleteDialogOpen(false);
        }}
      />
    </div>
  );
}

type CommentFormData = {
  content: string;
};

function AddCommentForm({ postId }: { postId: number }) {
  const [markdownEditorKey, setMarkdownEditorKey] = React.useState(0);
  const utils = api.useContext();
  const addCommentMutation = api.comment.add.useMutation({
    onSuccess: () => {
      return utils.post.detail.invalidate(getPostQueryPathAndInput(postId));
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
  const { control, handleSubmit, reset } = useForm<CommentFormData>();

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    addCommentMutation.mutate(
      {
        postId,
        content: data.content,
      },
      {
        onSuccess: () => {
          reset({ content: "" });
          setMarkdownEditorKey((markdownEditorKey) => markdownEditorKey + 1);
        },
      }
    );
  };

  return (
    <form className="flex-1" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <Controller
        name="content"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <MarkdownEditor
            key={markdownEditorKey}
            value={field.value}
            onChange={field.onChange}
            onTriggerSubmit={() => void handleSubmit(onSubmit)()}
            required
            placeholder="Comment"
            minRows={4}
          />
        )}
      />
      <div className="mt-4">
        <Button
          type="submit"
          isLoading={addCommentMutation.isLoading}
          loadingChildren="Adding comment"
        >
          Add comment
        </Button>
      </div>
    </form>
  );
}

function EditCommentForm({
  postId,
  comment,
  onDone,
}: {
  postId: number;
  comment: RouterOutputs["post"]["detail"]["comments"][number];
  onDone: () => void;
}) {
  const utils = api.useContext();
  const editCommentMutation = api.comment.edit.useMutation({
    onSuccess: () => {
      return utils.post.detail.invalidate(getPostQueryPathAndInput(postId));
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
  const { control, handleSubmit } = useForm<CommentFormData>({
    defaultValues: {
      content: comment.content,
    },
  });

  const onSubmit: SubmitHandler<CommentFormData> = (data) => {
    editCommentMutation.mutate(
      {
        id: comment.id,
        data: {
          content: data.content,
        },
      },
      {
        onSuccess: () => onDone(),
      }
    );
  };

  return (
    <form className="flex-1" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <Controller
        name="content"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <MarkdownEditor
            value={field.value}
            onChange={field.onChange}
            onTriggerSubmit={() => void handleSubmit(onSubmit)()}
            required
            placeholder="Comment"
            minRows={4}
            autoFocus
          />
        )}
      />
      <div className="mt-4 flex gap-4">
        <Button
          type="submit"
          isLoading={editCommentMutation.isLoading}
          loadingChildren="Updating comment"
        >
          Update comment
        </Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function ConfirmDeleteCommentDialog({
  postId,
  commentId,
  isOpen,
  onClose,
}: {
  postId: number;
  commentId: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const utils = api.useContext();
  const deleteCommentMutation = api.comment.delete.useMutation({
    onSuccess: () => {
      return utils.post.detail.invalidate(getPostQueryPathAndInput(postId));
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Delete comment</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this comment?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          className="!text-forum-red"
          isLoading={deleteCommentMutation.isLoading}
          loadingChildren="Deleting comment"
          onClick={() => {
            deleteCommentMutation.mutate(commentId, {
              onSuccess: () => onClose(),
            });
          }}
        >
          Delete comment
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ConfirmDeleteDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const deletePostMutation = api.post.delete.useMutation({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Delete post</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to delete this post?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          className="!text-forum-red"
          isLoading={deletePostMutation.isLoading}
          loadingChildren="Deleting post"
          onClick={() => {
            deletePostMutation.mutate(postId, {
              onSuccess: () => void router.push("/"),
            });
          }}
        >
          Delete post
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ConfirmHideDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const utils = api.useContext();
  const hidePostMutation = api.post.hide.useMutation({
    onSuccess: () => {
      return utils.post.detail.invalidate(getPostQueryPathAndInput(postId));
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Hide post</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to hide this post?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          isLoading={hidePostMutation.isLoading}
          loadingChildren="Hiding post"
          onClick={() => {
            hidePostMutation.mutate(postId, {
              onSuccess: () => {
                toast.success("Post hidden");
                onClose();
              },
            });
          }}
        >
          Hide post
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ConfirmUnhideDialog({
  postId,
  isOpen,
  onClose,
}: {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const utils = api.useContext();
  const unhidePostMutation = api.post.unhide.useMutation({
    onSuccess: () => {
      return utils.post.detail.invalidate(getPostQueryPathAndInput(postId));
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <Dialog isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
      <DialogContent>
        <DialogTitle>Unhide post</DialogTitle>
        <DialogDescription className="mt-6">
          Are you sure you want to unhide this post?
        </DialogDescription>
        <DialogCloseButton onClick={onClose} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          isLoading={unhidePostMutation.isLoading}
          loadingChildren="Unhiding post"
          onClick={() => {
            unhidePostMutation.mutate(postId, {
              onSuccess: () => {
                toast.success("Post unhidden");
                onClose();
              },
            });
          }}
        >
          Unhide post
        </Button>
        <Button variant="secondary" onClick={onClose} ref={cancelRef}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PostPage;
