import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];

export const types = [
  {
    value: "PICKUP",
    label: "Pickup",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "DELIVERY",
    label: "Delivery",
    icon: CircleIcon,
  },
  {
    value: "PICKUP_AND_DELIVERY",
    label: "Pickup and Delivery",
    icon: StopwatchIcon,
  },
  {
    value: "SERVICE",
    label: "Service",
    icon: CheckCircledIcon,
  },
  {
    value: "ADMIN",
    label: "Admin",
    icon: CheckCircledIcon,
  },
  {
    value: "OTHER",
    label: "Other",
    icon: CheckCircledIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];
