import * as tf from "@tensorflow/tfjs";
import "babel-polyfill";

import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Slider } from "~/components/ui/slider";
import { Switch } from "~/components/ui/switch";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { Shuffle } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useStyleTransferStore, type StyleTransferImage } from "~/store";
import { classNames, cn } from "~/utils/styles";

tf.ENV.set("WEBGL_PACK", false);

const StylizeAnImage = () => {
  const { styleStrength, setValue, finalImage, modelData, transformerData } =
    useStyleTransferStore((state) => state);

  return (
    <>
      <div className="flex flex-row justify-around">
        <ContentImage />
        <StyleImage />
      </div>

      <div className="flex flex-row justify-around">
        <div className="col-md-6 offset-md-3">
          <canvas id="stylized" className="centered"></canvas>
          <br />
          <div className="flex items-center gap-2">
            <label htmlFor="stylized-img-ratio">Stylization strength</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <QuestionMarkCircledIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    This parameter affects the stylization strength. The further
                    to the right, the stronger the stylization. This is done via
                    interpolation between the style vectors of the content and
                    style images.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
          </div>
          <Slider
            value={[styleStrength]}
            min={0}
            max={100}
            step={1}
            onValueChange={(val) => setValue("styleStrength", val[0])}
            className={cn("centered w-full py-2")}
            id="style-img-size"
          />
        </div>
      </div>
      <div className="mx-auto my-4 flex w-full flex-row justify-center gap-4">
        <Button
          disabled={
            finalImage.isGenerating ||
            modelData === null ||
            transformerData === null
          }
          id="style-button"
          type="button"
          className="btn btn-primary btn-block"
        >
          {finalImage.isGenerating
            ? "Loading stylization model. Please wait.."
            : "Stylize"}
        </Button>

        <Button
          type="button"
          variant={"outline"}
          id="randomize"
          className="btn btn-light btn-block gap-2"
        >
          <Shuffle /> Randomize parameters
        </Button>
      </div>
    </>
  );
};

const ContentImage = () => {
  const { contentImage, setContentImage } = useStyleTransferStore(
    (state) => state
  );
  const handleContentResize = (value: [number]) => {
    setContentImage({
      ...contentImage,
      height: value[0],
    } as StyleTransferImage);
  };
  const handleContentImage = (value: string) => {
    if (value === "file" || value === "pic") {
      console.log(value);
    }

    setContentImage({
      ...contentImage,
      src: `/img/style_transfer/${value}.jpg`,
    } as StyleTransferImage);
  };

  return (
    <div className=" relative mx-5 my-4  flex flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        id="content-img"
        className="self-center"
        src={contentImage?.src}
        height={contentImage?.height}
        style={{ height: `${contentImage?.height}px` }}
        alt="content image"
      />
      <br />

      <div className="flex flex-row items-center gap-4">
        <label htmlFor="content-img-size">
          Content image size [{contentImage?.height}px]
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <QuestionMarkCircledIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                A bigger content image results in a more detailed output, but
                increases the processing time significantly.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>{" "}
      </div>

      <Slider
        value={[contentImage?.height ?? 256]}
        min={256}
        max={400}
        step={1}
        onValueChange={handleContentResize}
        className={cn("centered w-full py-2")}
        id="style-img-size"
      />
      <br />

      <Select onValueChange={handleContentImage} defaultValue="chicago">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a content image" />
        </SelectTrigger>
        <SelectContent>
          {" "}
          <SelectItem value="pic">Take a picture</SelectItem>
          <SelectItem value="file">Select from file</SelectItem>
          <SelectItem value="stata">stata</SelectItem>
          <SelectItem value="diana">diana</SelectItem>
          <SelectItem value="golden_gate">golden_gate</SelectItem>
          <SelectItem value="beach">beach</SelectItem>
          <SelectItem value="chicago">chicago</SelectItem>
          <SelectItem value="statue_of_liberty">statue_of_liberty</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const StyleImage = () => {
  const { styleImage, setStyleImage } = useStyleTransferStore((state) => state);

  const handleStyleResize = (value: [number]) => {
    setStyleImage({
      ...styleImage,
      height: value[0],
    } as StyleTransferImage);
  };

  const handleStyleImage = (value: string) => {
    if (value === "file" || value === "pic") {
      console.log(value);
    }
    setStyleImage({
      ...styleImage,
      src: `/img/style_transfer/${value}.jpg`,
    } as StyleTransferImage);
  };
  const handleSquareStyleImage = (value: boolean) => {
    setStyleImage({
      ...styleImage,
      isSquare: value,
    } as StyleTransferImage);
  };
  return (
    <div className=" mx-5 my-4 flex  flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        id="style-img"
        className={classNames(
          "self-center",
          styleImage?.isSquare ? "aspect-square" : ""
        )}
        src={styleImage?.src}
        height={styleImage?.height}
        style={{ height: `${styleImage?.height}px` }}
        alt="style image"
      />
      <br />

      <div className="flex w-full flex-row items-center gap-4">
        <label htmlFor="style-img-size">
          Style image size [{styleImage?.height}px]
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <QuestionMarkCircledIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Changing the size of a style image usually affects the texture
                &quot;seen&quot; by the network.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="ml-auto">
              <Checkbox
                id="style-img-square"
                onCheckedChange={handleSquareStyleImage}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Force image to square</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
        <div className="ml-auto flex items-center space-x-2">
          <Switch id="square-mode" onCheckedChange={handleSquareStyleImage} />
          <Label htmlFor="square-mode">Force as square</Label>
        </div>
      </div>
      <Slider
        value={[styleImage?.height ?? 256]}
        min={100}
        max={400}
        step={1}
        onValueChange={handleStyleResize}
        className={cn("centered w-full py-2")}
        id="style-img-size"
      />

      <br />

      <Select onValueChange={handleStyleImage} defaultValue="seaport">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="file">Select from file</SelectItem>
          <SelectItem value="random">Random image from wikiart.org</SelectItem>
          <SelectItem value="udnie">udnie</SelectItem>
          <SelectItem value="stripes">stripes</SelectItem>
          <SelectItem value="bricks">bricks</SelectItem>
          <SelectItem value="clouds">clouds</SelectItem>
          <SelectItem value="towers">towers</SelectItem>
          <SelectItem value="sketch">sketch</SelectItem>
          <SelectItem value="seaport">seaport</SelectItem>
          <SelectItem value="red_circles">red_circles</SelectItem>
          <SelectItem value="zigzag">zigzag</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
export default StylizeAnImage;
