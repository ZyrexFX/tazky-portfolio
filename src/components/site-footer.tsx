import { ExternalIcon } from "@/components/external-icon";
import { MailIcon } from "@/components/mail-icon";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-tide/15 bg-abyss">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-[30px] leading-none tracking-[-0.02em] text-paper">
              {site.logo}
            </p>
            <p className="mt-2 text-sm text-mist">
              {site.name} · {site.role} · {site.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-11 items-center gap-2 text-mist transition-colors hover:text-accent"
            >
              <MailIcon className="size-3.5" />
              Email
            </a>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-mist transition-colors hover:text-accent"
            >
              GitHub
              <ExternalIcon className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href="#home"
              className="inline-flex min-h-11 items-center text-mist transition-colors hover:text-accent"
            >
              Back to top
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-tide/15 pt-5 text-[10px] uppercase tracking-[0.16em] text-tide sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.year} {site.name}
          </p>
          <p>Project data from the GitHub API · Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
