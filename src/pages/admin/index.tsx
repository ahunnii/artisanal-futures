import type { GetServerSidePropsContext } from "next";

import { RecentMembers } from "~/apps/admin/components/recent-members";
import StatBar from "~/apps/admin/components/stat-bar";
import { authenticateAdminServerSide } from "~/apps/admin/libs/authenticate-admin";

import { SiteVisitorOverview } from "~/apps/admin/components/site-visitor-overview";

import { Heading } from "~/components/ui/heading";
import PageLoader from "~/components/ui/page-loader";

import { Separator } from "~/components/ui/separator";

import AdminLayout from "~/apps/admin/admin-layout";

import { api } from "~/utils/api";

const AdminPage = () => {
  const { data: shops, isLoading: isShopsLoading } =
    api.shops.getAllShops.useQuery();
  const { data: users, isLoading: isUserLoading } =
    api.user.getAllUsers.useQuery();
  const { data: products, isLoading: isProductsLoading } =
    api.products.getAllProducts.useQuery();

  const statData = [
    {
      title: "Number of Members",
      metric: users?.length ?? 0,
    },
    {
      title: "Active Shops",
      metric: shops?.length ?? 0,
    },
    {
      title: "Products",
      metric: products?.products?.length ?? 0,
    },
  ];

  if (isShopsLoading || isUserLoading || isProductsLoading)
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
            <Heading
              title="Admin Dashboard"
              description="Stats and misc info on Artisanal Futures at a glance"
            />
            <Separator />
            <StatBar stats={statData} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <SiteVisitorOverview />
              <RecentMembers members={users ?? []} isLoading={isUserLoading} />
            </div>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateAdminServerSide(ctx);

export default AdminPage;
