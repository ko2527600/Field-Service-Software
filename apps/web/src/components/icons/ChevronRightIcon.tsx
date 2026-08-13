import { defaultIconProps, type IconProps } from "./types.js";

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
