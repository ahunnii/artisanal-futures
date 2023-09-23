import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "~/server/supabase/client";

const trackHandling = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { data } = await supabase.from("coordinates").select("*");

      //   if (req.query.data) {
      //     const { data: specificData, error: specificError } =
      //       await supabase.storage
      //         .from("routes")
      //         .download(`${req.query.data as string}.json`);

      //     if (specificError)
      //       return res.status(500).json({ error: specificError });

      //     const arrayBuffer = await specificData.arrayBuffer();
      //     const jsonString = new TextDecoder("utf-8").decode(arrayBuffer);
      //     const jsonObject = JSON.parse(jsonString);

      //     return res.status(200).json({ data: jsonObject });
      //   }
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: "Error getting routes" });
    }
  } else if (req.method === "POST") {
    try {
      const { file, fileName } = req.body;

      // Convert the object to a string
      const dataString = JSON.stringify(file, null, 2); // pretty print the JSON

      // Convert string to base64
      const base64Data = Buffer.from(dataString, "utf8").toString("base64");

      // Convert base64 to ArrayBuffer
      const dataBuffer = Uint8Array.from(atob(base64Data), (c) =>
        c.charCodeAt(0)
      ).buffer;
      console.log(fileName);
      const { data, error } = await supabase.storage
        .from("routes")
        .upload(`${fileName}.json`, dataBuffer);

      if (error) return res.status(500).json({ error });
      return res.status(200).json({ data });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ e });
    }
  }
};

export default trackHandling;
