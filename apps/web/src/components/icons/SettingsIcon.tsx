import { defaultIconProps, type IconProps } from "./types.js";

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...defaultIconProps} {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.8 1.3M17.3 16.2l1.8 1.3M2.5 12h2.2M19.3 12h2.2M4.9 17.5l1.8-1.3M17.3 7.8l1.8-1.3" />
    </svg>
  );
}
