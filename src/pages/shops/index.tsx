import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { FC } from "react";

import type { Shop } from "@prisma/client";
import Body from "~/components/body";
import ShopCard from "~/components/shops/shop-card";
import { prisma } from "~/server/db";

interface IProps {
  artisans: Shop[];
}

const ShopsPage: FC<IProps> = ({ artisans }) => {
  console.log(artisans);
  return (
    <>
      <Head>
        <title>Shops | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>
        <h1 className="text-5xl font-semibold">Shops</h1>
        <p className="lead mb-3 mt-2 text-2xl text-slate-400">
          Browse our featured artisans&apos; stores
        </p>
        <div className="flex h-fit w-full flex-col md:flex-row md:flex-wrap">
          {artisans?.map((artisan: Shop, index: number) => (
            <div
              className=" flex basis-full p-4 md:basis-1/2 lg:basis-1/4 "
              key={index}
            >
              <ShopCard {...artisan} />
            </div>
          ))}
          {artisans?.length === 0 && (
            <p>
              There seems to be an issue fetching the shops. Please try again
              later.
            </p>
          )}
        </div>
      </Body>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const shops = await prisma.shop.findMany({
    where: {
      shopName: { not: "" },
      logoPhoto: { not: "" },
      website: { not: "" },
    },
  });

  return {
    props: {
      artisans: [...JSON.parse(JSON.stringify(shops))],
    },
  };
};

export default ShopsPage;
