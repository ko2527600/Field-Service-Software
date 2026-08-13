import { defaultIconProps, type IconProps } from "./types.js";

export function CustomersIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
      <path d="M16 4.5a3 3 0 0 1 0 5.8" />
      <path d="M19 20v-1a5 5 0 0 0-3.2-4.66" />
    </svg>
  );
}
