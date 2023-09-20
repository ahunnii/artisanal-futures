import { useState, type ChangeEvent } from "react";
import { useSizerStore } from "~/components/tools/sankofa-sizer/store";
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
    <>
      <div>
        {/* {!imageUrl && ( */}
        <>
          {/* <!-- Input box for URL --> */}
          <input
            type="text"
            placeholder="Enter image URL"
            defaultValue={imageUrl}
          />

          {/* <!-- Input box for file upload --> */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            aria-label="pattern upload"
          />
          {/* <!-- demo button :D --> */}
          <button type="button" onClick={setPatternDemo}>
            Sleeve block (Demo)
          </button>
        </>
        {/* )} */}
      </div>
    </>
  );
};

export default PatternSetter;
