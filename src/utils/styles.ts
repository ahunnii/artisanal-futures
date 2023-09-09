import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Combine strings of classes into a single string to improve Tailwind CSS readability.
 *
 * @param classes Array of class strings
 * @returns Combined class list for components
 */
export function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}
