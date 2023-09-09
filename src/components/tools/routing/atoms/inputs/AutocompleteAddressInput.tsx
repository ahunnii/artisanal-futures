import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import type { Location } from "~/types";
type Address = {
  place_id: number;
  display_name: string;
  lat: number;
  lon: number;
};

interface IProps {
  setData: (data: Partial<Location>) => void;
  editValue?: Address;
}
const AutocompleteAddressInput: React.FC<IProps> = ({ setData, editValue }) => {
  const [inputValue, setInputValue] = useState<Address>({
    display_name: "",
    lat: 0,
    lon: 0,
    place_id: 0,
  });
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const fetchAddresses = async (query: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
      );
      setAddresses(response.data as Address[]);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue({ display_name: newValue, lat: 0, lon: 0, place_id: 0 });

    const data = {
      address: newValue,
      coordinates: { latitude: 0, longitude: 0 },
    };
    setData(data as Partial<Location>);

    // Clear the previous timeout, if any
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Debouncing logic: Call the fetchAddresses function after a delay of 500ms
    const newTimeoutId = setTimeout(() => {
      fetchAddresses(newValue).catch((error) => {
        console.error("Error fetching addresses:", error);
      });
    }, 300);

    setTimeoutId(newTimeoutId);
  };

  const handleAddressSelection = (selectedAddress: Address) => {
    setInputValue(selectedAddress);

    const data = {
      address: selectedAddress.display_name,
      coordinates: {
        latitude: selectedAddress.lat,
        longitude: selectedAddress.lon,
      },
    };

    setData(data as Partial<Location>);
    setAddresses([]); // Clear the suggestions after selection
  };

  useEffect(() => {
    if (editValue?.display_name) {
      setInputValue(editValue);
    }
  }, [editValue]);
  return (
    <label className="relative w-full">
      <span className="flex gap-4">
        Starting Address
        <span className="group relative w-max">
          <QuestionMarkCircledIcon className="h-6 w-6 text-slate-400" />
          <span className="pointer-events-none absolute -top-7 left-0 w-max max-w-md rounded-md bg-slate-200 p-2 text-slate-500 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            Start typing the address. Once you find a match, select it from the
            dropdown. Invalid addresses will not be added to the routes.
          </span>
        </span>
      </span>
      <input
        type="text"
        name="address"
        placeholder="e.g. 23600 Heidelberg St, Detroit, MI 48207, United States"
        className="h-12 w-full items-center space-x-3 rounded-lg bg-slate-100 px-4 text-left text-slate-800 shadow-sm ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex"
        value={inputValue.display_name}
        onChange={handleInputChange}
      />
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 transform">
          {/* Replace this with your desired loading indicator, e.g., a spinner */}
          Loading...
        </div>
      )}
      {addresses.length > 0 && (
        <ul className="absolute left-0 top-full z-10 w-full rounded-b-lg border border-gray-300 bg-white">
          {addresses.map((address) => (
            <li
              key={address.place_id}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => handleAddressSelection(address)}
            >
              {address.display_name}
            </li>
          ))}
        </ul>
      )}
    </label>
  );
};

export default AutocompleteAddressInput;
