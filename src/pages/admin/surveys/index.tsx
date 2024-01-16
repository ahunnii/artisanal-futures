import type { GetServerSidePropsContext } from "next";

import { SurveyClient } from "~/apps/admin/components/surveys/client";
import { authenticateAdminServerSide } from "~/apps/admin/libs/authenticate-admin";
import PageLoader from "~/components/ui/page-loader";

import AdminLayout from "~/apps/admin/admin-layout";

import { api } from "~/utils/api";

const AdminSurveyPage = () => {
  const { data: surveys, isLoading } = api.surveys.getAllSurveys.useQuery();

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
            <SurveyClient data={surveys ?? []} />
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateAdminServerSide(ctx);

export default AdminSurveyPage;
