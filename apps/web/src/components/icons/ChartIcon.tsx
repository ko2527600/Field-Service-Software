import { defaultIconProps, type IconProps } from "./types.js";

export function ChartIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M4 20V10" />
      <path d="M11 20V4" />
      <path d="M18 20v-7" />
      <path d="M3 20h18" />
    </svg>
  );
}
