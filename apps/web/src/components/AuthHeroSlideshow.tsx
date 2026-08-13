import { useEffect, useState } from "react";
import inspectPhoto from "../assets/hero-photos/inspect.jpg";
import renewalsPhoto from "../assets/hero-photos/renewals.jpg";
import dueSoonPhoto from "../assets/hero-photos/due-soon.jpg";
import offlinePhoto from "../assets/hero-photos/offline.jpg";
import exportPhoto from "../assets/hero-photos/export.jpg";

const PHOTOS = [inspectPhoto, renewalsPhoto, dueSoonPhoto, offlinePhoto, exportPhoto];
const AUTO_ADVANCE_MS = 5000;

/** Crossfades through the same real fire-safety photos used on the dashboard hero. No dots/controls -- purely ambient. */
export function AuthHeroSlideshow({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);

  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHOTOS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className={className} aria-hidden="true">
      {PHOTOS.map((photo, i) => (
        <div
          key={photo}
          style={{ backgroundImage: `url(${photo})` }}
          className={`absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
