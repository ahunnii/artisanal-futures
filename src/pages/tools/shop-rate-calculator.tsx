import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

import AddNewExpenses from "~/components/tools/shop-rate-calculator/add-new-expense";
import CostPanel from "~/components/tools/shop-rate-calculator/panels/cost-panel";
// import FORM_DATA from "~/data/tools/shop-rate-calculator/panels.json";

import Breakdown from "~/components/tools/shop-rate-calculator/breakdown";

import { InfoIcon } from "lucide-react";
import HourlyPieChart from "~/components/tools/shop-rate-calculator/hourly-pie-chart";
import { MaterialsCostForm } from "~/components/tools/shop-rate-calculator/panels/materials-form";
import { MonthlyCostForm } from "~/components/tools/shop-rate-calculator/panels/monthly-form";
import ProfitsPanel from "~/components/tools/shop-rate-calculator/panels/profit-panel";
import { useShopCalculator } from "~/hooks/use-shop-calculator";
import { formatPrice } from "~/utils/calculations";

export default function ShopRateCalculator() {
  const [hourlyTotal, setHourlyTotal] = useState(0);

  const COST_COLORS = {
    fixed: "#E38627",
    material: "#C13C37",
    labor: "#6A2135",
    profits: "#f472b6",
  };

  const { monthly, monthlyExpenses, materials, materialExpenses, labor } =
    useShopCalculator((state) => state);

  const breakdown = useMemo(() => {
    return {
      monthlyCost: monthly,
      // monthlyHourly: monthlyExpenses?.cart
      //   ? monthlyExpenses?.cart.reduce((total, item) => {
      //       return (
      //         total + (Number.isNaN(item?.amount ?? 0) ? 0 : item?.amount ?? 0)
      //       );
      //     }, 0) ?? 0
      //   : 0,
      monthlyHourly: (monthly / 2000) * 12 || 0,
      materialCost: materials,
      materialHourly: 0,
      laborHourly: 0,
    };
  }, [monthly, materials, monthlyExpenses]);

  const formattedPrice = useMemo(() => {
    return (monthly + breakdown.monthlyHourly).toFixed(2);
  }, [breakdown, monthly]);

  const totalCost = useMemo(() => {
    return monthly + breakdown.monthlyHourly;
  }, [breakdown, monthly]);

  return (
    <section>
      <div className="mx-auto grid w-full grid-cols-1 gap-10 md:grid-cols-2 lg:gap-32">
        <div className="flex flex-col ">
          <div className="mx-auto flex max-w-lg gap-8 rounded-xl p-4 sm:p-6 md:p-8">
            <Tabs defaultValue="monthly">
              <TabsList>
                <TabsTrigger value="monthly">Monthly Costs</TabsTrigger>
                <TabsTrigger value="material">Material Costs</TabsTrigger>
                <TabsTrigger value="labor">Labor Costs</TabsTrigger>
                <TabsTrigger value="profit">Profits</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly">
                <MonthlyCostForm />
              </TabsContent>
              <TabsContent value="material">
                <MaterialsCostForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex flex-col gap-10 md:gap-20">
          <h2 className="text-center text-4xl leading-tight md:text-left md:text-4xl lg:text-5xl">
            Total Shop Rate Per Hour{" "}
            <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text font-semibold text-transparent">
              ${formattedPrice}
            </span>{" "}
          </h2>

          <HourlyPieChart
            {...breakdown}
            hours={hourlyTotal}
            isValid={totalCost > 0 && hourlyTotal > 0}
            colors={COST_COLORS}
          />
          <Breakdown {...breakdown} />
        </div>
      </div>
    </section>
  );
}