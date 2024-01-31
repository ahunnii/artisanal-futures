import { GeocodingService } from "./geocoding-processor";
import { googleGeocodingProcessor } from "./google-processor";

const geocodingService = new GeocodingService(googleGeocodingProcessor);

export default geocodingService;
