import { getAuth } from "@clerk/nextjs/server";
import { PlusCircle } from "lucide-react";
import type { GetServerSidePropsContext } from "next";
import { useEffect } from "react";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useShopModal } from "~/hooks/use-shop-modal";
import ProfileLayout from "~/layouts/profile-layout";
import { prisma } from "~/server/db";
export default function ProfileShopPage() {
  const onOpen = useShopModal((state) => state.onOpen);

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Shop Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Configure how your store is shown to visitors
          </p>
        </div>
        <Separator />
        <p>
          You currently don&apos;t have a shop setup yet. Create one to promote
          your business to visitors on the site!
        </p>

        <Button onClick={onOpen} type="button">
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Store
        </Button>
      </div>
    </ProfileLayout>
  );
}
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const shop = await prisma.shop.findFirst({
    where: {
      ownerId: userId,
    },
  });

  if (shop) {
    console.log("redirecting to shop", shop.id);

    return {
      redirect: {
        destination: `/profile/shop/${shop.id.toString()}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
