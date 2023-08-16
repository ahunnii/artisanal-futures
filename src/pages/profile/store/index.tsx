import { getAuth } from "@clerk/nextjs/server";
import type { GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import { ProfileForm } from "~/components/profile/profile-form";
import { Separator } from "~/components/ui/separator";
import { useStoreModal } from "~/hooks/use-store-modal";
import ProfileLayout from "~/layouts/profile-layout";
import { prisma } from "~/server/db";
export default function ProfileStorePage() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Store</h3>
          <p className="text-sm text-muted-foreground">
            Add your store details to Artisanal Futures
          </p>
        </div>
        <Separator />
        <ProfileForm />
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

  const store = await prisma.store.findFirst({
    where: {
      ownerId: userId,
    },
  });

  if (store) {
    console.log("redirecting to store", store.id);

    return {
      redirect: {
        destination: `/profile/store/${store.id.toString()}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
