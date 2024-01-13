import type { GetServerSidePropsContext } from "next";
import type { ParsedUrlQuery } from "querystring";
import type { FC } from "react";

import { useParams, useSearchParams } from "next/navigation";

import useProducts from "~/apps/product/hooks/useProducts";
import SiteLayout from "~/layouts/site-layout";

import ProductCard from "~/apps/product/components/product-card";
import { Product } from "~/apps/product/types";
import AttributeFilter from "~/features/filter/AttributeFilter";
import { api } from "~/utils/api";

interface Params extends ParsedUrlQuery {
  sizeId: string;
  categoryId: string;
  sizeVariant: string;
}

const CategoryPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  console.log(searchParams.toString());
  //   const { data: category } = api.categories.getCategory.useQuery({
  //     categoryId: params?.categoryId as string,
  //   });

  //   const { data: products } = api.products.getAllStoreProducts.useQuery({
  //     categoryId: params?.categoryId as string,
  //     queryString: searchParams.toString(),
  //   });

  const {
    // products,
    // attributes: principles,
    // artisans,
    isLoading,
    isError,
    sortWithAI,
    isSorting,
    filterProducts,
    resetProducts,
    setFilteredProducts,
  } = useProducts();

  const { data: payload } = api.products.getAllProducts.useQuery();
  //   const{products, artisans, attributes} = payload!;
  //   console.log(products);payload?.
  return (
    <SiteLayout>
      {payload?.products && (
        <div className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            {/* <MobileFilters data={category?.attributes} /> */}
            <div className="hidden lg:block">
              <AttributeFilter
                title={`Artisans`}
                valueKey={`artisans`}
                data={payload?.artisans}
              />
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {/* {products?.length === 0 && <NoResults />} */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {payload?.products?.map((item: Product) => (
                  <ProductCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
};

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const { sizeId, categoryId } = ctx.query as Params;

//   const products = await getProducts({
//     categoryId,

//     sizeId,
//   });

//   const sizes = await getSizes();

//   const category = await getCategory(categoryId);

//   const attributes = category.attributes.map((attribute) =>
//     attribute.name.toLowerCase()
//   );

//   if (Object.keys(ctx.query).length === 1 && ctx.query?.categoryId) {
//     return {
//       props: {
//         products,
//         sizes,

//         category,
//       },
//     };
//   }

//   const variants = products.flatMap((product) => product.variants);

//   const filteredProductIds = variants
//     .filter((variant) => {
//       return attributes.every((attribute) => {
//         if (ctx.query?.[`${attribute}Variant`] !== undefined)
//           return variant.values.includes(
//             ctx.query?.[`${attribute}Variant`] as string
//           );
//         return true;
//       });
//     })
//     .map((variant: Variation) => variant?.productId);

//   const variantProducts = products.filter((product) =>
//     filteredProductIds.includes(product.id)
//   );

//   return {
//     props: {
//       products: variantProducts,
//       sizes,
//       category,
//     },
//   };
// };
export default CategoryPage;
