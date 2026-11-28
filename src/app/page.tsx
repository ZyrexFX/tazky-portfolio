import { DepthRail } from "@/components/depth-rail";
import { DepthScene } from "@/components/depth-scene";
import { ExternalIcon } from "@/components/external-icon";
import { MailIcon } from "@/components/mail-icon";
import { ParallaxBackdrop } from "@/components/parallax-backdrop";
import { Projects } from "@/components/projects";
import { SectionLabel } from "@/components/section-label";
import { site } from "@/data/site";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <DepthRail />
      <main id="content">
        <section id="home" className="relative isolate scroll-mt-16 overflow-hidden">
          <ParallaxBackdrop />

          <div className="mx-auto flex min-h-[calc(100svh_-_4rem)] max-w-6xl flex-col px-5 pb-8 pt-8 sm:px-8 lg:pb-10 lg:pt-10">
            <div className="flex items-center justify-between gap-6 border-b border-tide/15 pb-4 text-[10px] uppercase tracking-[0.2em] text-tide">
              <span>Portfolio / {site.year}</span>
              <span className="hidden sm:inline">
                {site.role} · {site.location}
              </span>
              <span className="sm:hidden">{site.location}</span>
            </div>

            <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12 lg:py-8">
              <div className="max-w-[36rem]">
                <h1 className="font-serif leading-[0.88] tracking-[-0.045em] text-paper">
                  <span className="block text-[clamp(4rem,8.4vw,7rem)]">{site.firstName}</span>
                  <span className="mt-1 block text-[clamp(3.2rem,6.3vw,5.9rem)] italic">
                    {site.lastName}
                    <span className="text-accent">.</span>
                  </span>
                </h1>

                <p className="mt-6 font-serif text-[clamp(1.15rem,1.5vw,1.4rem)] leading-snug tracking-[-0.01em] text-accent">
                  {site.degree}
                </p>

                <p className="mt-4 max-w-[38ch] text-[16px] leading-relaxed text-mist text-pretty">
                  I&apos;m learning UI/UX and software engineering, and I want to go beyond just
                  that.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#work"
                    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent-solid px-5 text-sm font-medium text-paper transition-colors hover:bg-accent-solid-hover"
                  >
                    See selected work
                  </a>
                  <a
                    href={site.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-tide/40 px-5 text-sm font-medium text-paper transition-colors hover:border-accent hover:text-accent"
                  >
                    GitHub
                    <ExternalIcon className="size-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </div>

              <DepthScene />
            </div>

            <div className="flex flex-col gap-4 border-t border-tide/20 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
              <p className="text-mist">
                <span className="text-tide">Currently learning:</span> {site.learning.join(", ")}
              </p>
              <a
                href="#about"
                className="inline-flex min-h-11 items-center gap-3 self-start text-mist transition-colors hover:text-accent sm:self-auto"
              >
                <span aria-hidden="true" className="h-px w-8 bg-tide/60" />
                Scroll to about
              </a>
            </div>
          </div>
        </section>

        <section
          id="about"
          aria-labelledby="about-title"
          className="relative scroll-mt-16 overflow-hidden border-t border-tide/15 bg-deep"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 right-0 select-none font-serif text-[clamp(9rem,22vw,20rem)] italic leading-none text-shelf/20"
          >
            01
          </span>

          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <SectionLabel index="01" className="text-tide">
                  About
                </SectionLabel>
              </div>

              <div className="lg:col-span-9">
                <h2
                  id="about-title"
                  className="max-w-3xl font-serif text-[clamp(2.8rem,5.8vw,5rem)] leading-[0.98] tracking-[-0.035em] text-paper"
                >
                  Learning by <span className="italic text-accent">shipping</span> things.
                </h2>
              </div>
            </div>

            <div className="mt-14 grid gap-10 border-t border-tide/15 pt-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-tide">Profile</p>
              </div>

              <div className="space-y-5 text-[15px] leading-relaxed text-mist lg:col-span-5">
                <p>
                  I&apos;m an Informatics Engineering student at Gunadarma University, currently
                  in my 7th semester. Computers have been part of my life since I was a kid, so
                  tinkering with tech became second nature, and I still love poking around just to
                  see how things work.
                </p>
                <p>
                  I started out focused on front-end and UI/UX design, and lately I&apos;ve been
                  getting into back-end and data too. I learn best by doing, so I build small
                  things, ship them, and get a real kick out of seeing people use them. flagmint is
                  my latest one, with more on the way.
                </p>
              </div>

              <div className="lg:col-span-4">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-tide">Education</dt>
                    <dd className="mt-2 text-sm leading-snug text-paper">
                      B.Sc. Informatics
                      <span className="mt-1 block text-[11px] text-tide">{site.semester}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-tide">Location</dt>
                    <dd className="mt-2 text-sm leading-snug text-paper">{site.location}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-tide">Focus</dt>
                    <dd className="mt-2 text-sm leading-snug text-paper">
                      {`${site.focus} projects`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-tide">
                      Latest project
                    </dt>
                    <dd className="mt-2 text-sm leading-snug">
                      <a
                        href={`${site.githubUrl}/flagmint`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-paper underline decoration-tide/50 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                      >
                        flagmint
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <Projects />

        <section
          id="contact"
          aria-labelledby="contact-title"
          className="relative scroll-mt-16 overflow-hidden border-t border-tide/15 bg-deep"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 right-0 select-none font-serif text-[clamp(9rem,22vw,20rem)] italic leading-none text-shelf/15"
          >
            03
          </span>

          <img
            src="/contours-near.svg"
            alt=""
            width={1600}
            height={980}
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute -bottom-24 -right-28 w-[820px] max-w-none opacity-25"
          />

          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-3">
                <SectionLabel index="03" className="text-tide">
                  Contact
                </SectionLabel>
                <p className="mt-5 max-w-[24ch] text-sm leading-relaxed text-mist">
                  Email or GitHub, whichever is easier for you.
                </p>
              </div>

              <div className="lg:col-span-9">
                <h2
                  id="contact-title"
                  className="font-serif text-[clamp(3.2rem,8.4vw,7rem)] leading-[0.9] tracking-[-0.04em] text-paper"
                >
                  Say <span className="italic text-accent">hi</span>.
                </h2>

                <p className="mt-6 max-w-md text-sm leading-relaxed text-mist">
                  Email reaches me directly. GitHub has the repos, the commits, and whatever
                  I&apos;m poking at right now.
                </p>

                <a
                  href={`mailto:${site.email}`}
                  className="mt-8 inline-flex min-h-12 max-w-full items-center gap-2.5 rounded-lg bg-accent-solid px-4 text-[13px] font-medium leading-snug text-paper transition-colors hover:bg-accent-solid-hover sm:px-5 sm:text-sm"
                >
                  <MailIcon className="size-4 shrink-0" />
                  <span className="sr-only">Email </span>
                  {site.email}
                </a>

                <a
                  href={site.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-8 flex max-w-2xl items-end justify-between gap-6 border-b border-tide/30 pb-4 text-paper transition-colors hover:border-accent"
                >
                  <span className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-none tracking-[-0.02em] transition-colors group-hover:text-accent">
                    github.com/{site.githubUser}
                  </span>
                  <ExternalIcon className="mb-1 size-5 shrink-0 text-mist transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
