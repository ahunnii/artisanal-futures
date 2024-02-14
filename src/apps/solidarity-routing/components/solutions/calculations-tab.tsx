import InteractiveRouteCard from "~/apps/solidarity-routing/components/solutions/interactive-route-card";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";

import { useRoutePlans } from "../../hooks/plans/use-route-plans";
import type { OptimizedRoutePath } from "../../types.wip";

import { Pencil } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { cn } from "~/utils/styles";

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
        <Accordion type="multiple" defaultValue={["item-1"]}>
          <AccordionItem value="item-0">
            <AccordionTrigger className="py-2 text-xs">
              Unassigned ({routePlan.unassigned.length})
            </AccordionTrigger>
            <AccordionContent>
              {routePlan.unassigned?.length > 0 && (
                <>
                  {routePlan.unassigned?.map((bundle) => {
                    return (
                      <Card
                        key={bundle.job.id}
                        className={cn("my-2 w-full hover:bg-slate-50")}
                      >
                        <CardHeader
                          className={cn(
                            "flex w-full cursor-pointer flex-row items-center justify-between py-2 shadow-inner"
                          )}
                        >
                          <CardTitle className="flex  w-full flex-row  items-center  justify-between text-xs font-bold text-black ">
                            {bundle?.job.address.formatted}
                            <Pencil className="h-4 w-4 text-slate-800 group-hover:bg-opacity-30" />
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </>
              )}{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="py-2 text-xs">
              Not Started (
              {
                routePlan.optimized?.filter((r) => r.status === "NOT_STARTED")
                  .length
              }
              )
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
            <AccordionTrigger className="py-2 text-xs">
              In Progress (
              {
                routePlan.optimized?.filter((r) => r.status === "IN_PROGRESS")
                  .length
              }
              )
            </AccordionTrigger>
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
            <AccordionTrigger className="py-2 text-xs">
              Completed (
              {
                routePlan.optimized?.filter((r) => r.status === "COMPLETED")
                  .length
              }
              )
            </AccordionTrigger>
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
