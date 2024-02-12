import { UnassignedSummary } from "~/apps/solidarity-routing/components/solutions/unassigned-summary";

import { ScrollArea } from "~/components/ui/scroll-area";

import InteractiveRouteCard from "~/apps/solidarity-routing/components/solutions/interactive-route-card";

import { useRoutePlans } from "../../hooks/plans/use-route-plans";
import { OptimizedRoutePath } from "../../types.wip";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const CalculationsTab = () => {
  const routePlan = useRoutePlans();

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Routes{" "}
            <span className="rounded-lg border border-slate-300 px-2">
              {routePlan.data?.optimizedRoute?.length ?? 0}
            </span>
          </h2>
        </div>
      </div>

      <ScrollArea className=" flex-1  px-4">
        <UnassignedSummary unassigned={routePlan.unassigned} className="mb-4" />
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xs">
              {" "}
              Not Started
            </AccordionTrigger>
            <AccordionContent>
              {routePlan.optimized?.length > 0 && (
                <>
                  {routePlan.optimized?.map((route, idx) => {
                    if (route.status === "NOT_STARTED")
                      return (
                        <InteractiveRouteCard
                          key={idx}
                          data={route as OptimizedRoutePath}
                          textColor={1}
                        />
                      );
                  })}
                </>
              )}{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xs">In Progress</AccordionTrigger>
            <AccordionContent>
              {routePlan.optimized?.length > 0 && (
                <>
                  {routePlan.optimized?.map((route, idx) => {
                    if (route.status === "IN_PROGRESS")
                      return (
                        <InteractiveRouteCard
                          key={idx}
                          data={route as OptimizedRoutePath}
                          textColor={1}
                        />
                      );
                  })}
                </>
              )}{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xs">Completed</AccordionTrigger>
            <AccordionContent>
              {routePlan.optimized?.length > 0 && (
                <>
                  {routePlan.optimized?.map((route, idx) => {
                    if (route.status === "COMPLETED")
                      return (
                        <InteractiveRouteCard
                          key={idx}
                          data={route as OptimizedRoutePath}
                          textColor={1}
                        />
                      );
                  })}
                </>
              )}{" "}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </>
  );
};

export default CalculationsTab;
