import type { Address } from "../optimization/types";

export interface GeocodingProcessor<T> {
  geocodeByAddress(address: string): Promise<Address>;
  fetchDataFromGeoEndpoint(address: string): Promise<T>;
  fetchPossibleAddresses(address: string): Promise<Address[]>;
}

export class GeocodingService<T> {
  constructor(private geocodingProcessor: GeocodingProcessor<T>) {}

  async geocodeByAddress(address: string): Promise<Address> {
    return this.geocodingProcessor.geocodeByAddress(address);
  }

  async fetchDataFromGeoEndpoint(address: string): Promise<T> {
    return this.geocodingProcessor.fetchDataFromGeoEndpoint(address);
  }

  async fetchPossibleAddresses(address: string): Promise<Address[]> {
    return this.geocodingProcessor.fetchPossibleAddresses(address);
  }
}
