import { featuredRepos, site, type FeaturedRepo } from "@/data/site";

type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  license: { spdx_id: string | null; name: string } | null;
  pushed_at: string;
  topics?: string[];
};

export type Project = {
  slug: string;
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  license: string | null;
  pushedAt: string;
  topics: string[];
  tags: string[];
  stale: boolean;
};

type ProjectsResult = {
  projects: Project[];
  stale: boolean;
};

const REVALIDATE_SECONDS = 60 * 60;

function toProject(repo: GitHubRepo, entry: FeaturedRepo): Project {
  return {
    slug: entry.repo,
    name: repo.name,
    description: entry.description ?? repo.description ?? "No description yet.",
    url: repo.html_url,
    homepage: entry.liveUrl ?? repo.homepage,
    language: repo.language,
    license: repo.license?.spdx_id ?? null,
    pushedAt: repo.pushed_at,
    topics: repo.topics ?? [],
    tags: entry.tags,
    stale: false,
  };
}

function fallbackProject(entry: FeaturedRepo): Project {
  return {
    slug: entry.repo,
    name: entry.fallback.name,
    description: entry.description ?? entry.fallback.description,
    url: entry.fallback.url,
    homepage: entry.liveUrl ?? entry.fallback.homepage,
    language: entry.fallback.language,
    license: entry.fallback.license,
    pushedAt: entry.fallback.pushedAt,
    topics: entry.fallback.topics,
    tags: entry.tags,
    stale: true,
  };
}

export async function getFeaturedProjects(): Promise<ProjectsResult> {
  if (featuredRepos.length === 0) {
    return { projects: [], stale: false };
  }

  let stale = false;

  const projects = await Promise.all(
    featuredRepos.map(async (entry) => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${site.githubUser}/${entry.repo}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
              ...(process.env.GITHUB_TOKEN
                ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
                : {}),
            },
            next: { revalidate: REVALIDATE_SECONDS },
          },
        );

        if (!response.ok) {
          throw new Error(`GitHub API ${response.status}`);
        }

        const repo = (await response.json()) as GitHubRepo;
        return toProject(repo, entry);
      } catch {
        stale = true;
        return fallbackProject(entry);
      }
    }),
  );

  return { projects, stale };
}
