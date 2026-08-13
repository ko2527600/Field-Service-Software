import { defaultIconProps, type IconProps } from "./types.js";

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M12 3.5 19 6.5v5c0 5-3 8-7 9-4-1-7-4-7-9v-5Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  );
}
