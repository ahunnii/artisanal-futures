import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { Button } from "~/components/ui/button";

import { cn } from "~/utils/styles";

// interface FilterProps {
//   data: Attribute;
//   valueKey: string;
// }

interface FilterProps {
  valueKey: string;
  data: Array<string>;
  title: string;
}
const AttributeFilter: React.FC<FilterProps> = ({ data, valueKey, title }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: id,
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold">{title}</h3>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {data?.map((filter) => (
          <div key={filter} className="flex items-center">
            <Button
              className={cn(
                "rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-800",
                selectedValue === filter && "bg-black text-white"
              )}
              onClick={() => onClick(filter)}
            >
              {filter}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeFilter;
