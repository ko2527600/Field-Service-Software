import { useEffect, useRef, useState } from "react";
import { heroCards } from "../content/heroCards.js";

const AUTO_ADVANCE_MS = 5000;
const RESUME_AFTER_INTERACTION_MS = 8000;

export function HeroBanner() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  function pauseThenResume() {
    setPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setPaused(false), RESUME_AFTER_INTERACTION_MS);
  }

  useEffect(() => {
    if (reducedMotion || paused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % heroCards.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [paused, reducedMotion]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const trackEl = trackRef.current;
        if (!trackEl) return;
        const { scrollLeft, offsetLeft } = trackEl;
        let closest = 0;
        let closestDist = Infinity;
        Array.from(trackEl.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const dist = Math.abs(el.offsetLeft - offsetLeft - scrollLeft);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        setActiveIndex(closest);
      });
    }
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section aria-label="Fire safety tips" className="-mx-4 md:mx-0">
      <div
        ref={trackRef}
        onPointerDown={pauseThenResume}
        onTouchStart={pauseThenResume}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 md:px-0 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {heroCards.map((card) => (
          <div
            key={card.id}
            style={{ backgroundImage: `url(${card.photo})` }}
            className="relative snap-center shrink-0 w-[85%] sm:w-[70%] md:w-[380px] h-44 rounded-2xl bg-cover bg-center shadow-card overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="relative h-full flex flex-col justify-end p-5 text-white">
              <card.Icon className="h-7 w-7 mb-3 opacity-90" strokeWidth={1.8} aria-hidden="true" />
              <h3 className="font-bold text-lg leading-tight">{card.title}</h3>
              <p className="text-sm text-white/85 mt-1">{card.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
