import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Product } from "~/apps/product/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for GET method
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed if not GET
  }

  const payloadForProducts = {
    query: {
      content: "string",
    },
    response_model: [
      {
        name: "string",
        description: "string",
        principles: "string",
        the_artisan: "string",
        url: "string",
        image:
          "https://cdn1.vectorstock.com/i/thumb-large/46/50/missing-picture-page-for-website-design-or-mobile-vector-27814650.jpg",
        craftID: "string",
      },
    ],
  };

  const products = await axios.post(
    "https://data.artisanalfutures.org/api/v1/products/search/",
    payloadForProducts
  );
  if (products.status !== 200) {
    return res.status(500).json({ error: "Error fetching data" });
  }

  const data = products.data as Product[];
  const filteredProducts = [
    ...new Map(
      data
        .filter((product) => product.principles !== "")
        .map((item) => [item.craftID, item])
    ).values(),
  ];

  // Send the JSON data
  res.status(200).json(filteredProducts);
}
