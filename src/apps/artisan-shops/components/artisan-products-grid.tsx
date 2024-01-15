import Container from "~/components/ui/container";
import PageLoader from "~/components/ui/page-loader";

import { ProductCard, useStoreProducts } from "~/apps/product";

const ArtisanProductsGrid = ({
  shopName,
}: {
  shopName: string | undefined;
}) => {
  const { products, isLoading } = useStoreProducts(shopName ?? "");

  if (isLoading) return <PageLoader />;

  if (products?.length === 0)
    return (
      <div className="my-auto">
        <p className="my-auto text-xl text-muted-foreground">
          This shop has no products yet. But check back later to see what they
          have!
        </p>
      </div>
    );

  return (
    <>
      <Container className="p-4 shadow-inner">
        <div className="flex flex-col md:flex-row md:flex-wrap">
          {products.map((product) => (
            <div
              className="flex basis-full justify-center p-4 md:basis-1/3 lg:basis-1/4"
              key={product.name}
            >
              <ProductCard {...product} key={product.craftID} />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

export default ArtisanProductsGrid;
