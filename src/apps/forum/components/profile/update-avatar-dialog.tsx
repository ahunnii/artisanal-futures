import { useRef, useState, type FC } from "react";

import toast from "react-hot-toast";

import { Avatar } from "~/apps/forum/components/avatar";
import { Button } from "~/apps/forum/components/button";
import {
  Dialog,
  DialogActions,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from "~/apps/forum/components/dialog";

import { api } from "~/utils/api";

interface IProps {
  user: {
    name: string;
    image: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

const UpdateAvatarDialog: FC<IProps> = ({ user, isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState(user.image);
  const updateUserAvatarMutation = api.user.updateAvatar.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });
  const uploadImageMutation = api.user.uploadImage.useMutation({
    onError: (error) => {
      toast.error(`Error uploading image: ${error.message}`);
    },
  });

  function handleClose() {
    onClose();
    setUploadedImage(user.image);
  }

  const saveChanges = () => {
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
  };

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
              aria-label="Upload avatar"
              onChange={(event) => {
                const files = event.target.files;

                if (files && files.length > 0) {
                  const file = files[0]!;
                  if (file.size > 5242880) {
                    toast.error("Image is bigger than 5MB");
                    return;
                  }
                  setUploadedImage(URL.createObjectURL(file));
                }
              }}
            />
            <p className="mt-2 text-xs text-forum-secondary">
              JPEG, PNG, GIF / 5MB max
            </p>
          </div>
          {uploadedImage && (
            <div className="text-center">
              <Button
                variant="secondary"
                className="!text-forum-red"
                onClick={() => {
                  fileInputRef.current!.value = "";
                  URL.revokeObjectURL(uploadedImage);
                  setUploadedImage(null);
                }}
              >
                Remove photo
              </Button>
              <p className="mt-2 text-xs text-forum-secondary">
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
          onClick={saveChanges}
        >
          Save changes
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateAvatarDialog;
