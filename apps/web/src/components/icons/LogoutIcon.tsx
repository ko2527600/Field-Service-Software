import { defaultIconProps, type IconProps } from "./types.js";

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
