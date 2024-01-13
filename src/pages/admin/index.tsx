import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import AdminInfoCard from "~/apps/admin/admin-info-card";
import { RecentMembers } from "~/apps/admin/recent-members";
import {
  Overview,
  SiteVisitorOverview,
} from "~/apps/admin/site-visitor-overview";
import * as Card from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import PageLoader from "~/components/ui/page-loader";
import { Separator } from "~/components/ui/separator";

import AdminLayout from "~/layouts/admin-layout";

import { api } from "~/utils/api";
import { authenticateUser } from "~/utils/auth";

type TAdminPageProps = { status: "authorized" | "unauthorized" };

const AdminPage: FC<TAdminPageProps> = ({ status }) => {
  const { data: shops } = api.shops.getAllShops.useQuery();
  const { data: users } = api.user.getAllUsers.useQuery();
  const { data: products } = api.products.getAllProducts.useQuery();

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
              <Heading
                title="Admin Dashboard"
                description="Stats and misc info on Artisanal Futures at a glance"
              />
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                {statData.map((item, idx) => (
                  <AdminInfoCard {...item} key={idx} />
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <SiteVisitorOverview />

                <Card.Card className="md:grid-cols-1 lg:col-span-3">
                  <Card.CardHeader>
                    <Card.CardTitle>Recent Members</Card.CardTitle>
                    <Card.CardDescription>
                      There were {users?.length ?? 0} users added this month.
                    </Card.CardDescription>
                  </Card.CardHeader>
                  <Card.CardContent className="flex max-h-[350px]">
                    {!users ? (
                      <PageLoader />
                    ) : (
                      <RecentMembers members={users} />
                    )}
                  </Card.CardContent>
                </Card.Card>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const user = await authenticateUser(ctx);

  return {
    props: {
      status: user.props!.user.role === "ADMIN" ? "authorized" : "unauthorized",
    },
  };
};
export default AdminPage;
