import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { ShopForm } from "~/components/admin/shops/shop-form";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateUser } from "~/utils/auth";

interface IProps {
  shopId: string;
}
const UserPage: FC<IProps> = ({ shopId }) => {
  const { data: shop } = api.shops.getShopById.useQuery({
    id: shopId,
  });

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {typeof shop === "undefined" && <PageLoader />}
          {typeof shop === "object" && <ShopForm initialData={shop ?? null} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
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
      shopId: ctx.query.shopId,
    },
  };
}

export default UserPage;
