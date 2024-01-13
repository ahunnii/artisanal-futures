/* eslint-disable react-hooks/exhaustive-deps */
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";

import {
  Fuel,
  Gem,
  Hammer,
  Hourglass,
  PencilLine,
  PlugZap,
  Shirt,
  User,
} from "lucide-react";

import FormInput from "../form/form-input";

type Field = {
  icon: string;
  name: string;
};
interface IProps {
  title?: string;
  text?: string;
  hint?: string;
  fields?: Array<Field>;
  additional?: boolean;
  handleCost: (val: number) => void;
  includesHours: Dispatch<SetStateAction<number>> | null;
}

const iconList = {
  PencilLine,
  Fuel,
  PlugZap,
  Hammer,
  Shirt,
  User,
  Gem,
};

const handleFieldIcon = (data: keyof typeof iconList) => {
  return iconList[data] || Gem;
};

const CostPanel: FC<IProps> = ({
  title,
  text,
  fields,
  handleCost,
  includesHours,
}) => {
  const [total, setTotal] = useState(0);
  const refForm = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (handleCost) handleCost(total);
  }, [total]);

  const recalculateTotal = () => {
    let total = 0;
    let product = 1;

    if (!refForm.current) return;

    for (const elem of refForm.current.elements) {
      if (elem instanceof HTMLInputElement) {
        if (title === "Labor Costs") product = product * parseFloat(elem.value);
        else total = total + parseFloat(elem.value || "0");
      }
    }
    if (title === "Labor Costs") total = product || 0;

    setTotal(total);
  };

  return (
    <>
      <div className="mt-4 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold leading-5 text-slate-800 sm:text-3xl md:text-4xl">
          {title}
        </h2>
        <p className="text-base text-slate-500">{text}</p>
      </div>

      <form className="mt-10" ref={refForm} onChange={recalculateTotal}>
        <div className="flex flex-col gap-4">
          {fields?.map((field, idx) => (
            <FormInput
              Icon={handleFieldIcon(field.icon as keyof typeof iconList)}
              title={field.name}
              key={idx}
            />
          ))}
          {includesHours && (
            <FormInput
              title="Number of hours (est.)"
              Icon={Hourglass}
              handleHours={includesHours}
            />
          )}
        </div>
      </form>
    </>
  );
};

export default CostPanel;
