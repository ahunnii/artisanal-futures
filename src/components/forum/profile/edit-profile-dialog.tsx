import { useRouter } from "next/router";
import type { FC } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "~/components/forum/button";
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from "~/components/forum/dialog";

import { TextField } from "~/components/forum/text-field";

import { api, type RouterInputs } from "~/utils/api";

type EditFormData = {
  name: string;
  title: string | null;
};

interface IProps {
  user: {
    name: string;
    title: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

function getProfileQueryPathAndInput(
  id: string
): RouterInputs["user"]["profile"] {
  return { id };
}

const EditProfileDialog: FC<IProps> = ({ user, isOpen, onClose }) => {
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
};
export default EditProfileDialog;
