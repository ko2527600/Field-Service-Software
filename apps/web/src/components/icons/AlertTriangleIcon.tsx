import { defaultIconProps, type IconProps } from "./types.js";

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M12 3.5 22 20H2Z" />
      <path d="M12 9.5v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
