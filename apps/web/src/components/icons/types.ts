import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

export const defaultIconProps: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
