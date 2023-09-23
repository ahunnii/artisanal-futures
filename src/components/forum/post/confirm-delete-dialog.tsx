import { Button } from "~/components/forum/button";

import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/forum/dialog";

import { api } from "~/utils/api";

import { useRouter } from "next/router";

import { useRef, type FC } from "react";

import toast from "react-hot-toast";

interface IProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}
const ConfirmDeleteDialog: FC<IProps> = ({ postId, isOpen, onClose }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
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
              onSuccess: () => void router.push("/forum"),
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
};

export default ConfirmDeleteDialog;
