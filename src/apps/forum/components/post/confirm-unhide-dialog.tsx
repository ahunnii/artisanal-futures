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

interface IProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}

function getPostQueryPathAndInput(id: number): RouterInputs["post"]["detail"] {
  return { id };
}

const ConfirmUnhideDialog: FC<IProps> = ({ postId, isOpen, onClose }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
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
};

export default ConfirmUnhideDialog;
