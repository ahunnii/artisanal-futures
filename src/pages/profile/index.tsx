import type { FC } from "react";

import { Separator } from "~/components/ui/separator";
import ProfileLayout from "~/layouts/profile-layout";

const ProfilePage: FC = () => {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <p>
          Welcome! We are still a work in progress, so more settings will be
          available soon.
        </p>
      </div>
    </ProfileLayout>
  );
};

export default ProfilePage;
