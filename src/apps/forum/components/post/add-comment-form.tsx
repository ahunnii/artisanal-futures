import { Button } from "~/apps/forum/components/button";

import { MarkdownEditor } from "~/apps/forum/components/markdown-editor";

import { api, type RouterInputs } from "~/utils/api";

import { useState, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

function getPostQueryPathAndInput(id: number): RouterInputs["post"]["detail"] {
  return { id };
}
type CommentFormData = {
  content: string;
};
const AddCommentForm: FC<{ postId: number }> = ({ postId }) => {
  const [markdownEditorKey, setMarkdownEditorKey] = useState(0);
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
};

export default AddCommentForm;
