import { useCallback, useEffect } from "react";
import { Loader } from "~/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useStyleTransferStore } from "~/store";
import { loadStyleModel, loadStyleTransformer } from "~/utils/style-transfer";

const TransformerSelector = () => {
  const {
    modelType,
    isModelLoading,

    transformerType,
    isTransformerLoading,
    setValue,
  } = useStyleTransferStore((state) => state);

  const handleModelOnChange = useCallback(
    async (value: string) => {
      setValue("modelType", value);
      setValue("modelData", null);
      setValue("isModelLoading", true);

      const loadModel = loadStyleModel(value);

      if (loadModel === null) return;
      await loadModel(null)
        .then((model) => {
          setValue("modelData", model);
        })
        .finally(() => setValue("isModelLoading", false));
    },
    [setValue]
  );

  const handleTransformerOnChange = useCallback(
    async (value: string) => {
      setValue("transformerType", value);
      setValue("transformerData", null);
      setValue("isTransformerLoading", true);

      const loadTransformer = loadStyleTransformer(value);

      if (loadTransformer === null) return;
      await loadTransformer(null)
        .then((transformer) => {
          setValue("transformerData", transformer);
        })
        .finally(() => setValue("isTransformerLoading", false));
    },
    [setValue]
  );

  useEffect(() => {
    handleModelOnChange("mobilenet").catch((err) => console.error(err));
    handleTransformerOnChange("separable").catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="my-10 flex flex-row justify-around gap-5">
        <div className="flex flex-col">
          <h5>Select the quality of your style model:</h5>

          <div className="flex flex-row items-center">
            <Select
              defaultValue={modelType}
              disabled={isModelLoading}
              onValueChange={(value) => void handleModelOnChange(value)}
            >
              <SelectTrigger className="w-full" id="model-select-style">
                <SelectValue placeholder="Select a content image" />
              </SelectTrigger>
              <SelectContent>
                {" "}
                <SelectItem value="mobilenet">
                  [Fast] Distilled MobileNet style model (9.6MB)
                </SelectItem>
                <SelectItem value="inception">
                  [High quality] Original Inceptionv3 style model (36.3MB)
                </SelectItem>
              </SelectContent>
            </Select>
            {isModelLoading && <Loader size={20} />}
          </div>
        </div>
        <div className="flex flex-col">
          {" "}
          <h5>Select the quality of your style transformer:</h5>
          <div className="flex flex-row items-center">
            <Select
              value={transformerType}
              disabled={isTransformerLoading}
              onValueChange={(value) => void handleTransformerOnChange(value)}
            >
              <SelectTrigger className="w-full" id="model-select-transformer">
                <SelectValue placeholder="Select a content image" />
              </SelectTrigger>
              <SelectContent>
                {" "}
                <SelectItem value="separable">
                  [Fast] Separable_conv2d transformer (2.4MB)
                </SelectItem>
                <SelectItem value="original">
                  [High quality] Original transformer model (7.9MB)
                </SelectItem>
              </SelectContent>
            </Select>
            {isTransformerLoading && <Loader size={20} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransformerSelector;
