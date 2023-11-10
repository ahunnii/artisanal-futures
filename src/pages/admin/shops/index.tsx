import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { ShopClient } from "~/components/admin/shops/client";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateUser } from "~/utils/auth";

interface IProps {
  status: "authorized" | "unauthorized";
}

const AdminShopsPage: FC<IProps> = ({ status }) => {
  const { data: shops } = api.shops.getAllShops.useQuery();
  console.log(shops);
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
              {!shops ? <PageLoader /> : <ShopClient data={shops} />}
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
      status: user.props!.user.role === "ADMIN" ? "authorized" : "unauthorized",
    },
  };
};
export default AdminShopsPage;
