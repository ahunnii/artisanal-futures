import type { FC } from "react";
import InchMarker from "./inch-marker"; //Our virtual Marker

interface IProps {
  ppi_slider: number;
  length?: number;
  unit?: string;
}

const ActualInch: FC<IProps> = ({
  ppi_slider = 72,
  length = 3,
  unit = "inches",
}) => {
  return (
    <>
      <div>
        <InchMarker unit={unit} length={length} pixels_per_inch={ppi_slider} />
      </div>

      <label>
        <span>{ppi_slider} ppi</span>
        <input type="range" min={1} max={326} step={1} value={ppi_slider} />
      </label>
      <label>
        <input type="number" min={1} max={50} step={1} value={length} />{" "}
        {unit == "inches" ? "in" : "mm"} length
      </label>
    </>
  );
};

export default ActualInch;
