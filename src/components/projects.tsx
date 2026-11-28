import { Suspense } from "react";
import { ExternalIcon } from "@/components/external-icon";
import { SectionLabel } from "@/components/section-label";
import { site } from "@/data/site";
import { getFeaturedProjects, type Project } from "@/lib/github";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function Projects() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-16 border-t border-tide/15">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <SectionLabel index="02" className="text-tide">
              Work
            </SectionLabel>
            <h2
              id="work-title"
              className="mt-5 font-serif text-[clamp(3rem,6.4vw,5.6rem)] leading-[0.95] tracking-[-0.03em] text-paper"
            >
              Selected <span className="italic text-accent">work</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-mist md:pb-2 md:text-right">
            Hand-picked. Not every public repo makes the cut.
          </p>
        </div>

        <div className="mt-12">
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function ProjectList() {
  const { projects, stale } = await getFeaturedProjects();

  if (projects.length === 0) {
    return (
      <div className="border-y border-tide/15 py-16">
        <p className="font-serif text-3xl text-paper">Nothing picked yet.</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">
          The public repos are still up on GitHub, though.
        </p>
        <a
          href={site.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent underline decoration-tide/50 underline-offset-4 transition-colors hover:decoration-accent"
        >
          Open GitHub profile
          <ExternalIcon className="size-3.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    );
  }

  return (
    <>
      <ol className="border-t border-tide/15">
        {projects.map((project, index) => (
          <li key={project.slug} className="border-b border-tide/15">
            <ProjectRow project={project} index={index + 1} />
          </li>
        ))}
      </ol>

      {stale ? (
        <p role="status" className="mt-4 text-xs leading-relaxed text-mist">
          GitHub metadata didn&apos;t load on the last refresh, so this is the saved copy.
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mist">These are the only projects I&apos;ve picked so far.</p>
        <a
          href={`${site.githubUrl}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent underline decoration-tide/50 underline-offset-4 transition-colors hover:decoration-accent"
        >
          More repos on GitHub
          <ExternalIcon className="size-3.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const repositoryLabel = `Source code for ${project.name}`;

  return (
    <article className="grid gap-8 py-12 md:grid-cols-[72px_minmax(0,1fr)] lg:grid-cols-[104px_minmax(0,1.25fr)_minmax(230px,0.75fr)] lg:gap-12">
      <p
        aria-hidden="true"
        className="font-serif text-[clamp(2.4rem,4vw,3.6rem)] italic leading-none text-tide/50"
      >
        {String(index).padStart(2, "0")}
      </p>

      <div>
        <h3 className="font-serif text-[clamp(2.6rem,4.6vw,4.1rem)] leading-none tracking-[-0.03em] text-paper">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-transparent decoration-1 underline-offset-[8px] transition-colors hover:text-accent hover:decoration-tide"
          >
            {project.name}
            <span className="text-accent">.</span>
            <span className="sr-only"> (opens GitHub in a new tab)</span>
          </a>
        </h3>

        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-mist">{project.description}</p>

        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.16em] text-tide">
          {project.tags.map((tag, tagIndex) => (
            <span key={tag} className="flex items-center gap-3">
              {tagIndex > 0 ? (
                <span aria-hidden="true" className="text-tide/40">
                  /
                </span>
              ) : null}
              {tag}
            </span>
          ))}
        </p>
      </div>

      <div className="flex flex-col gap-7 md:col-start-2 lg:col-start-3 lg:justify-between">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs sm:max-w-sm lg:grid-cols-1">
          {project.language ? (
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-tide">Language</dt>
              <dd className="mt-2 text-mist">{project.language}</dd>
            </div>
          ) : null}
          {project.license ? (
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-tide">License</dt>
              <dd className="mt-2 text-mist">{project.license}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-tide">Last updated</dt>
            <dd className="mt-2 text-mist">
              <time dateTime={project.pushedAt}>
                {dateFormatter.format(new Date(project.pushedAt))}
              </time>
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3">
          {project.homepage ? (
            <a
              href={project.homepage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-solid px-5 text-sm font-medium text-paper transition-colors hover:bg-accent-solid-hover"
            >
              Open {project.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${repositoryLabel} (opens in a new tab)`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-tide/40 px-5 text-sm font-medium text-paper transition-colors hover:border-accent hover:text-accent"
          >
            View code
          </a>
        </div>
      </div>
    </article>
  );
}

function ProjectsSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">
        Loading projects from GitHub.
      </p>
      <div aria-hidden="true" className="border-t border-tide/15">
        <div className="grid gap-8 border-b border-tide/15 py-12 md:grid-cols-[72px_minmax(0,1fr)] lg:grid-cols-[104px_minmax(0,1.25fr)_minmax(230px,0.75fr)] lg:gap-12">
          <div className="skeleton h-8 w-12 bg-shelf" />
          <div>
            <div className="skeleton h-10 w-52 bg-shelf" />
            <div className="skeleton mt-6 h-3 w-full max-w-md bg-shelf/70" />
            <div className="skeleton mt-3 h-3 w-3/4 max-w-sm bg-shelf/70" />
            <div className="skeleton mt-6 h-2.5 w-48 bg-shelf/60" />
          </div>
          <div className="flex flex-col gap-6 md:col-start-2 lg:col-start-3">
            <div className="space-y-3">
              <div className="skeleton h-2.5 w-20 bg-shelf/60" />
              <div className="skeleton h-3 w-28 bg-shelf/70" />
            </div>
            <div className="flex gap-3">
              <div className="skeleton h-11 w-32 bg-shelf/70" />
              <div className="skeleton h-11 w-24 bg-shelf/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
