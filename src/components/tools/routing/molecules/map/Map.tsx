import dynamic from "next/dynamic";
import { FC, forwardRef } from "react";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
});

// Set default sizing to control aspect ratio which will scale responsively
// but also help avoid layout shift

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

interface IProps {
  width?: number;
  height?: number;
}
const Map = forwardRef((props, ref) => {
  // const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = props;
  return <DynamicMap {...props} ref={ref} />;
});

Map.displayName = "Map";
export default Map;
