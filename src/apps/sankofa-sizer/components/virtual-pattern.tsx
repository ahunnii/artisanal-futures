import PatternSetter from "~/apps/sankofa-sizer/components/pattern-setter";
import VirtualResize from "~/apps/sankofa-sizer/components/virtual-resize";
import { useSizerStore } from "~/apps/sankofa-sizer/hooks/use-sizer";

const VirtualPattern = () => {
  const actual_pattern = useSizerStore((state) => state.actual_pattern);

  if (actual_pattern.blob) return <VirtualResize />;
  else return <PatternSetter />;
};

export default VirtualPattern;
