import {
  backgroundColors,
  borderColors,
  hexColors,
  shadowColors,
  textColors,
} from "~/apps/solidarity-routing/data/color-data";

export const getColor = (id: number) => {
  let fill = hexColors[id % hexColors.length];
  if (id === -10) {
    return {
      fill: "#FF00005a",
    };
  } else if (id === -20) {
    return {
      fill: "#00FF005a",
    };
  }

  return {
    border: borderColors[id % borderColors.length],
    shadow: shadowColors[id % shadowColors.length],
    fill: fill,
    text: textColors[id % textColors.length],
    background: backgroundColors[id % backgroundColors.length],
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStyle = (feature: any) => {
  const textColorClass = getColor(
    feature?.geometry?.properties?.color as number
  ).fill;
  return {
    fillColor: "transparent",
    weight: 5,
    opacity: 1,
    color: textColorClass, //Outline color
    fillOpacity: 1,
  };
};
