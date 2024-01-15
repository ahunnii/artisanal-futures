import Link from "next/link";
import * as React from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "~/apps/forum/components/button";
import { ButtonLink } from "~/apps/forum/components/button-link";
import { MarkdownIcon } from "~/apps/forum/components/icons";
import { MarkdownEditor } from "~/apps/forum/components/markdown-editor";
import { TextField } from "~/apps/forum/components/text-field";
import { useLeaveConfirm } from "~/utils/forum/form";

type FormData = {
  title: string;
  content: string;
};

type PostFormProps = {
  defaultValues?: FormData;
  isSubmitting?: boolean;
  backTo: string;
  onSubmit: SubmitHandler<FormData>;
};

export function PostForm({
  defaultValues,
  isSubmitting,
  backTo,
  onSubmit,
}: PostFormProps) {
  const { control, register, formState, getValues, reset, handleSubmit } =
    useForm<FormData>({
      defaultValues,
    });

  useLeaveConfirm({ formState });

  const { isSubmitSuccessful } = formState;

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset(getValues());
    }
  }, [isSubmitSuccessful, reset, getValues]);

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <TextField
        {...register("title", { required: true })}
        label="Title"
        autoFocus
        required
        className="!py-1.5 text-lg font-semibold"
      />

      <div className="mt-6">
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <MarkdownEditor
              label="Post"
              value={field.value}
              onChange={field.onChange}
              onTriggerSubmit={() => void handleSubmit(onSubmit)}
              required
            />
          )}
        />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingChildren={`${defaultValues ? "Saving" : "Publishing"}`}
          >
            {defaultValues?.title ? "Save" : "Publish"}
          </Button>
          <ButtonLink href={backTo} variant="secondary">
            Cancel
          </ButtonLink>
        </div>
        {!isSubmitting && (
          <Link
            href="https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-forum-secondary transition-colors hover:text-forum-blue"
          >
            <MarkdownIcon />
            <span className="text-xs">Markdown supported</span>
          </Link>
        )}
      </div>
    </form>
  );
}
