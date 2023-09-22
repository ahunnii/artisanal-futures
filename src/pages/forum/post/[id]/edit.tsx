import { Layout } from "~/components/forum/layout";
import { PostForm } from "~/components/forum/post-form";

import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const EditPostPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const postQuery = api.post.detail.useQuery({ id: Number(router.query.id) });
  const editPostMutation = api.post.edit.useMutation({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  if (postQuery.data) {
    const postBelongsToUser = postQuery.data.author.id === session!.user.id;

    return (
      <>
        <Head>
          <title>Edit {postQuery.data.title} - Beam</title>
        </Head>

        {postBelongsToUser ? (
          <>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Edit &quot;{postQuery.data.title}&quot;
            </h1>

            <div className="mt-6">
              <PostForm
                isSubmitting={editPostMutation.isLoading}
                defaultValues={{
                  title: postQuery.data.title,
                  content: postQuery.data.content,
                }}
                backTo={`/forum/post/${postQuery.data.id}`}
                onSubmit={(values) => {
                  editPostMutation.mutate(
                    {
                      id: postQuery.data.id,
                      data: { title: values.title, content: values.content },
                    },
                    {
                      onSuccess: () =>
                        void router.push(`/forum/post/${postQuery.data.id}`),
                    }
                  );
                }}
              />
            </div>
          </>
        ) : (
          <div>You don&apos;t have permissions to edit this post.</div>
        )}
      </>
    );
  }

  if (postQuery.isError) {
    return <div>Error: {postQuery.error.message}</div>;
  }

  return (
    <div className="animate-pulse">
      <div className="h-9 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-7">
        <div>
          <div className="h-5 w-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-[42px] rounded border border-secondary" />
        </div>
        <div className="mt-6">
          <div className="h-5 w-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-9 rounded border border-secondary" />
          <div className="mt-2 h-[378px] rounded border border-secondary" />
        </div>
      </div>
      <div className="mt-9 flex gap-4">
        <div className="h-button w-[92px] rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-button w-20 rounded-full border border-secondary" />
      </div>
    </div>
  );
};

EditPostPage.auth = true;

EditPostPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EditPostPage;
