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
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmHideDialog: FC<IProps> = ({ postId, isOpen, onClose }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
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
};
export default ConfirmHideDialog;
