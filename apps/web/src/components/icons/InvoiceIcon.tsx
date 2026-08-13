import { defaultIconProps, type IconProps } from "./types.js";

export function InvoiceIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M15 3v3h3" />
      <path d="M8 12h8" />
      <path d="M8 15.5h8" />
      <path d="M8 8.5h4" />
    </svg>
  );
}
