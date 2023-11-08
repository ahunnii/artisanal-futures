import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { UserForm } from "~/components/admin/users/user-form";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/admin-layout";

interface IProps {
  userId: string;
}
const UserPage: FC<IProps> = ({ userId }) => {
  const { data: user } = api.user.getUser.useQuery({
    userId,
  });

  console.log(user);

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {typeof user === "undefined" && <PageLoader />}
          {typeof user === "object" && <UserForm initialData={user ?? null} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const store = await authenticateSession(ctx);

  if (!store) {
    return {
      redirect: {
        destination: `/admin`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId: ctx.query.userId,
    },
  };
}

export default UserPage;
