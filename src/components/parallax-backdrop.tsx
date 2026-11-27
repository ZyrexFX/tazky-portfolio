"use client";

import { useEffect, useRef } from "react";

const layers = [
  {
    src: "/contours-far.svg",
    speed: 0.05,
    className: "-left-[10%] -bottom-[4%] h-[76%] w-[120%]",
  },
  {
    src: "/contours-mid.svg",
    speed: 0.11,
    className: "-left-[7%] -bottom-[10%] h-[68%] w-[114%]",
  },
  {
    src: "/contours-near.svg",
    speed: 0.18,
    className: "-left-[10%] -bottom-[18%] h-[60%] w-[120%]",
  },
];

export function ParallaxBackdrop() {
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const shift = Math.min(window.scrollY, window.innerHeight * 1.2);

      layerRefs.current.forEach((layer, index) => {
        if (!layer) return;
        layer.style.setProperty("--offset", `${(shift * layers[index].speed).toFixed(1)}px`);
      });
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const setMotion = () => {
      if (media.matches) {
        window.removeEventListener("scroll", onScroll);
        layerRefs.current.forEach((layer) => layer?.style.setProperty("--offset", "0px"));
      } else {
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      }
    };

    setMotion();
    media.addEventListener("change", setMotion);

    return () => {
      window.removeEventListener("scroll", onScroll);
      media.removeEventListener("change", setMotion);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {layers.map((layer, index) => (
        <div
          key={layer.src}
          ref={(node) => {
            layerRefs.current[index] = node;
          }}
          className={`parallax-layer absolute ${layer.className}`}
        >
          <img
            src={layer.src}
            alt=""
            width={1600}
            height={980}
            decoding="async"
            className="h-full w-full object-cover object-bottom"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#131b2b_0%,rgba(19,27,43,0.72)_24%,rgba(19,27,43,0)_58%)]" />
    </div>
  );
}
