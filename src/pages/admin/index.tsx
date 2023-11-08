import { Eye } from "lucide-react";
import { GetServerSidePropsContext } from "next";
import { User, getServerSession } from "next-auth";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { Overview } from "~/components/admin/overview";
import { RecentMembers } from "~/components/admin/recent-members";
import { Button } from "~/components/ui/button";
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
import AdminLayout from "~/layouts/admin-layout";
import { authenticateUser } from "~/utils/auth";

interface IProps {
  user: User;
  status: "authorized" | "unauthorized";
}
const AdminPage: FC<IProps> = ({ user, status }) => {
  // const { organizationList, isLoaded } = useOrganizationList();

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
              <Heading title="Dashboard" description="Overview of your store" />
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Traffic
                    </CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+3</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Products In Stock
                    </CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                  </CardContent>
                </Card>
              </div>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
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
      user: user.props!.user,
      status: user.props!.user.role === "ADMIN" ? "authorized" : "unauthorized",
    },
  };
};
export default AdminPage;
