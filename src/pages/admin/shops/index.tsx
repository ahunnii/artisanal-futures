import type { GetServerSidePropsContext } from "next";

import { ShopClient } from "~/apps/admin/components/shops/client";
import { authenticateAdminServerSide } from "~/apps/admin/libs/authenticate-admin";
import PageLoader from "~/components/ui/page-loader";

import AdminLayout from "~/apps/admin/admin-layout";

import { api } from "~/utils/api";

const AdminShopsPage = () => {
  const { data: shops, isLoading } = api.shops.getAllShops.useQuery();

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
            <ShopClient data={shops ?? []} />
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateAdminServerSide(ctx);

export default AdminShopsPage;
