import { useSizerStore } from "../store";
import MeasurementsForm from "./measurements-form";

const BodyMeasurements = () => {
  const { bodyParts, collectedMeasurements } = useSizerStore((store) => store);
  return (
    <div className="flex w-full justify-between bg-white p-8">
      <div>
        <h3>Body Measurements</h3>
        <p>
          Please enter the following body measurements to ensure proper pattern
          creation
        </p>
        <MeasurementsForm />
      </div>

      <div>
        <h3>Selected Body Parts</h3>
        <ul>
          {Object.entries(bodyParts).map(([key, part]) => {
            if (part.isEnabled) {
              return (
                <li
                  key={key}
                  className="flex w-full items-center  gap-3 capitalize"
                >
                  {part.name}
                </li>
              );
            }
          })}
        </ul>
        <h3>Measurements</h3>
        <ul>
          {Object.entries(collectedMeasurements).map(([key, part]) => {
            return (
              <li
                key={key}
                className="flex w-full items-center  gap-3 capitalize"
              >
                {key}: {part}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BodyMeasurements;
