import {
  createTRPCReact,
  type inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import type {
  inferProcedureInput,
  inferProcedureOutput,
  inferRouterInputs,
  inferRouterOutputs,
} from "@trpc/server";
import superjson from "superjson";
import type { AppRouter } from "~/server/api/root";

export const trpc = createTRPCReact<AppRouter>();

export const transformer = superjson;

export type TQuery = keyof AppRouter["_def"]["queries"];

export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

export type InferQueryPathAndInput<TRouteKey extends TQuery> = [
  TRouteKey,
  Exclude<InferQueryInput<TRouteKey>, void>
];

// // infer the types for your router
// export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
// export type RouterInputs = inferRouterInputs<AppRouter>;
// export type RouterOutputs = inferRouterOutputs<AppRouter>;
// export const trpc = createTRPCReact<AppRouter>();
