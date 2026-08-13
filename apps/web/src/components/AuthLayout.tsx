import type { ReactNode } from "react";
import { AuthHeroSlideshow } from "./AuthHeroSlideshow.js";
import { Logo } from "./Logo.js";

export function AuthLayout({
  headline,
  tagline,
  children,
}: {
  headline: ReactNode;
  tagline: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen md:flex">
      {/* Hero panel: top banner on mobile, left half on desktop */}
      <div className="relative h-[46vh] min-h-[280px] md:h-screen md:min-h-0 md:w-1/2 overflow-hidden">
        <AuthHeroSlideshow className="absolute inset-0 h-full w-full bg-gray-900" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col justify-between p-6 md:p-12">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-white font-extrabold tracking-tight">Fire Armour</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.1] text-white max-w-sm">
            {headline}
          </h1>
          <p className="hidden md:block text-white/70 text-sm max-w-xs">{tagline}</p>
        </div>
      </div>

      {/* Form panel: bottom sheet on mobile, right half on desktop */}
      <div className="relative -mt-6 md:mt-0 md:w-1/2 bg-white rounded-t-2xl md:rounded-none shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:shadow-none md:flex md:items-center md:justify-center">
        <div className="w-full max-w-sm mx-auto px-5 py-8 md:px-4">{children}</div>
      </div>
    </div>
  );
}
