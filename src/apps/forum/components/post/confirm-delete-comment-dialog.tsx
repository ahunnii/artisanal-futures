import { Button } from "~/apps/forum/components/button";

import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/apps/forum/components/dialog";

import { api, type RouterInputs } from "~/utils/api";

import { useRef, type FC } from "react";

import toast from "react-hot-toast";

function getPostQueryPathAndInput(id: number): RouterInputs["post"]["detail"] {
  return { id };
}

interface IProps {
  postId: number;
  commentId: number;
  isOpen: boolean;
  onClose: () => void;
}
const ConfirmDeleteCommentDialog: FC<IProps> = ({
  postId,
  commentId,
  isOpen,
  onClose,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
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
};

export default ConfirmDeleteCommentDialog;
