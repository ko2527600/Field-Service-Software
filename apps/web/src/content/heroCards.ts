import type { ComponentType } from "react";
import {
  ShieldIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  DownloadIcon,
  type IconProps,
} from "../components/icons/index.js";
import inspectPhoto from "../assets/hero-photos/inspect.jpg";
import renewalsPhoto from "../assets/hero-photos/renewals.jpg";
import dueSoonPhoto from "../assets/hero-photos/due-soon.jpg";
import offlinePhoto from "../assets/hero-photos/offline.jpg";
import exportPhoto from "../assets/hero-photos/export.jpg";

export type HeroCard = {
  id: string;
  title: string;
  body: string;
  Icon: ComponentType<IconProps>;
  photo: string;
};

export const heroCards: HeroCard[] = [
  {
    id: "inspect",
    title: "Inspect every 30 days",
    body: "A quick visual check — gauge, pin, hose — keeps every unit ready.",
    Icon: CheckCircleIcon,
    photo: inspectPhoto,
  },
  {
    id: "renewals",
    title: "Never miss a renewal",
    body: "Fire Armour tracks every due date automatically, for every customer.",
    Icon: ClockIcon,
    photo: renewalsPhoto,
  },
  {
    id: "due-soon",
    title: "Know before it's too late",
    body: "Due Soon flags units 30 days out, so you can plan the visit ahead.",
    Icon: AlertTriangleIcon,
    photo: dueSoonPhoto,
  },
  {
    id: "offline",
    title: "Built for the field",
    body: "Works offline, so you can pull up any customer before a visit.",
    Icon: ShieldIcon,
    photo: offlinePhoto,
  },
  {
    id: "export",
    title: "Your data, always yours",
    body: "Export a full customer or unit list to PDF any time — no lock-in.",
    Icon: DownloadIcon,
    photo: exportPhoto,
  },
];
