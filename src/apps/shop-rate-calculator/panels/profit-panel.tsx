import { useState, type FC } from "react";
import { Slider } from "~/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
interface IProps {
  sliderValue: number;
  setSliderValue: (v: unknown) => void;
}
const ProfitsPanel: FC<IProps> = ({ sliderValue, setSliderValue }) => {
  const [, setShowTooltip] = useState(false);
  return (
    <>
      <div className="mt-4 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold leading-5 text-slate-800 sm:text-3xl md:text-4xl">
          Percentage Profit
        </h2>
        <p className="text-base text-slate-500">
          None of the previous fields gives you a profit, so adjust the
          percentage to get one.
        </p>
      </div>
      <form className="mt-10">
        {/* <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
						25%
					</SliderMark>
					<SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
						50%
					</SliderMark>
					<SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
						75%
					</SliderMark> */}
        {/* <SliderTrack>
						<SliderFilledTrack />
					</SliderTrack> */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Slider
                id="slider"
                defaultValue={[0]}
                min={0}
                max={100}
                step={1}
                onValueChange={(val) => setSliderValue(val[0])}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{sliderValue}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* 
					<Tooltip hasArrow bg="teal.500" color="white" placement="top" isOpen={showTooltip} label={`${sliderValue}%`}>
						<SliderThumb />
					</Tooltip> */}
        {/* </Slider> */}
      </form>
    </>
  );
};

export default ProfitsPanel;
