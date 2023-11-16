/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "~/server/supabase/client";

const archiveHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { routeId } = req.body;

      const { data: specificData, error: specificError } =
        await supabase.storage
          .from("routes")
          .download(`${routeId as string}.json`);

      const { data, error } = await supabase.storage
        .from("routes")
        .move(`${routeId as string}.json`, `archive/${routeId as string}.json`);

      //   console.log(error);
      //   if (error) return res.status(500).json({ error });
      //   return res.status(200).json({ data });
      console.log(data, error);
      return res.status(200).json({ data, error });
    } catch (e) {
      return res.status(500).json({ error: "Error getting routes" });
    }
  } else if (req.method === "GET") {
    try {
      const fetchAll = req.query.fetchAll;

      if (fetchAll) {
        const { data } = await supabase.storage.from("routes").list("archive");
        return res.status(200).json(data);
      }
      const { data } = await supabase.storage.from("routes").list("archive");

      console.log(req.body);
      if (req.query.data) {
        const { data: specificData, error: specificError } =
          await supabase.storage
            .from("routes")
            .download(`archive/${req.query.data as string}.json`);

        if (specificError)
          return res.status(500).json({ error: specificError });

        const arrayBuffer = await specificData.arrayBuffer();
        const jsonString = new TextDecoder("utf-8").decode(arrayBuffer);
        const jsonObject = JSON.parse(jsonString);

        return res.status(200).json({ data: jsonObject });
      }
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: "Error getting routes" });
    }
  }
};

export default archiveHandler;
