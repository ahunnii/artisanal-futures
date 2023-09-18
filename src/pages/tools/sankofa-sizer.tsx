import BodyPartsUI from "~/components/tools/sankofa-sizer/body-parts-ui";
import BodyMeasurements from "~/components/tools/sankofa-sizer/measurements-ui";
import Popup from "~/components/tools/sankofa-sizer/popup";
import VirtualPattern from "~/components/tools/sankofa-sizer/virtual-pattern";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ToolLayout from "~/layouts/tool-layout";

const SankofaSizer = () => {
  return (
    <ToolLayout>
      <div className="mx-auto flex h-full w-full max-w-7xl rounded-md border border-gray-300 ">
        <Tabs defaultValue="parts" className="w-full">
          <TabsList>
            <TabsTrigger value="parts">Select Body Parts</TabsTrigger>{" "}
            <TabsTrigger value="stats">Body Measurements</TabsTrigger>
            <TabsTrigger value="pattern">Upload Pattern</TabsTrigger>
            <TabsTrigger value="generate">Actual Pattern</TabsTrigger>
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
          <TabsContent value="generate">
            {" "}
            <Popup />
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
