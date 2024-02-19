import type { GetServerSidePropsContext } from "next";
import { useParams } from "next/navigation";
import type { FC } from "react";

import { ShopForm } from "~/apps/admin/components/shops/shop-form";
import { authenticateAdminServerSide } from "~/apps/admin/libs/authenticate-admin";
import PageLoader from "~/components/ui/page-loader";

import AdminLayout from "~/apps/admin/admin-layout";

import { api } from "~/utils/api";

interface IProps {
  shopId: string;
}
const AdminShopPage: FC<IProps> = () => {
  const { shopId } = useParams();
  const { data: shop, isLoading } = api.shops.getShopById.useQuery({
    id: shopId as string,
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
          <ShopForm initialData={shop ?? null} />
        </div>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateAdminServerSide(ctx);

export default AdminShopPage;
