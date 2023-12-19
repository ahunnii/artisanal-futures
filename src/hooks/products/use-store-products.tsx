import axios from "axios";
import { useEffect, useState } from "react";
import type { Artisan, Attribute, Product } from "~/types";

const PRODUCT_ENDPOINT = "/api/products/get-store-products";

const useStoreProducts = (storeName: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  // const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  // const [isSorting, setIsSorting] = useState<boolean>(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.post(PRODUCT_ENDPOINT, {
        storeName,
      }); // Pulls local file for testing

      if (response.status != 200) {
        throw new Error("Failed to fetch products");
      }

      const data = (await response.data) as Product[];

      const formattedProducts: Product[] = data
        .map((product: Product, key: number) => {
          return {
            ...product,
            the_artisan: product.the_artisan.toLowerCase(),
            principles: product.principles.toLowerCase(),
            id: key,
          };
        })
        .sort((a, b) => (a.craftID > b.craftID ? 1 : -1));
      const formattedArtisans: Artisan[] = Array.from(
        new Set(
          data.map((product: Product) => product.the_artisan.toLowerCase())
        )
      );
      const formattedAttributes: Attribute[] = Array.from(
        new Set(
          data
            .flatMap((product: Product) =>
              product.principles.toLowerCase().split(",")
            )
            .filter((attribute: string) => attribute.trim() !== "")
        )
      );
      setProducts(formattedProducts);
      setArtisans(formattedArtisans);
      setAttributes(formattedAttributes);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (storeName) void fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeName]);

  return {
    products,
    artisans,
    attributes,
    isLoading,
    isError,
  };
};

export default useStoreProducts;
