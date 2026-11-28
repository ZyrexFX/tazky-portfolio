"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalIcon } from "@/components/external-icon";
import { GitHubIcon } from "@/components/github-icon";
import { MailIcon } from "@/components/mail-icon";
import { site } from "@/data/site";

const links = [
  { id: "home", href: "#home", label: "Home" },
  { id: "about", href: "#about", label: "About" },
  { id: "work", href: "#work", label: "Work" },
  { id: "contact", href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("atas");
  const [line, setLine] = useState({ left: 0, width: 0, ready: false });

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const marker = window.innerHeight * 0.35;
      let current = "atas";

      for (const link of links) {
        const element = document.getElementById(link.id);
        if (element && element.getBoundingClientRect().top <= marker) {
          current = link.id;
        }
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (atBottom) current = links[links.length - 1].id;
      setActive(current);
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

  useEffect(() => {
    let cancelled = false;

    const sync = () => {
      if (cancelled) return;
      const nav = navRef.current;
      const link = linkRefs.current[active];
      if (!nav || !link) return;

      const navRect = nav.getBoundingClientRect();
      const rect = link.getBoundingClientRect();
      setLine({
        left: rect.left - navRect.left,
        width: rect.width,
        ready: true,
      });
    };

    sync();
    window.addEventListener("resize", sync);
    document.fonts?.ready.then(sync).catch(() => {});

    return () => {
      cancelled = true;
      window.removeEventListener("resize", sync);
    };
  }, [active]);

  return (
    <header className="sticky top-0 z-40 border-b border-tide/15 bg-deep">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#home"
          aria-label={`${site.name}, back to top`}
          className="inline-flex min-h-11 items-center font-serif text-[22px] leading-none tracking-[-0.02em] text-paper transition-colors hover:text-accent"
        >
          {site.firstName}
          <span className="text-accent">.</span>
          {site.lastName.charAt(0)}
        </a>

        <nav
          ref={navRef}
          aria-label="Main navigation"
          className="relative hidden items-center gap-7 md:flex"
        >
          {links.map((link) => (
            <a
              key={link.id}
              ref={(node) => {
                linkRefs.current[link.id] = node;
              }}
              href={link.href}
              aria-current={active === link.id ? "location" : undefined}
              className={`inline-flex min-h-11 items-center text-[13px] transition-colors ${
                active === link.id ? "text-paper" : "text-mist hover:text-paper"
              }`}
            >
              {link.label}
            </a>
          ))}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-px bg-accent transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: line.width,
              transform: `translateX(${line.left}px)`,
              opacity: line.ready ? 1 : 0,
            }}
          />
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 border-l border-tide/20 pl-4 md:flex">
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`GitHub profile, ${site.githubUser} (opens in a new tab)`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-mist transition-colors hover:text-accent"
            >
              <GitHubIcon className="size-[18px]" />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label={`Email ${site.email}`}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-mist transition-colors hover:text-accent"
            >
              <MailIcon className="size-[18px]" />
            </a>
          </div>

          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-tide/25 px-3 text-sm text-paper transition-colors hover:border-tide hover:text-accent md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="border-t border-tide/15 bg-abyss md:hidden">
        <nav aria-label="Mobile navigation" className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8">
          {links.map((link, index) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={active === link.id ? "location" : undefined}
              className={`relative flex min-h-12 items-center gap-4 border-b border-tide/10 text-base transition-colors last:border-b-0 ${
                active === link.id ? "text-paper" : "text-mist hover:text-paper"
              }`}
            >
              <span className="text-[10px] tabular-nums tracking-[0.16em] text-tide">
                {String(index).padStart(2, "0")}
              </span>
              <span className="relative inline-flex flex-col">
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active === link.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </span>
            </a>
          ))}
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex min-h-12 items-center justify-between gap-4 border-t border-tide/10 text-base text-mist transition-colors hover:text-accent"
          >
            <span>GitHub</span>
            <ExternalIcon className="size-4 shrink-0 text-tide" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={`mailto:${site.email}`}
            onClick={() => setOpen(false)}
            className="flex min-h-12 items-center justify-between gap-4 border-t border-tide/10 text-[15px] text-mist transition-colors hover:text-accent"
          >
            <span className="min-w-0 truncate">{site.email}</span>
            <MailIcon className="size-4 shrink-0 text-tide" />
          </a>
        </nav>
      </div>
    </header>
  );
}
