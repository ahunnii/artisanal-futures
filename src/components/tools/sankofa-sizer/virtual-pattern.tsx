import { useEffect } from "react";
import { useSizerStore } from "~/components/tools/sankofa-sizer/store";
import PatternSetter from "./pattern-setter";
import VirtualResize from "./virtual-resize";

const VirtualPattern = () => {
  const actual_pattern = useSizerStore((state) => state.actual_pattern);

  if (actual_pattern.blob) return <VirtualResize />;
  else return <PatternSetter />;
};

export default VirtualPattern;
