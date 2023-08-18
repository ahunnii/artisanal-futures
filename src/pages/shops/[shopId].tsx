import Head from "next/head";

import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";
import type { Profile } from "~/types";

import Body from "~/components/body";
import ProfileCard from "~/components/shops/profile-card";
import { prisma } from "~/server/db";

const ProfilePage: FC<{ data: Profile }> = ({ data }) => {
  return (
    <>
      <Head>
        <title>Profile | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>
        <ProfileCard className="mx-auto  h-full " {...data} />
      </Body>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const data = await prisma.shop.findFirst({
    where: {
      id: ctx.query.shopId as string,
    },
  });

  return {
    props: {
      data: data
        ? {
            ...data,
            createdAt: data.createdAt.toISOString(),
            updatedAt: data.updatedAt.toISOString(),
          }
        : null,
    },
  };
};
export default ProfilePage;
