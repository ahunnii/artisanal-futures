import { useEffect, useMemo, useState, type FC } from "react";

interface IProps {
  unit?: string;
  length?: number;
  pixels_per_inch?: number;
  height?: number;
}

const InchMarker: FC<IProps> = ({
  unit = "millimeters",
  length = 1,
  pixels_per_inch = 96,
  height = 45,
}) => {
  const [majorTick, setMajorTick] = useState<number[]>([]);
  const [minorTick, setMinorTick] = useState<number[]>([]);

  const ruler_length = useMemo(() => {
    return length * pixels_per_inch;
  }, [length, pixels_per_inch]);

  const pixels_per_unit = useMemo(() => {
    return unit === "inches" ? pixels_per_inch : pixels_per_inch / 25.4;
  }, [unit, pixels_per_inch]);

  useEffect(() => {
    setMajorTick(
      Array.from({ length: length + 1 }, (_, i) => i * pixels_per_unit).filter(
        (tick) => tick <= ruler_length
      )
    );
    setMinorTick(
      Array.from(
        { length: length * (unit === "inches" ? 8 : 10) },
        (_, i) => (i * pixels_per_unit) / (unit === "inches" ? 8 : 10)
      ).filter((tick) => tick <= ruler_length)
    );
  }, [length, pixels_per_unit, ruler_length, unit]);

  return (
    <>
      <div style={{ width: `${ruler_length}px`, height: `${height}px}` }}>
        {majorTick?.length &&
          majorTick.map((tick, idx) => {
            return (
              <div
                className={"absolute bottom-0 h-full w-[1px] bg-black"}
                style={{ left: `${tick}px` }}
                key={idx}
              ></div>
            );
          })}

        {minorTick?.length &&
          minorTick.map((tick, idx) => {
            if (!majorTick.includes(tick))
              return (
                <div
                  className={"absolute bottom-0 h-1/2 w-[1px] bg-black"}
                  style={{ left: `${tick}px` }}
                  key={idx}
                ></div>
              );
          })}
      </div>

      <div className="text-xs">{length} inch</div>
    </>
  );
};

export default InchMarker;
