import Body from "~/components/body";
import Camera from "~/components/tools/style-transfer/camera";
import CombineTwoStyles from "~/components/tools/style-transfer/combine-two-styles";
import StylizeAnImage from "~/components/tools/style-transfer/stylize-an-image";
import TransferDescription from "~/components/tools/style-transfer/transfer-description";
import TransformerSelector from "~/components/tools/style-transfer/transformer-selector";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const StyleTransfer = () => {
  return (
    <>
      <Body>
        <input
          type="file"
          id="file-select"
          className="hidden"
          accept="image/x-png,image/gif,image/jpeg"
          aria-label="File upload"
        />
        {/* <!-- As a heading --> */}
        <div
          className="jumbotron jumbotron-fluid py-4"
          style={{ textAlign: "center", backgroundColor: "#f5f5f5" }}
        >
          <div className="container">
            <h1>Arbitrary Style Transfer in the Browser</h1>
          </div>
        </div>
        <div className="">
          <div
            id="mobile-warning"
            hidden
            className="alert alert-warning"
            role="alert"
          >
            This site may have problems functioning on mobile devices.
            Don&apos;t worry, you can still read the description below!
          </div>

          <Tabs defaultValue="stylize" className="w-full">
            <TabsList>
              <TabsTrigger value="stylize"> Stylize an image</TabsTrigger>
              <TabsTrigger value="combine"> Combine two styles</TabsTrigger>
            </TabsList>
            <TabsContent value="stylize">
              <StylizeAnImage />
            </TabsContent>
            <TabsContent value="combine">
              {" "}
              <CombineTwoStyles />
            </TabsContent>
          </Tabs>

          <TransformerSelector />
          <canvas id="hidden-canvas" className="hidden"></canvas>
          <Camera
            onSnap={(v) => {
              console.log(v);
            }}
          />
          <TransferDescription />
        </div>
      </Body>
    </>
  );
};

export default StyleTransfer;
