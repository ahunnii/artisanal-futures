import { useOrganizationList } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageLoader from "~/components/ui/page-loader";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in?redirect_url=" + ctx.resolvedUrl,
        permanent: false,
      },
    };
  }

  return { props: {} };
};

const AdminPage = () => {
  const { organizationList, isLoaded } = useOrganizationList();

  const [showLoader, setShowLoader] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      // Find the admin organization from the loaded organization list
      const adminOrganization = organizationList.find(
        (org) => org.membership.role === "admin"
      );

      // If the user is not an admin, redirect to the homepage
      if (!adminOrganization || adminOrganization.membership.role !== "admin") {
        void router.push("/"); // Replace '/' with the homepage URL
      } else {
        // If the user is an admin, no need to wait for the organization list; render the admin page directly
        setShowLoader(false);
      }
    }
  }, [isLoaded, organizationList, router]);

  return (
    <>
      {showLoader && <PageLoader />}
      {!showLoader && (
        <>
          <h1>Admin Page</h1>
        </>
      )}
    </>
  );
};
export default AdminPage;
