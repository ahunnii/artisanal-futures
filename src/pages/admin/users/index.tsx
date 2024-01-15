import type { GetServerSidePropsContext } from "next";

import { UserClient } from "~/apps/admin/components/users/client";
import { authenticateAdminServerSide } from "~/apps/admin/libs/authenticate-admin";
import PageLoader from "~/components/ui/page-loader";

import AdminLayout from "~/apps/admin/admin-layout";

import { api } from "~/utils/api";

const AdminUsersPage = () => {
  const { data: users, isLoading } = api.user.getAllUsers.useQuery();

  if (isLoading)
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );
  return (
    <AdminLayout>
      <>
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <UserClient data={users ?? []} />
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateAdminServerSide(ctx);

export default AdminUsersPage;
