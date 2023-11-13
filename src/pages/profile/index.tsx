import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import type { Session } from "next-auth";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import ProfileLayout from "~/layouts/profile-layout";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

const isDev = process.env.NODE_ENV === "development";

const ProfilePage: FC = () => {
  const router = useRouter();

  const { mutate: updateRole } = api.auth.changeRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated.");
      router.reload();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
  });

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
        {isDev && (
          <section>
            <p>Test Roles</p>

            <Button onClick={() => updateRole({ role: "USER" })}>
              Set to USER
            </Button>
            <Button onClick={() => updateRole({ role: "ADMIN" })}>
              Set to ADMIN
            </Button>
            <Button onClick={() => updateRole({ role: "ARTISAN" })}>
              Set to ARTISAN
            </Button>
          </section>
        )}
      </div>
    </ProfileLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = (await authenticateSession(ctx)) as Session;

  if (!session.user) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(
          ctx.resolvedUrl
        )}`,

        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default ProfilePage;
