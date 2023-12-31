import { useMemo, type FC } from "react";

import { formatPrice } from "~/utils/calculations";

interface IProps {
  monthlyCost: number;
  monthlyHourly: number;
  materialCost: number;
  materialHourly: number;
  laborHourly: number;
}
const Breakdown: FC<IProps> = ({
  monthlyCost,
  monthlyHourly,
  materialCost,
  materialHourly,
  laborHourly,
}) => {
  const calculatedPrices = useMemo(() => {
    return {
      fixed_monthly: formatPrice(monthlyCost),
      fixed_hourly: formatPrice(monthlyHourly),
      material_monthly: formatPrice(materialCost),
      material_hourly: formatPrice(materialHourly),
      labor_hourly: formatPrice(laborHourly),
      subtotal: formatPrice(monthlyHourly + materialHourly + laborHourly),
    };
  }, [monthlyCost, monthlyHourly, materialCost, materialHourly, laborHourly]);

  return (
    <section className="w-full">
      <h3 className="mb-8 text-4xl font-semibold">Breakdown</h3>

      <table className="w-full table-auto text-xl">
        <thead>
          <tr>
            <td>Cost</td>
            <td>Hourly Rate</td>
          </tr>
        </thead>
        <tbody>
          <tr className="">
            <td className="  before:px-1 before:text-[#E38627] before:content-['⬤'] ">
              {" "}
              Fixed{" "}
            </td>
            <td className="flex justify-between">
              {calculatedPrices.fixed_monthly}{" "}
              <span className="ml-4 rounded-md bg-slate-200 px-1 text-base">
                {calculatedPrices.fixed_hourly} Total
              </span>
            </td>
          </tr>
          <tr className="">
            <td className="  before:px-1 before:text-[#C13C37] before:content-['⬤']">
              {" "}
              Material{" "}
            </td>
            <td className="flex justify-between ">
              {calculatedPrices.material_monthly}{" "}
              <span className="ml-4 rounded-md bg-slate-200 px-1 text-base ">
                {calculatedPrices.material_hourly} Total
              </span>{" "}
            </td>
          </tr>
          <tr className="">
            <td className="  before:px-1 before:text-[#6A2135] before:content-['⬤']">
              {" "}
              Labor{" "}
            </td>
            <td>{calculatedPrices.labor_hourly} </td>
          </tr>
          <tr className="">
            <td className="  before:px-1 before:text-green-500 before:content-['⬤']">
              {" "}
              Subtotal{" "}
            </td>
            <td>{calculatedPrices.subtotal} </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default Breakdown;
