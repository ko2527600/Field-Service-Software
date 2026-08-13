import { defaultIconProps, type IconProps } from "./types.js";

export function UserIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20v-1a5.5 5.5 0 0 1 5.5-5.5h4a5.5 5.5 0 0 1 5.5 5.5v1" />
    </svg>
  );
}
