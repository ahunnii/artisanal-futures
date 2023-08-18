import { useMemo, type FC } from "react";
import { PieChart } from "react-minimal-pie-chart";

import CalculateUtil from "~/utils/calculations";

type Color = {
  fixed: string;
  material: string;
  labor: string;
  profits: string;
};
interface IProps {
  monthlyHourly: number;
  materialHourly: number;
  laborHourly: number;
  hours: number;
  isValid: boolean;
  colors: Color;
}

const HourlyPieChart: FC<IProps> = ({
  monthlyHourly,
  materialHourly,
  laborHourly,
  hours,
  isValid,
  colors,
}) => {
  const priceData = useMemo(() => {
    if (!isValid) return [{ title: "Default", value: 1, color: "#a1a1a1" }];
    return [
      {
        title: "Fixed Costs",
        value: CalculateUtil.calculateHourlyRatio(monthlyHourly, hours),
        color: colors.fixed,
      },
      {
        title: "Material Costs",
        value: CalculateUtil.calculateHourlyRatio(materialHourly, hours),
        color: colors.material,
      },
      {
        title: "Labor Costs",
        value: CalculateUtil.calculateHourlyRatio(laborHourly, hours),
        color: colors.labor,
      },
    ];
  }, [monthlyHourly, hours, materialHourly, laborHourly, colors, isValid]);
  return (
    <div className="mx-auto flex justify-center lg:w-6/12">
      <PieChart
        data={priceData}
        lineWidth={15}
        paddingAngle={5}
        labelPosition={60}
      />
    </div>
  );
};

export default HourlyPieChart;
