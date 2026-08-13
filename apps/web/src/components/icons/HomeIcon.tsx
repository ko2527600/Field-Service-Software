import { defaultIconProps, type IconProps } from "./types.js";

export function HomeIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}
