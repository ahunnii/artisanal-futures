import { ScrollArea } from "~/components/ui/scroll-area";

import { useRoutePlans } from "../../hooks/plans/use-route-plans";
import type { OptimizedRoutePath } from "../../types.wip";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

import { AssignedJobSheet } from "./assigned-job-sheet";
import { UnassignedJobCard } from "./unassigned-job-card";

const CalculationsTab = () => {
  const routePlan = useRoutePlans();

  const numberOfUnassigned = routePlan.unassigned.length;
  const numberOfNotStarted = routePlan.optimized.filter(
    (r) => r.status === "NOT_STARTED"
  ).length;
  const numberOfInProgress = routePlan.optimized.filter(
    (r) => r.status === "IN_PROGRESS"
  ).length;
  const numberOfCompleted = routePlan.optimized.filter(
    (r) => r.status === "COMPLETED"
  ).length;

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
              Unassigned ({numberOfUnassigned})
            </AccordionTrigger>
            <AccordionContent>
              {routePlan.unassigned &&
                routePlan.unassigned?.length > 0 &&
                routePlan.unassigned?.map((bundle) => {
                  return (
                    <UnassignedJobCard
                      key={bundle.job.id}
                      address={
                        bundle?.job?.address?.formatted ??
                        `Job #${bundle.job.id}`
                      }
                      jobId={bundle.job.id}
                    />
                  );
                })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="py-2 text-xs">
              Not Started ({numberOfNotStarted})
            </AccordionTrigger>
            <AccordionContent>
              {routePlan.optimized && routePlan.optimized?.length > 0 && (
                <>
                  {routePlan.optimized?.map((route) => {
                    if (route.status === "NOT_STARTED")
                      return (
                        <AssignedJobSheet
                          key={route.vehicleId}
                          data={route as OptimizedRoutePath}
                        />
                      );
                  })}
                </>
              )}{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="py-2 text-xs">
              In Progress ({numberOfInProgress})
            </AccordionTrigger>
            <AccordionContent>
              {routePlan.optimized && routePlan.optimized?.length > 0 && (
                <>
                  {routePlan.optimized?.map((route) => {
                    if (route.status === "IN_PROGRESS")
                      return (
                        <AssignedJobSheet
                          key={route.vehicleId}
                          data={route as OptimizedRoutePath}
                        />
                      );
                  })}
                </>
              )}{" "}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="py-2 text-xs">
              Completed ({numberOfCompleted})
            </AccordionTrigger>
            <AccordionContent>
              {routePlan.optimized && routePlan.optimized?.length > 0 && (
                <>
                  {routePlan.optimized?.map((route) => {
                    if (route.status === "COMPLETED")
                      return (
                        <AssignedJobSheet
                          key={route.vehicleId}
                          data={route as OptimizedRoutePath}
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
