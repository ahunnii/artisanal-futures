import type { FC } from "react";

import type { GetServerSidePropsContext } from "next";

import AdminLayout from "~/layouts/admin-layout";

import AdminInfoCard from "~/components/admin/admin-info-card";
import { Overview } from "~/components/admin/overview";
import { RecentMembers } from "~/components/admin/recent-members";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import PageLoader from "~/components/ui/page-loader";
import { Separator } from "~/components/ui/separator";

import { api } from "~/utils/api";
import { authenticateUser } from "~/utils/auth";

interface IProps {
  status: "authorized" | "unauthorized";
}
const AdminPage: FC<IProps> = ({ status }) => {
  const { data: shops } = api.shops.getAllShops.useQuery();
  const { data: users } = api.user.getAllUsers.useQuery();

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
      metric: 0,
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
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Unique Site Visitors</CardTitle>
                    <CardDescription>
                      This is mock data. Actual visitors are not reflected here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Members</CardTitle>
                    <CardDescription>
                      There were {users?.length ?? 0} users added this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex max-h-96">
                    {!users ? (
                      <PageLoader />
                    ) : (
                      <RecentMembers members={users} />
                    )}
                  </CardContent>
                </Card>
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
