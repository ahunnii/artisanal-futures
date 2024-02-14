import type { Address } from "../optimization/types";

export interface GeocodingProcessor<T> {
  geocodeByAddress(address: string): Promise<Address>;
  fetchDataFromGeoEndpoint(address: string): Promise<T>;
}

export class GeocodingService<T> {
  constructor(private geocodingProcessor: GeocodingProcessor<T>) {}

  async geocodeByAddress(address: string): Promise<Address> {
    return this.geocodingProcessor.geocodeByAddress(address);
  }

  async fetchDataFromGeoEndpoint(address: string): Promise<T> {
    return this.geocodingProcessor.fetchDataFromGeoEndpoint(address);
  }
}
