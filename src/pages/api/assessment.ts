import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Product } from "~/apps/product/types";
// import data from "~/json/ecodata.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for GET method
  if (req.method != "GET") {
    return res.status(405).end(); // Method Not Allowed if not GET
  }
  const query = req.query;
  const { keyword } = query;
  const payloadForProducts = {
    query: {
      content: keyword as string,
    },
    response_model: [
      {
        name: "",
        description: "",
        principles: "",
        the_artisan: "",
        url: "",
        image: "",
        craftID: "",
        assessment: [],
      },
    ],
  };

  const products = await axios.post(
    "https://data.artisanalfutures.org/api/v1/assessment/product-search-with-assessment/",
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
