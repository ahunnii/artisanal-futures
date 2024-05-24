import { format } from "date-fns";
import { nthNumber } from "./generic/nth-date";

export const isDateToday = (date: Date) =>
  format(date, "MMMM dd yyyy") === format(new Date(), "MMMM dd yyyy");

export const formatNthDate = (date: Date) => {
  return `${format(date, "MMMM d")}${nthNumber(Number(format(date, "d")))}`;
};
