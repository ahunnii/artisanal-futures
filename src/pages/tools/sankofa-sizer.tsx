import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import BodyPartsUI from "~/components/tools/sankofa-sizer/body-parts-ui";
import BodyMeasurements from "~/components/tools/sankofa-sizer/measurements-ui";
import Popup from "~/components/tools/sankofa-sizer/popup";
import VirtualPattern from "~/components/tools/sankofa-sizer/virtual-pattern";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ToolLayout from "~/layouts/tool-layout";

const SankofaSizer = () => {
  return (
    <ToolLayout>
      <div className="mx-auto flex h-full w-full max-w-7xl rounded-md border border-gray-300 bg-white">
        <Tabs defaultValue="parts" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="parts">Select Body Parts</TabsTrigger>{" "}
            <TabsTrigger value="stats">Body Measurements</TabsTrigger>
            <TabsTrigger value="pattern">Upload Pattern</TabsTrigger>
            <TabsTrigger value="generate">Actual Pattern</TabsTrigger>
            <Link href="https://svelte.dev/repl/7b61a8d2610f43f193ac16bb52029215?version=4.2.1">
              <LinkIcon className=" h-4 w-4" />
            </Link>
          </TabsList>
          <TabsContent value="parts">
            {" "}
            <BodyPartsUI />
          </TabsContent>{" "}
          <TabsContent value="stats">
            {" "}
            <BodyMeasurements />
          </TabsContent>
          <TabsContent value="pattern">
            <VirtualPattern />
          </TabsContent>
          <TabsContent value="generate" className="flex  h-full flex-grow">
            {" "}
            {/* <Popup /> */}
            {/* <div className="flex  h-full  flex-col items-center justify-center bg-gray-100"> */}
            <div className="mx-auto my-auto w-96 rounded-lg bg-white p-4 shadow-md">
              <h1 className="mb-2 text-4xl font-bold">Coming Soon</h1>
              <p className="text-xl text-gray-600">
                Stay tuned for something amazing! The ability to project your
                patterns to cut with precision!
              </p>
            </div>
            {/* </div> */}
          </TabsContent>
        </Tabs>
      </div>
      {/* <div className="flex flex-row">
        <div className="m-1 border border-r-8 border-gray-300 p-24 w-full"> */}

      {/* </div> */}
      {/* <div className="m-1 border border-r-8 border-gray-300 p-24">
          <BodyMeasurements />
        </div>
        <div className="m-1 border border-r-8 border-gray-300 p-24">
          <VirtualPattern />
        </div>
        <div className="m-1 border border-r-8 border-gray-300 p-24">
          <Popup />
        </div> */}
      {/* </div> */}
    </ToolLayout>
  );
};

export default SankofaSizer;
