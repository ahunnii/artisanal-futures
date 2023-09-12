import { CreditCard, DollarSign, Package } from "lucide-react";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import type { FC } from "react";

import { authenticateSession } from "~/utils/auth";

import type { Shop } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import { clerkClient, currentUser, getAuth } from "@clerk/nextjs/server";
import { ShopForm } from "~/components/profile/shop-form";
import PageLoader from "~/components/ui/page-loader";
import ProfileLayout from "~/layouts/profile-layout";

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
          {typeof shop === "object" && <ShopForm initialData={shop ?? null} />}
        </div>
      </ProfileLayout>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const shop = (await authenticateSession(ctx)) as Shop;

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