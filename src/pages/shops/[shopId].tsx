import Head from "next/head";
import { useParams } from "next/navigation";

import Body from "~/components/body";
import ProfileCard from "~/components/shops/profile-card";
import PageLoader from "~/components/ui/page-loader";

import { api } from "~/utils/api";

const ProfilePage = () => {
  const params = useParams();
  const { data: shop, isLoading } = api.shops.getShopById.useQuery({
    id: (params?.shopId as string) ?? "",
  });
  return (
    <>
      <Head>
        <title>Profile | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>
        {isLoading ? (
          <PageLoader />
        ) : (
          <ProfileCard className="mx-auto  h-full " {...shop} />
        )}
      </Body>
    </>
  );
};

export default ProfilePage;
