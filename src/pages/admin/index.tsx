import type { GetServerSidePropsContext } from "next";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProfileForm } from "~/components/profile/profile-form";
import PageLoader from "~/components/ui/page-loader";
import { Separator } from "~/components/ui/separator";
import AdminLayout from "~/layouts/admin-layout";

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  // if (!userId) {
  //   return {
  //     redirect: {
  //       destination: "/sign-in?redirect_url=" + ctx.resolvedUrl,
  //       permanent: false,
  //     },
  //   };
  // }

  return { props: {} };
};

const AdminPage = () => {
  // const { organizationList, isLoaded } = useOrganizationList();

  const [showLoader, setShowLoader] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   if (isLoaded) {
  //     // Find the admin organization from the loaded organization list
  //     const adminOrganization = organizationList.find(
  //       (org) => org.membership.role === "admin"
  //     );

  //     // If the user is not an admin, redirect to the homepage
  //     if (!adminOrganization || adminOrganization.membership.role !== "admin") {
  //       void router.push("/"); // Replace '/' with the homepage URL
  //     } else {
  //       // If the user is an admin, no need to wait for the organization list; render the admin page directly
  //       setShowLoader(false);
  //     }
  //   }
  // }, [isLoaded, organizationList, router]);

  return (
    <>
      {showLoader && <PageLoader />}
      {!showLoader && (
        <>
          <AdminLayout>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Admin</h3>
                <p className="text-sm text-muted-foreground">
                  This is how others will see you on the site.
                </p>
              </div>
              <Separator />
              <ProfileForm />
            </div>
          </AdminLayout>
        </>
      )}
    </>
  );
};
export default AdminPage;
