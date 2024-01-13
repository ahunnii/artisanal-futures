import { useState, type ChangeEvent } from "react";
import { useSizerStore } from "~/apps/sankofa-sizer/store";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
const PatternSetter = () => {
  const { updateValue } = useSizerStore((state) => state);

  const [imageUrl, setImageUrl] = useState<string>("");

  // function setSleeveBlock() {
  //   setImageUrl("/img/sankofa-sizer-demo.jpg");

  //   updateValue("actual_pattern", {
  //     ...actual_pattern,
  //     blob: "/img/sankofa-sizer-demo.jpg",
  //   });
  // }

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!event?.target.files) return;
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          setImageUrl(e.target.result as string); // Set the image URL to base64 data
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const setPatternDemo = () => {
    updateValue("actual_pattern", {
      blob: "/img/sankofa-sizer-demo.jpg",
      width: 488,
      height: 615,
    });
  };

  return (
    <div className="flex w-full flex-col justify-between bg-white p-8">
      {" "}
      <h3 className="text-lg font-semibold">Upload your pattern</h3>
      <p>Choose from a URL or a file upload</p>
      <div className="flex flex-col  gap-5 pt-8">
        {/* {!imageUrl && ( */}
        <div className="flex w-1/3 flex-col text-center">
          {/* <!-- Input box for URL --> */}
          <label className="block w-full">
            <span>Image URL of your pattern:</span>
            <Input
              type="text"
              placeholder="Enter image URL"
              defaultValue={imageUrl}
            />
          </label>
          <div className="my-3 flex items-center px-3">
            <hr className="w-full border-slate-600" />
            <span className="mx-3 text-slate-500">or</span>
            <hr className="w-full border-slate-600" />
          </div>

          {/* <!-- Input box for file upload --> */}
          <label className="block w-full">
            <span>Upload a file of your pattern:</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              aria-label="pattern upload"
            />{" "}
          </label>
        </div>

        {/* <!-- demo button :D --> */}
        <Button type="button" onClick={setPatternDemo} className="mt-12 w-1/3">
          Sleeve block (Demo)
        </Button>
        {/* )} */}
      </div>
    </div>
  );
};

export default PatternSetter;
