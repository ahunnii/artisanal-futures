import { Button } from "~/apps/forum/button";

import { MarkdownEditor } from "~/apps/forum/markdown-editor";

import { api, type RouterInputs, type RouterOutputs } from "~/utils/api";

import { type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

interface IProps {
  postId: number;
  comment: RouterOutputs["post"]["detail"]["comments"][number];
  onDone: () => void;
}
function getPostQueryPathAndInput(id: number): RouterInputs["post"]["detail"] {
  return { id };
}

type CommentFormData = {
  content: string;
};
const EditCommentForm: FC<IProps> = ({ postId, comment, onDone }) => {
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
};

export default EditCommentForm;
