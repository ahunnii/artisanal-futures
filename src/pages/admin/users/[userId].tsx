import type { GetServerSidePropsContext } from "next";
import { useParams } from "next/navigation";

import { UserForm } from "~/apps/admin/components/users/user-form";
import { authenticateAdminServerSide } from "~/apps/admin/libs/authenticate-admin";
import PageLoader from "~/components/ui/page-loader";

import AdminLayout from "~/apps/admin/admin-layout";

import { api } from "~/utils/api";

const AdminUserPage = () => {
  const { userId } = useParams();
  const { data: user, isLoading } = api.user.getUser.useQuery({
    userId: userId as string,
  });

  if (isLoading)
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <UserForm initialData={user ?? null} />
        </div>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateAdminServerSide(ctx);

export default AdminUserPage;
