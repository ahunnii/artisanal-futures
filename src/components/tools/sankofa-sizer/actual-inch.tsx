import type { FC } from "react";
import { Slider } from "~/components/ui/slider";
import InchMarker from "./inch-marker"; //Our virtual Marker

interface IProps {
  ppiSliderValue: number;
  setPpiSliderValue: (val: number) => void;
  length?: number;
  unit?: string;
}

const ActualInch: FC<IProps> = ({
  ppiSliderValue = 72,
  setPpiSliderValue,
  length = 3,
  unit = "inches",
}) => {
  return (
    <>
      <div>
        <InchMarker
          unit={unit}
          length={length}
          pixels_per_inch={ppiSliderValue}
        />
      </div>

      <label>
        <span>{ppiSliderValue} ppi</span>

        <Slider
          min={1}
          max={326}
          step={1}
          value={[ppiSliderValue]}
          onValueChange={(val) => setPpiSliderValue(val[0]!)}
        />
      </label>
      <label>
        <input type="number" min={1} max={50} step={1} value={length} />{" "}
        {unit == "inches" ? "in" : "mm"} length
      </label>
    </>
  );
};

export default ActualInch;
