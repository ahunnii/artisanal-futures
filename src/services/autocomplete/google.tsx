// import { useJsApiLoader } from "@react-google-maps/api";
// import GooglePlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-google-places-autocomplete";
// import { env } from "~/env.mjs";

// type Library = "places";
// const libraries: Library[] = ["places"];

// const GoogleAutoComplete = ({ value, onChange }) => {
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-autocomplete-strict",
//     googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
//     libraries,
//   });

//   if (!isLoaded) return null;

//   return (
//     <GooglePlacesAutocomplete
//       selectProps={{
//         defaultInputValue: value,
//         onChange: (e) => onChange(e),

//         classNames: {
//           control: (state) =>
//             state.isFocused ? "border-red-600" : "border-grey-300",
//           input: () => "text-bold",
//         },
//         styles: {
//           input: (provided) => ({
//             ...provided,
//             outline: "0px solid",
//           }),
//         },
//       }}
//     />
//   );
// };

// type TAutoCompleteService = {
//   geocodeByAddress: (message: string) => Promise<unknown[]>;
//   getLatLng: (geoResult: unknown) => Promise<unknown>;
// };

// export class AutoCompleteService {
//   constructor(private autocomplete: TAutoCompleteService) {}

//   //Implement success method
//   async geocodeByAddress(message: string) {
//     const results = await this.autocomplete.geocodeByAddress(message);
//     return results;
//   }

//   //Implement error method
//   async getLatLng(geoResult: unknown) {
//     const results = await this.autocomplete.getLatLng(geoResult);
//     return results;
//   }
// }

// class GoogleAutoCompleteService extends AutoCompleteService {
//   //Implement success method
//   async geocodeByAddress(message: string) {
//     const results = await geocodeByAddress(message);
//     return results;
//   }

//   //Implement error method
//   async getLatLng(geoResult: unknown) {
//     const results = await getLatLng(geoResult);
//     return results;
//   }
// }
