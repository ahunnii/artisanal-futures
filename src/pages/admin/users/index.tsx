import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import type { User } from "@prisma/client";

import { UserClient } from "~/apps/admin/users/client";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateUser } from "~/utils/auth";
interface IProps {
  users: User[];
  status: "authorized" | "unauthorized";
}

const AdminUsersPage: FC<IProps> = ({ status }) => {
  const { data: users } = api.user.getAllUsers.useQuery();

  return (
    <AdminLayout>
      {status === "unauthorized" ? (
        <>
          <p>
            You don&apos;t have the credentials to access this view. Please
            contact Artisanal Futures to elevate your role.
          </p>
        </>
      ) : (
        <>
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
              {!users ? <PageLoader /> : <UserClient data={users} />}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const user = await authenticateUser(ctx);

  if (user.props!.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: user.props!.user,
      status: user.props!.user.role === "ADMIN" ? "authorized" : "unauthorized",
    },
  };
};
export default AdminUsersPage;
