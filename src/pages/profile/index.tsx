import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import DevelopmentChangeRole from "~/apps/account/components/development-change-role";
import ProfileLayout from "~/apps/account/profile-layout";
import { Separator } from "~/components/ui/separator";

import { authenticateUserServerSide } from "~/utils/authentication/server";

const isDev = process.env.NODE_ENV === "development";

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
        {isDev && <DevelopmentChangeRole />}
      </div>
    </ProfileLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateUserServerSide(ctx);

export default ProfilePage;
