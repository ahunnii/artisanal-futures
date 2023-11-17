import Head from "next/head";
import { useParams } from "next/navigation";

import Body from "~/components/body";
import ProductCard from "~/components/products/product-card";
import ProfileCard from "~/components/shops/profile-card";
import Container from "~/components/ui/container";
import PageLoader from "~/components/ui/page-loader";
import useStoreProducts from "~/hooks/products/use-store-products";

import { api } from "~/utils/api";

const ProfilePage = () => {
  const params = useParams();
  const { data: shop, isLoading } = api.shops.getShopById.useQuery({
    id: (params?.shopId as string) ?? "",
  });

  const { products, isLoading: isProductsLoading } = useStoreProducts(
    shop?.shopName ?? ""
  );

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
          <ProfileCard className="mx-auto h-full " {...shop} />
        )}
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Products
        </h2>
        <Container className="p-4 shadow-inner">
          <div className="flex flex-col md:flex-row md:flex-wrap">
            {isProductsLoading && <PageLoader />}
            {products !== null ? (
              products.map((product) => (
                <div
                  className="flex basis-full justify-center p-4 md:basis-1/3 lg:basis-1/4"
                  key={product.name}
                >
                  <ProductCard {...product} key={product.craftID} />
                </div>
              ))
            ) : (
              <div>No products found.</div>
            )}
          </div>
        </Container>
      </Body>
    </>
  );
};

export default ProfilePage;
