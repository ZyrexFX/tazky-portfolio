"use client";

import { useEffect, useRef, useState } from "react";

const TAU = Math.PI * 2;

type Fish = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  depth: number;
  wander: number;
  phase: number;
  speed: number;
};

type Bubble = {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  depth: number;
  phase: number;
};

type Pellet = {
  x: number;
  y: number;
  vy: number;
  phase: number;
  life: number;
  size: number;
};

type Ripple = {
  x: number;
  y: number;
  r: number;
  life: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function DepthScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const wakeRef = useRef<() => void>(() => {});
  const feedRef = useRef<() => void>(() => {});
  const [paused, setPaused] = useState(false);
  const [fed, setFed] = useState(0);

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) wakeRef.current();
  }, [paused]);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;

    const surface = element.getContext("2d");
    if (!surface) return;

    const canvas = element;
    const ctx = surface;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let phase = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let scroll = 0;
    let targetScroll = 0;
    let frame = 0;
    let last = 0;
    let built = false;
    let downX = 0;
    let downY = 0;
    let downAt = 0;

    let fish: Fish[] = [];
    let bubbles: Bubble[] = [];
    let particles: Particle[] = [];
    const pellets: Pellet[] = [];
    const ripples: Ripple[] = [];

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const bounds = () => ({
      left: width * 0.07,
      right: width * 0.93,
      top: height * 0.1,
      bottom: height * 0.83,
    });

    function build() {
      const box = bounds();
      const count = width < 480 ? 4 : 6;
      fish = Array.from({ length: count }, () => {
        const depth = rand(0.35, 1);
        return {
          x: rand(box.left + 14, box.right - 14),
          y: rand(box.top + 14, box.bottom - 14),
          vx: rand(-8, 8),
          vy: rand(-3, 3),
          size: (width < 480 ? 8 : 10.5) + depth * (width < 480 ? 4.5 : 6.5),
          depth,
          wander: rand(0, TAU),
          phase: rand(0, TAU),
          speed: (width < 480 ? 11 : 14) + depth * 9,
        };
      });

      bubbles = Array.from({ length: width < 480 ? 8 : 12 }, () => ({
        x: rand(width * 0.06, width * 0.94),
        y: rand(height * 0.2, height * 0.8),
        r: rand(1, 2.6),
        speed: rand(10, 22),
        phase: rand(0, TAU),
      }));

      particles = Array.from({ length: width < 480 ? 20 : 32 }, () => ({
        x: rand(width * 0.04, width * 0.96),
        y: rand(height * 0.08, height * 0.84),
        r: rand(0.5, 1.4),
        depth: rand(0.2, 1),
        phase: rand(0, TAU),
      }));
    }

    function addRipple(x: number, y: number, life = 1) {
      ripples.push({ x, y, r: 3, life });
    }

    function addFood(x: number, y: number) {
      for (let i = 0; i < 5; i += 1) {
        pellets.push({
          x: clamp(x + rand(-13, 13), 8, width - 8),
          y: clamp(y + rand(-8, 8), 8, height - 8),
          vy: rand(13, 22),
          phase: rand(0, TAU),
          life: 1,
          size: rand(1.2, 2.2),
        });
      }

      if (pellets.length > 36) pellets.splice(0, pellets.length - 36);
      addRipple(x, y);

      if (pausedRef.current || reduce.matches) draw();
      else wake();
    }

    function updateFish(dt: number) {
      const box = bounds();
      const still = reduce.matches;
      const px = pointerX * width;
      const py = pointerY * height;
      const hasFood = pellets.length > 0;

      for (const item of fish) {
        if (still && !hasFood) continue;

        item.wander += dt * (0.6 + item.depth * 0.6);

        let dx = Math.cos(item.wander) * item.speed;
        let dy = Math.sin(item.wander * 0.9) * item.speed * 0.32;

        let target: Pellet | null = null;
        let best = Infinity;
        for (const pellet of pellets) {
          const distance = Math.hypot(pellet.x - item.x, pellet.y - item.y);
          if (distance < best) {
            best = distance;
            target = pellet;
          }
        }

        if (target && best < 190) {
          const nx = (target.x - item.x) / (best || 1);
          const ny = (target.y - item.y) / (best || 1);
          dx = nx * item.speed * 1.9;
          dy = ny * item.speed * 1.9;

          if (best < item.size * 0.8 + 4) {
            const index = pellets.indexOf(target);
            if (index >= 0) pellets.splice(index, 1);
            addRipple(target.x, target.y, 0.6);
          }
        } else if (!still) {
          const awayX = item.x - px;
          const awayY = item.y - py;
          const distance = Math.hypot(awayX, awayY);
          const radius = 74 + item.depth * 46;

          if (distance > 0.001 && distance < radius) {
            const force = (1 - distance / radius) * item.speed * 3.2 * item.depth;
            dx += (awayX / distance) * force;
            dy += (awayY / distance) * force;
          }
        }

        const pad = 20;
        if (item.x < box.left + pad) dx += (box.left + pad - item.x) * 2.2;
        if (item.x > box.right - pad) dx -= (item.x - (box.right - pad)) * 2.2;
        if (item.y < box.top + pad) dy += (box.top + pad - item.y) * 2.2;
        if (item.y > box.bottom - pad) dy -= (item.y - (box.bottom - pad)) * 2.2;

        const ease = Math.min(1, dt * 2.6);
        item.vx += (dx - item.vx) * ease;
        item.vy += (dy - item.vy) * ease;
        item.x = clamp(item.x + item.vx * dt, box.left, box.right);
        item.y = clamp(item.y + item.vy * dt, box.top, box.bottom);
      }
    }

    function updateBubbles(dt: number) {
      for (const bubble of bubbles) {
        bubble.y -= bubble.speed * dt;
        bubble.phase += dt * 1.8;

        if (bubble.y < height * 0.08) {
          bubble.y = height * rand(0.76, 0.84);
          bubble.x = rand(width * 0.06, width * 0.94);
        }
      }
    }

    function updatePellets(dt: number) {
      for (let i = pellets.length - 1; i >= 0; i -= 1) {
        const pellet = pellets[i];
        pellet.phase += dt * 2.2;
        pellet.x += Math.sin(pellet.phase) * 9 * dt;

        if (pellet.y > height * 0.86) {
          pellet.y = height * 0.86;
          pellet.life -= dt * 1.4;
        } else {
          pellet.y += pellet.vy * dt;
          pellet.life -= dt * 0.05;
        }

        if (pellet.life <= 0) pellets.splice(i, 1);
      }
    }

    function updateRipples(dt: number) {
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        ripple.r += dt * 92;
        ripple.life -= dt * 1.5;
        if (ripple.life <= 0) ripples.splice(i, 1);
      }
    }

    function drawFish(item: Fish, time: number, x: number, y: number) {
      const size = item.size;
      const wag = Math.sin(time * 7.5 + item.phase) * size * 0.14;
      const dir = item.vx >= 0 ? 1 : -1;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(dir, 1);

      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.bezierCurveTo(
        size * 0.6,
        -size * 0.62,
        -size * 0.25,
        -size * 0.66,
        -size * 0.9,
        -size * 0.14 + wag,
      );
      ctx.lineTo(-size * 1.45, -size * 0.52 + wag);
      ctx.lineTo(-size * 1.45, size * 0.52 + wag);
      ctx.lineTo(-size * 0.9, size * 0.14 + wag);
      ctx.bezierCurveTo(
        -size * 0.25,
        size * 0.66,
        size * 0.6,
        size * 0.62,
        size,
        0,
      );
      ctx.closePath();
      ctx.fillStyle = `rgba(13, 21, 34, ${(0.5 + item.depth * 0.32).toFixed(3)})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(207, 234, 224, ${(0.42 + item.depth * 0.36).toFixed(3)})`;
      ctx.lineWidth = size > 11 ? 1.1 : 0.9;
      ctx.stroke();

      if (size > 10) {
        ctx.beginPath();
        ctx.moveTo(-size * 0.12, -size * 0.56);
        ctx.quadraticCurveTo(0, -size * 1.02, size * 0.3, -size * 0.5);
        ctx.lineWidth = 0.9;
        ctx.strokeStyle = `rgba(207, 234, 224, ${(0.3 + item.depth * 0.2).toFixed(3)})`;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.fillStyle = "rgba(207, 234, 224, 0.92)";
      ctx.arc(size * 0.5, -size * 0.1, Math.max(0.7, size * 0.075), 0, TAU);
      ctx.fill();

      ctx.restore();
    }

    function drawWeed(x: number, baseY: number, tall: number, sway: number, alpha: number) {
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.bezierCurveTo(
        x + sway * 0.5,
        baseY - tall * 0.4,
        x - sway * 0.6,
        baseY - tall * 0.72,
        x + sway,
        baseY - tall,
      );
      ctx.strokeStyle = `rgba(91, 145, 163, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + 2, baseY);
      ctx.bezierCurveTo(
        x + 2 + sway * 0.3,
        baseY - tall * 0.45,
        x + 2 - sway * 0.4,
        baseY - tall * 0.7,
        x + 2 + sway * 0.7,
        baseY - tall * 0.85,
      );
      ctx.strokeStyle = `rgba(207, 234, 224, ${(alpha * 0.55).toFixed(3)})`;
      ctx.stroke();
    }

    function drawCoral(x: number, baseY: number, tall: number, time: number) {
      const sway = Math.sin(time * 0.7) * 3;
      const branches: Array<[number, number]> = [
        [-0.52, 0.55],
        [0, 1],
        [0.5, 0.6],
        [-0.26, 0.82],
        [0.28, 0.78],
      ];

      ctx.lineWidth = 1;
      for (const [spread, lift] of branches) {
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.bezierCurveTo(
          x + spread * tall * 0.15,
          baseY - lift * tall * 0.5,
          x + spread * tall * 0.3 + sway * 0.4,
          baseY - lift * tall * 0.8,
          x + spread * tall * 0.42 + sway,
          baseY - lift * tall,
        );
        ctx.strokeStyle = "rgba(207, 234, 224, 0.42)";
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "rgba(207, 234, 224, 0.34)";
        ctx.arc(x + spread * tall * 0.42 + sway, baseY - lift * tall, 1.3, 0, TAU);
        ctx.fill();
      }
    }

    function drawDecor(time: number) {
      const base = height * 0.85;

      ctx.beginPath();
      ctx.moveTo(-2, base + 4);
      ctx.bezierCurveTo(width * 0.24, base - 3, width * 0.62, base + 9, width + 2, base);
      const floor = ctx.createLinearGradient(0, 0, width, 0);
      floor.addColorStop(0, "rgba(91, 145, 163, 0)");
      floor.addColorStop(0.12, "rgba(91, 145, 163, 0.38)");
      floor.addColorStop(0.88, "rgba(91, 145, 163, 0.38)");
      floor.addColorStop(1, "rgba(91, 145, 163, 0)");
      ctx.strokeStyle = floor;
      ctx.lineWidth = 1;
      ctx.stroke();

      const rocks: Array<[number, number, number]> = [
        [0.16, 0.1, 0.052],
        [0.5, 0.065, 0.034],
        [0.8, 0.11, 0.05],
      ];

      for (const [x, w, h] of rocks) {
        const cx = width * x;
        const rw = width * w;
        const rh = height * h;

        ctx.beginPath();
        ctx.moveTo(cx - rw, base + 3);
        ctx.bezierCurveTo(
          cx - rw,
          base - rh * 1.6,
          cx - rw * 0.2,
          base - rh * 2.1,
          cx + rw * 0.15,
          base - rh * 1.5,
        );
        ctx.bezierCurveTo(
          cx + rw,
          base - rh * 1.1,
          cx + rw * 1.05,
          base - rh * 0.3,
          cx + rw,
          base + 3,
        );
        ctx.closePath();
        ctx.fillStyle = "rgba(13, 21, 34, 0.92)";
        ctx.fill();
        ctx.strokeStyle = "rgba(91, 145, 163, 0.45)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - rw * 0.4, base - rh * 0.5);
        ctx.lineTo(cx - rw * 0.1, base - rh * 0.9);
        ctx.moveTo(cx + rw * 0.25, base - rh * 0.45);
        ctx.lineTo(cx + rw * 0.45, base - rh * 0.8);
        ctx.strokeStyle = "rgba(91, 145, 163, 0.24)";
        ctx.stroke();
      }

      drawCoral(width * 0.66, base + 4, height * 0.15, time);
      drawCoral(width * 0.33, base + 6, height * 0.105, time + 1.6);
      drawCoral(width * 0.45, base + 6, height * 0.082, time + 0.7);

      const weeds = [0.07, 0.12, 0.21, 0.27, 0.58, 0.74, 0.9, 0.94];
      weeds.forEach((wx, index) => {
        const tall = height * (0.075 + ((index * 5) % 3) * 0.024 + (index % 2) * 0.028);
        const sway = Math.sin(time * 0.9 + index * 0.8) * (2.5 + (index % 4));
        drawWeed(width * wx, base + 5, tall, sway, 0.22 + (index % 3) * 0.05);
      });
    }

    function drawFood() {
      for (const pellet of pellets) {
        const alpha = clamp(pellet.life, 0, 1);
        ctx.beginPath();
        ctx.fillStyle = `rgba(233, 242, 240, ${(0.85 * alpha).toFixed(3)})`;
        ctx.arc(pellet.x, pellet.y, pellet.size, 0, TAU);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = `rgba(207, 234, 224, ${(0.24 * alpha).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.arc(pellet.x, pellet.y, pellet.size + 2.2, 0, TAU);
        ctx.stroke();
      }
    }

    function drawRipples() {
      for (const ripple of ripples) {
        const alpha = clamp(ripple.life, 0, 1);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(207, 234, 224, ${(0.42 * alpha).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, TAU);
        ctx.stroke();
      }
    }

    function draw() {
      if (!width || !height) return;

      const still = reduce.matches;
      const time = still ? 0.7 : phase;
      const parX = still ? 0 : pointerX - 0.5;
      const parY = still ? 0 : pointerY - 0.5;
      const shift = still ? 0 : scroll;

      ctx.clearRect(0, 0, width, height);

      const shafts: Array<[number, number, number, number]> = [
        [0.14, 0.06, 0.05, 0],
        [0.44, 0.05, 0.04, 1.9],
        [0.7, 0.07, 0.035, 3.4],
      ];

      for (const [sx, sw, alpha, offset] of shafts) {
        const drift = Math.sin(time * 0.32 + offset) * width * 0.018;
        const beam = ctx.createLinearGradient(0, 0, 0, height);
        beam.addColorStop(0, "rgba(91, 145, 163, 0)");
        beam.addColorStop(0.16, `rgba(91, 145, 163, ${alpha})`);
        beam.addColorStop(0.68, `rgba(91, 145, 163, ${(alpha * 0.55).toFixed(3)})`);
        beam.addColorStop(1, "rgba(91, 145, 163, 0)");

        ctx.beginPath();
        ctx.moveTo(width * sx + drift, 0);
        ctx.lineTo(width * (sx + sw) + drift, 0);
        ctx.lineTo(width * (sx + sw + 0.18) + drift, height);
        ctx.lineTo(width * (sx + 0.1) + drift, height);
        ctx.closePath();
        ctx.fillStyle = beam;
        ctx.fill();
      }

      for (const particle of particles) {
        const px =
          particle.x +
          Math.sin(time * 0.32 + particle.phase) * 6 * particle.depth +
          parX * 12 * particle.depth;
        const py =
          particle.y +
          Math.cos(time * 0.26 + particle.phase) * 5 * particle.depth +
          parY * 8 * particle.depth -
          shift * 18 * particle.depth;

        ctx.beginPath();
        ctx.fillStyle = `rgba(207, 234, 224, ${(0.1 + particle.depth * 0.24).toFixed(3)})`;
        ctx.arc(px, py, particle.r, 0, TAU);
        ctx.fill();
      }

      for (const bubble of bubbles) {
        const bx = bubble.x + Math.sin(time * 1.3 + bubble.phase) * (1.5 + bubble.r * 0.9);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(207, 234, 224, 0.32)";
        ctx.lineWidth = 1;
        ctx.arc(bx, bubble.y, bubble.r, 0, TAU);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "rgba(207, 234, 224, 0.55)";
        ctx.arc(
          bx - bubble.r * 0.3,
          bubble.y - bubble.r * 0.3,
          Math.max(0.45, bubble.r * 0.22),
          0,
          TAU,
        );
        ctx.fill();
      }

      const ordered = [...fish].sort((a, b) => a.depth - b.depth);
      for (const item of ordered) {
        const ox = parX * (6 + item.depth * 16);
        const oy = parY * (4 + item.depth * 9) - shift * (8 + item.depth * 16);
        drawFish(
          item,
          time,
          item.x + ox,
          item.y + oy + Math.sin(time * 2 + item.phase) * 1.1,
        );
      }

      drawDecor(time);
      drawFood();
      drawRipples();

      canvas.dataset.food = String(pellets.length);
    }

    function tick(now: number) {
      frame = 0;

      if (pausedRef.current) {
        draw();
        return;
      }

      const still = reduce.matches;
      const active = !still || pellets.length > 0 || ripples.length > 0;
      if (!active) {
        draw();
        return;
      }

      const dt = last ? clamp((now - last) / 1000, 0.001, 0.05) : 0.016;
      last = now;

      if (!still) phase += dt;

      pointerX += (targetX - pointerX) * 0.08;
      pointerY += (targetY - pointerY) * 0.08;
      scroll += (targetScroll - scroll) * 0.08;

      updateFish(dt);
      if (!still) updateBubbles(dt);
      updatePellets(dt);
      updateRipples(dt);

      draw();
      frame = window.requestAnimationFrame(tick);
    }

    function wake() {
      if (pausedRef.current) {
        draw();
        return;
      }
      if (frame) return;
      last = 0;
      frame = window.requestAnimationFrame(tick);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!built) {
        build();
        built = true;
      } else {
        const box = bounds();
        for (const item of fish) {
          item.x = clamp(item.x, box.left, box.right);
          item.y = clamp(item.y, box.top, box.bottom);
        }
        for (const bubble of bubbles) {
          bubble.x = clamp(bubble.x, 4, width - 4);
          bubble.y = clamp(bubble.y, 4, height - 4);
        }
        for (const particle of particles) {
          particle.x = clamp(particle.x, 2, width - 2);
          particle.y = clamp(particle.y, 2, height - 2);
        }
      }

      draw();
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "touch" || reduce.matches) return;

      const rect = canvas.getBoundingClientRect();
      targetX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      targetY = clamp((event.clientY - rect.top) / rect.height, 0, 1);

      if (pausedRef.current) {
        pointerX = targetX;
        pointerY = targetY;
        draw();
      } else {
        wake();
      }
    }

    function onScroll() {
      if (reduce.matches) return;
      targetScroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);

      if (pausedRef.current) {
        scroll = targetScroll;
        draw();
      } else {
        wake();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      downX = event.clientX;
      downY = event.clientY;
      downAt = performance.now();
    }

    function onPointerUp(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const moved = Math.hypot(event.clientX - downX, event.clientY - downY);
      if (moved > 14 || performance.now() - downAt > 800) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      addFood(x, y);
    }

    function onMotionChange() {
      if (reduce.matches) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        draw();
      } else {
        wake();
      }
    }

    feedRef.current = () => {
      if (!width) return;
      addFood(rand(width * 0.35, width * 0.65), height * 0.26);
    };
    wakeRef.current = wake;

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    reduce.addEventListener("change", onMotionChange);

    resize();
    onScroll();
    wake();

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      reduce.removeEventListener("change", onMotionChange);
      if (frame) window.cancelAnimationFrame(frame);
      feedRef.current = () => {};
      wakeRef.current = () => {};
    };
  }, []);

  const handleFeed = () => {
    feedRef.current();
    setFed((value) => value + 1);
  };

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-tide">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-px w-6 bg-tide/60" />
          Aquarium
        </span>
        <span className="flex items-center gap-1 sm:gap-2">
          <span className="mr-1 hidden text-tide sm:inline">Click the tank</span>
          <button
            type="button"
            onClick={handleFeed}
            aria-label="Drop food in the aquarium"
            className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 text-tide transition-colors hover:text-accent"
          >
            Feed
          </button>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={paused ? "Resume aquarium animation" : "Pause aquarium animation"}
            className="-mr-2 inline-flex min-h-11 items-center justify-center px-2 text-tide transition-colors hover:text-accent"
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </span>
      </div>

      <div className="relative h-[320px] select-none overflow-hidden sm:h-[360px] lg:h-[400px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_58%,rgba(207,234,224,0.1),transparent_68%)]"
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          data-aquarium=""
          className="absolute inset-0 h-full w-full cursor-pointer touch-manipulation"
        />
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {fed > 0 ? "Food dropped in the aquarium." : ""}
      </p>

      <ul className="mt-2 grid grid-cols-3 gap-3 border-t border-tide/15 pt-4 text-[10px] uppercase tracking-[0.14em] text-tide">
        <li>
          <span className="block text-paper">Interface</span>
          <span className="mt-1 block text-[11px] normal-case tracking-normal text-mist">
            JavaScript
          </span>
        </li>
        <li>
          <span className="block text-paper">Data</span>
          <span className="mt-1 block text-[11px] normal-case tracking-normal text-mist">
            MySQL · MongoDB
          </span>
        </li>
        <li>
          <span className="block text-paper">Backend</span>
          <span className="mt-1 block text-[11px] normal-case tracking-normal text-mist">
            Python
          </span>
        </li>
      </ul>
    </div>
  );
}
