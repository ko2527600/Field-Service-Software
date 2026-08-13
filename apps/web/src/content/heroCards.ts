import type { ComponentType } from "react";
import {
  ShieldIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  DownloadIcon,
  type IconProps,
} from "../components/icons/index.js";

export type HeroCard = {
  id: string;
  title: string;
  body: string;
  Icon: ComponentType<IconProps>;
  gradient: string;
};

export const heroCards: HeroCard[] = [
  {
    id: "inspect",
    title: "Inspect every 30 days",
    body: "A quick visual check — gauge, pin, hose — keeps every unit ready.",
    Icon: CheckCircleIcon,
    gradient: "from-brand to-brand-dark",
  },
  {
    id: "renewals",
    title: "Never miss a renewal",
    body: "Fire Armour tracks every due date automatically, for every customer.",
    Icon: ClockIcon,
    gradient: "from-red-500 to-rose-700",
  },
  {
    id: "due-soon",
    title: "Know before it's too late",
    body: "Due Soon flags units 30 days out, so you can plan the visit ahead.",
    Icon: AlertTriangleIcon,
    gradient: "from-amber-500 to-orange-700",
  },
  {
    id: "offline",
    title: "Built for the field",
    body: "Works offline, so you can pull up any customer before a visit.",
    Icon: ShieldIcon,
    gradient: "from-zinc-700 to-zinc-900",
  },
  {
    id: "export",
    title: "Your data, always yours",
    body: "Export a full customer or unit list to CSV any time — no lock-in.",
    Icon: DownloadIcon,
    gradient: "from-rose-600 to-red-800",
  },
];
