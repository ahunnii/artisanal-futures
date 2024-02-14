import axios from "axios";
import type { Address } from "../optimization/types";
import type { GeocodingProcessor } from "./geocoding-processor";

const GOOGLE_GEOCODING_ENDPOINT =
  "https://maps.googleapis.com/maps/api/geocode/json";

export const googleGeocodingProcessor: GeocodingProcessor<
  google.maps.GeocoderResult[]
> = {
  async geocodeByAddress(address: string): Promise<Address> {
    const res = await axios.post("/api/geocode", { address });

    if (res?.status !== 200) {
      throw new Error("No data found");
    } else {
      const geocode = res.data[0];
      return {
        id: geocode.place_id,
        latitude: geocode.geometry.location.lat,
        longitude: geocode.geometry.location.lng,
        formatted: geocode.formatted_address,
      };
    }
  },

  async fetchDataFromGeoEndpoint(
    address: string
  ): Promise<google.maps.GeocoderResult[]> {
    const endpointEncodedAddress = `${GOOGLE_GEOCODING_ENDPOINT}?address=${encodeURIComponent(
      address
    )}&key=${process.env.GOOGLE_API_KEY}`;

    const geocodedData = await axios.get(endpointEncodedAddress);

    if (geocodedData.status !== 200) {
      return [];
    }

    console.log(geocodedData.data.results);
    return geocodedData.data.results;
  },
};