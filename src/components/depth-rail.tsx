"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "home", label: "Home", number: "00" },
  { id: "about", label: "About", number: "01" },
  { id: "work", label: "Work", number: "02" },
  { id: "contact", label: "Contact", number: "03" },
];

export function DepthRail() {
  const [active, setActive] = useState(0);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${progress})`;
      }

      const marker = window.innerHeight * 0.45;
      let next = 0;

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= marker) {
          next = index;
        }
      });

      setActive(next);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label="Navigasi bagian"
      className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      <ol className="relative flex flex-col">
        <span aria-hidden="true" className="absolute bottom-4 left-[7px] top-4 w-px bg-tide/25" />
        <span
          ref={fillRef}
          aria-hidden="true"
          className="absolute bottom-4 left-[7px] top-4 w-px origin-top bg-accent/80"
        />
        {sections.map((section, index) => {
          const isActive = index === active;
          const isPassed = index < active;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-label={`Go to ${section.label}`}
                aria-current={isActive ? "location" : undefined}
                title={section.label}
                className="group relative flex min-h-11 w-11 items-center gap-2"
              >
                <span className="relative grid size-4 place-items-center">
                  <span
                    className={`size-1.5 rounded-full transition-colors ${
                      isActive
                        ? "bg-accent"
                        : isPassed
                          ? "bg-accent/55"
                          : "bg-tide/60 group-hover:bg-mist"
                    }`}
                  />
                </span>
                <span
                  className={`text-[10px] tabular-nums transition-colors ${
                    isActive
                      ? "text-accent"
                      : isPassed
                        ? "text-mist"
                        : "text-tide group-hover:text-mist"
                  }`}
                >
                  {section.number}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
