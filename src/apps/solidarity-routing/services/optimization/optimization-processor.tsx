import type { OptimizedRoute } from "./types";

export interface OptimizationProcessor<T, Data> {
  calculateOptimalPaths(data: T): Promise<Data>;
  // getRoutes(data?: number | string): Promise<OptimizedRoute[]>;
}

export class OptimizationService<T, Data> {
  constructor(private optimizationProcessor: OptimizationProcessor<T, Data>) {}

  async calculateOptimalPaths(data: T): Promise<Data> {
    return this.optimizationProcessor.calculateOptimalPaths(data);
  }
}
