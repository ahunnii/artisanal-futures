// pages/api/importClients.js
import { importClientsFromAllCSV as annArborClients } from "../../../prisma/seeds/annarbor/importClients";
import { importClientsFromAllCSV as deeplyRootedClients } from "../../../prisma/seeds/deeplyrooted/importClients";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      console.log(">>>> ", "in importClients handler", process.cwd());
      // Call your function to import clients from CSV
      const seedName = req.body.seedName;
      // Assuming the function needs a file path as an argument
      let importClientsFromAllCSV;
      switch (seedName) {
        case "deeplyrooted":
          importClientsFromAllCSV = deeplyRootedClients;
          console.log("pulling from Detroit");
          break;
        case "annarbor":
          importClientsFromAllCSV = annArborClients;
          console.log("pull from ann arbor");
          break;
        default:
          throw new Error(
            `Unknown Depot magic code name ${seedName}! Can not automatically import clients!`
          );
      }
      const importResult = await importClientsFromAllCSV(seedName);
      res.status(200).json({
        message: "Clients imported successfully",
        result: importResult,
      });
    } catch (error) {
      console.error("Failed to import clients:", error);
      res
        .status(500)
        .json({ message: "Failed to import clients", error: error.message });
    }
  } else {
    // Handle any requests that aren't POST
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
