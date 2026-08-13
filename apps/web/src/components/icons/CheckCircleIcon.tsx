import { defaultIconProps, type IconProps } from "./types.js";

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.3 2.4 2.4 4.6-5" />
    </svg>
  );
}
