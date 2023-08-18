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
import ProfitsPanel from "~/components/tools/shop-rate-calculator/panels/profit-panel";
import { useShopCalculator } from "~/hooks/use-shop-calculator";
import CalculateUtil from "~/utils/calculations";

export default function ShopRateCalculator() {
  const [tabIndex, setTabIndex] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const [fixedTotal, setFixedTotal] = useState(0);
  const [fixedAdditional, setFixedAdditional] = useState(0);
  const [materialAdditional, setMaterialAdditional] = useState(0);
  const [materialTotal, setMaterialTotal] = useState(0);
  const [laborTotal, setLaborTotal] = useState(0);

  const [totalCost, setTotalCost] = useState(0);
  const [hourRate, setHourRate] = useState(0);

  const [hourlyTotal, setHourlyTotal] = useState(0);

  const [breakdown, setBreakdown] = useState({
    monthlyCost: 0,
    monthlyHourly: 0,
    materialCost: 0,
    materialHourly: 0,
    laborHourly: 0,
  });

  const COST_COLORS = {
    fixed: "#E38627",
    material: "#C13C37",
    labor: "#6A2135",
    profits: "#f472b6",
  };

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };
  const handleNextEvent = () => {
    if (tabIndex >= FORM_DATA.length) return;
    setTabIndex(tabIndex + 1);
  };

  const handlePrevEvent = () => {
    if (tabIndex <= 0) return;
    setTabIndex(tabIndex - 1);
  };

  const setPricingHandler = (slug: string) => {
    if (slug === "fixed") return setFixedTotal;
    if (slug === "material") return setMaterialTotal;
    if (slug === "labor") return setLaborTotal;
  };

  const setAdditionalHandler = (slug: string) => {
    if (slug === "fixed") return setFixedAdditional;
    if (slug === "material") return setMaterialAdditional;
    return;
  };
  useEffect(() => {
    let fixed = CalculateUtil.calculateMonthly(fixedTotal, fixedAdditional);
    let material = CalculateUtil.calculateMaterial(
      materialTotal,
      materialAdditional,
      hourRate
    );
    let labor = CalculateUtil.calculateLabor(laborTotal);

    setBreakdown((data) => {
      return {
        ...data,
        monthlyCost: fixed.total,
        monthlyHourly: fixed.hourly,
        materialCost: material.total,
        materialHourly: material.hourly,
        laborHourly: labor,
      };
    });

    setTotalCost(fixed.total + material.total + laborTotal);
    setHourlyTotal(fixed.hourly + material.total + labor);
  }, [
    fixedTotal,
    fixedAdditional,
    materialAdditional,
    materialTotal,
    laborTotal,
    hourRate,
  ]);

  const formattedPrice = useMemo(() => {
    return (
      (breakdown.materialHourly +
        breakdown.monthlyHourly +
        breakdown.laborHourly) *
      (1 + sliderValue / 100)
    ).toFixed(2);
  }, [breakdown, sliderValue]);
  const data = [
    {
      name: "Monthly Cost",
      slug: "fixed",
      alt: "Fixed Costs",
      description:
        "Fixed costs are calculated monthly. Things like rent, gas, etc. are included in this.",
      hint: "Charges should be recorded on a monthly basis.",
      fields: [
        { name: "Monthly Rent", icon: "MdOutlineHomeWork" },
        { name: "Gas Bill", icon: "MdLocalGasStation" },
        { name: "Electric Bill", icon: "MdOutlineElectricalServices" },
        { name: "Maintenance Costs", icon: "FaHammer" },
      ],
      is_additional_available: true,
      is_material_hours: false,
    },
    {
      name: "Material Cost",
      slug: "material",
      alt: "Material Costs",
      description:
        "These costs are intended for one project (to give the best estimate).",
      hint: "Charges are intended for one project.",
      fields: [
        { name: "Fabric Cost", icon: "FaTshirt" },
        { name: "Other Materials", icon: "FaTshirt" },
      ],
      is_additional_available: true,
      is_material_hours: true,
    },
    {
      name: "Labor Cost",
      slug: "labor",
      alt: "Labor Costs",
      description: "These costs are based on your current staffing operations",
      hint: "Charges are on a per hour basis",
      fields: [
        { name: "Labor Rate Per Hour", icon: "FaTshirt" },
        { name: "Number of Workers", icon: "FaUserAlt" },
      ],
      is_additional_available: false,
      is_material_hours: false,
    },
    {
      name: "Profits",
      slug: "profits",
      profit_modifier: true,
    },
  ];
  const materials = useShopCalculator((state) => state.materials);
  return (
    <section>
      <div className="mx-auto grid w-full grid-cols-1 gap-10 md:grid-cols-2 lg:gap-32">
        <div className="flex flex-col ">
          <div className="mx-auto flex max-w-lg gap-8 rounded-xl p-4 sm:p-6 md:p-8">
            <Tabs defaultValue="fmonthlyixed">
              <TabsList>
                <TabsTrigger value="fixed">Fixed Costs</TabsTrigger>
                <TabsTrigger value="monthly">Monthly Costs</TabsTrigger>
                <TabsTrigger value="material">Material Costs</TabsTrigger>
                <TabsTrigger value="labor">Labor Costs</TabsTrigger>
                <TabsTrigger value="profit">Profits</TabsTrigger>
              </TabsList>
              <TabsContent value="fixed">
                <p>{materials}</p>
                <MaterialsCostForm />
              </TabsContent>

              {/* <TabsContent value="fixed">
                <CostPanel
                  title={data[0]?.alt}
                  text={data[0]?.description}
                  hint={data[0]?.hint}
                  fields={data[0]?.fields}
                  additional={data[0]?.is_additional_available}
                  handleCost={setPricingHandler(data[0]?.slug)}
                  includesHours={
                    data[0]?.is_material_hours ? setHourRate : null
                  }
                />

                {data[0]?.is_additional_available && (
                  <AddNewExpenses
                    handleCost={
                      setAdditionalHandler(data[0]?.slug) as Dispatch<
                        SetStateAction<number>
                      >
                    }
                  />
                )}
              </TabsContent>

              <TabsContent value="fixed">
                <CostPanel
                  title={data[1]?.alt}
                  text={data[1]?.description}
                  hint={data[1]?.hint}
                  fields={data[1]?.fields}
                  additional={data[1]?.is_additional_available}
                  handleCost={setPricingHandler(data[1]?.slug)}
                  includesHours={
                    data[1]?.is_material_hours ? setHourRate : null
                  }
                />
                {data[1]?.is_additional_available && (
                  <AddNewExpenses
                    handleCost={
                      setAdditionalHandler(data[1]?.slug) as Dispatch<
                        SetStateAction<number>
                      >
                    }
                  />
                )}
              </TabsContent>

              <TabsContent value="fixed">
                <CostPanel
                  title={data[2]?.alt}
                  text={data[2]?.description}
                  hint={data[2]?.hint}
                  fields={data[2]?.fields}
                  additional={data[2]?.is_additional_available}
                  handleCost={setPricingHandler(data[2]?.slug)}
                  includesHours={
                    data[2]?.is_material_hours ? setHourRate : null
                  }
                />
                {data[2]?.is_additional_available && (
                  <AddNewExpenses
                    handleCost={
                      setAdditionalHandler(data[2]?.slug) as Dispatch<
                        SetStateAction<number>
                      >
                    }
                  />
                )}
              </TabsContent>

              <TabsContent value="profit">
                <ProfitsPanel
                  sliderValue={sliderValue}
                  setSliderValue={setSliderValue}
                />
              </TabsContent> */}
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
