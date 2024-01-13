import { PostForm } from "~/apps/forum/post-form";

import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ForumLayout from "~/layouts/forum-layout";
import { api } from "~/utils/api";
import { authenticateUser } from "~/utils/auth";

const NewPostPage = () => {
  const router = useRouter();
  const addPostMutation = api.post.add.useMutation({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <>
      <Head>
        <title>New Post - Beam</title>
      </Head>
      <ForumLayout>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          New post
        </h1>

        <div className="mt-6">
          <PostForm
            isSubmitting={addPostMutation.isLoading}
            defaultValues={{
              title: "",
              content: "",
            }}
            backTo="/"
            onSubmit={(values) => {
              addPostMutation.mutate(
                { title: values.title, content: values.content },
                {
                  onSuccess: (data) =>
                    void router.push(`/forum/post/${data.id}`),
                }
              );
            }}
          />
        </div>
      </ForumLayout>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const user = await authenticateUser(ctx);
  return user;
}
export default NewPostPage;
