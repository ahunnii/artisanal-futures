import type { ClientJobBundle, DriverVehicleBundle } from "../../types.wip";

export interface OptimizationProcessor<T, Data, Drivers, Jobs> {
  calculateOptimalPaths(data: T): Promise<Data>;
  formatDriverData(data: DriverVehicleBundle[]): Drivers[];
  formatClientData(data: ClientJobBundle[]): Jobs[];
}

export class OptimizationService<T, Data, Drivers, Jobs> {
  constructor(
    private optimizationProcessor: OptimizationProcessor<T, Data, Drivers, Jobs>
  ) {}

  async calculateOptimalPaths(data: T): Promise<Data> {
    return this.optimizationProcessor.calculateOptimalPaths(data);
  }
  formatDriverData(data: DriverVehicleBundle[]): Drivers[] {
    return this.optimizationProcessor.formatDriverData(data);
  }
  formatClientData(data: ClientJobBundle[]): Jobs[] {
    return this.optimizationProcessor.formatClientData(data);
  }
}
