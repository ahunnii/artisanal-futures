import { useEffect, useState } from "react";
import type { Artisan, Attribute } from "~/types";

import type { Product } from "~/features/product/types";

const PRODUCT_ENDPOINT = "/api/products";
const ASSESSMENT_ENDPOINT = "/api/assessment";

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(PRODUCT_ENDPOINT); // Pulls local file for testing

      if (response.status != 200) {
        throw new Error("Failed to fetch products");
      }

      const data = (await response.json()) as Product[];

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

  const sortWithAI = async (keyword: string) => {
    setIsSorting(true);
    const res = await fetch(`${ASSESSMENT_ENDPOINT}?keyword=${keyword}`);
    setIsSorting(false);
    if (res.status != 200) {
      throw new Error("Failed to fetch products");
    }

    return (await res.json()) as Product[];
  };

  const filterProducts = (criteria: {
    principles?: string[];
    the_artisan?: string[];
    query?: string;
  }) => {
    const filtered = products.filter((product) => {
      // Filter by multiple principles
      if (criteria.principles && criteria.principles.length > 0) {
        // Only include product if every selected principle is found in the product's principles
        const productPrinciplesArray = product.principles
          .split(",")
          .map((p) => p.trim());
        if (
          !criteria.principles.every((p) => productPrinciplesArray.includes(p))
        ) {
          return false;
        }
      }

      // Filter by multiple artisans
      if (criteria.the_artisan && criteria.the_artisan.length > 0) {
        if (!criteria.the_artisan.includes(product.the_artisan)) {
          return false;
        }
      }

      // Filter by query string in product name or description
      if (
        criteria.query &&
        !product.name.toLowerCase().includes(criteria.query.toLowerCase()) &&
        !product.description
          .toLowerCase()
          .includes(criteria.query.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    setFilteredProducts(filtered);
  };

  const resetProducts = () => {
    setFilteredProducts(products);
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return {
    products: filteredProducts,
    artisans,
    attributes,
    isLoading,
    isError,
    sortWithAI,
    isSorting,
    filterProducts,
    resetProducts,
    setFilteredProducts,
  };
};

export default useProducts;
