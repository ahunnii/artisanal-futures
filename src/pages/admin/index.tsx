import { useState } from "react";

import PageLoader from "~/components/ui/page-loader";

const AdminPage = () => {
  // const { organizationList, isLoaded } = useOrganizationList();

  const [showLoader] = useState(true);

  return (
    <>
      {showLoader && <PageLoader />}
      {/* {!showLoader && (
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
      )} */}
    </>
  );
};
export default AdminPage;
