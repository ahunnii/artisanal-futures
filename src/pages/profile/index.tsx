import { useUser } from "@clerk/nextjs";
import {
  User,
  buildClerkProps,
  clerkClient,
  getAuth,
} from "@clerk/nextjs/server";

import { GetServerSidePropsContext } from "next";
import { FC } from "react";
import { ProfileForm } from "~/components/profile/profile-form";
import { Separator } from "~/components/ui/separator";
import ProfileLayout from "~/layouts/profile-layout";
import { prisma } from "~/server/db";

const ProfilePage: FC = () => {
  const { user } = useUser();

  // console.log(user);
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
        {/* {user && <ProfileForm initialData={user} />} */}
      </div>
    </ProfileLayout>
  );
};

// export function getServerSideProps(ctx: GetServerSidePropsContext) {
//   const { userId } = getAuth(ctx.req);

//   if (!userId) {
//     return {
//       redirect: {
//         destination: "/auth/signin",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       userId,
//     },
//   };
// }

export default ProfilePage;
