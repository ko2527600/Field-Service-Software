import { defaultIconProps, type IconProps } from "./types.js";

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <path d="M12 4v11" />
      <path d="M7.5 11 12 15.5 16.5 11" />
      <path d="M4 17.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5" />
    </svg>
  );
}
