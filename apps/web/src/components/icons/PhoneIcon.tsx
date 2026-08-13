import { defaultIconProps, type IconProps } from "./types.js";

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M6 3.5h2.5l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5V16a2 2 0 0 1-2 2A15 15 0 0 1 4 4a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
