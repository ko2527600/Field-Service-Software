import { defaultIconProps, type IconProps } from "./types.js";

export function XCircleIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 9 6 6" />
      <path d="m15 9-6 6" />
    </svg>
  );
}
