import { useEffect, useState } from "react";
import type { Artisan, Attribute, Product } from "~/types";

const PRODUCT_ENDPOINT = "/api/products";
const ASSESSMENT_ENDPOINT = "/api/assessment";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [additional, setAdditional] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const response = await fetch(PRODUCT_ENDPOINT);
    if (response.status != 200) {
      throw new Error("Failed to fetch products");
    }

    const data = (await response.json()) as Product[];
    console.log(data);
    setProducts(data);
  };
  const fetchAdditional = async () => {
    const response = await fetch(`${ASSESSMENT_ENDPOINT}?keyword=${" "}`);
    if (response.status != 200) {
      throw new Error("Failed to fetch products");
    }

    const data = (await response.json()) as Product[];
    console.log(data);
    return data;
  };

  useEffect(() => {
    console.log("useEffect");
    fetchProducts()
      .then(() => {
        fetchAdditional()
          .then((data) => {
            setAdditional(data);
            console.log(data);
            console.log(products);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return { products };
};
