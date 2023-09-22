import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import type { FC } from "react";

import { authenticateSession } from "~/utils/auth";

import type { Shop } from "@prisma/client";

import type { Session } from "next-auth";
import { ShopForm } from "~/components/profile/shop-form";
import PageLoader from "~/components/ui/page-loader";
import ProfileLayout from "~/layouts/profile-layout";
import { prisma } from "~/server/db";

interface DashboardPageProps {
  shop: Shop;
}

const DashboardPage: FC<DashboardPageProps> = ({ shop }) => {
  return (
    <>
      <Head>
        <title>Shop Dashboard</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ProfileLayout>
        <div className="space-y-6">
          {typeof shop === "undefined" && <PageLoader />}
          {typeof shop === "object" && <ShopForm initialData={shop} />}
        </div>
      </ProfileLayout>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = (await authenticateSession(ctx)) as Session;

  const shop = await prisma.shop.findFirst({
    where: {
      id: ctx.query.shopId as string,
      ownerId: session?.user?.id,
    },
  });

  if (!shop) {
    return {
      redirect: {
        destination: `/profile`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      shop: {
        ...shop,
        createdAt: shop.createdAt.toISOString(),
        updatedAt: shop.updatedAt.toISOString(),
      },
    },
  };
}

export default DashboardPage;
