import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { FC } from "react";

import Body from "~/components/body";
import ArtisanCard from "~/components/shops/artisan-card";
import { Shop } from "~/types";

interface IProps {
  artisans: Shop[];
}

const ShopsPage: FC<IProps> = ({ artisans }) => {
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
          <div className=" flex basis-full p-4 md:basis-1/2 lg:basis-1/4 ">
            {artisans?.map((artisan: Shop, index: number) => (
              <ArtisanCard key={index} {...artisan} />
            ))}
          </div>{" "}
        </div>
      </Body>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const artisans = [
    {
      id: "dabls",
      owner_name: "Olayami Dabls",
      business_name: "Dabls' MBAD African Bead Museum",
      website: "http://www.mbad.org/",
      cover_photo: "/img/demo/cover_dabls.jpg",
    },
  ];

  return {
    props: {
      artisans,
    },
  };
};

export default ShopsPage;
