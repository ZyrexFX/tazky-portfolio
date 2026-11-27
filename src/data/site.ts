export const site = {
  name: "Tazky Ferliansyah",
  firstName: "Tazky",
  lastName: "Ferliansyah",
  logo: "Tazky.F",
  githubUser: "ZyrexFX",
  githubUrl: "https://github.com/ZyrexFX",
  email: "tazky.ferliansyah21@gmail.com",
  location: "Indonesia",
  role: "Undergrad",
  learning: ["JavaScript", "Python", "MySQL", "MongoDB"],
  year: 2026,
} as const;

export type FeaturedRepo = {
  repo: string;
  tags: string[];
  liveUrl?: string;
  description?: string;
  fallback: {
    name: string;
    description: string;
    url: string;
    homepage: string | null;
    language: string | null;
    license: string | null;
    pushedAt: string;
    topics: string[];
  };
};

/**
 * Project picks, not an auto-generated list.
 * Add new entries here to show a public repository on the page.
 * Fill `fallback` with the last known metadata so the work section
 * still has something to show when the GitHub API is unreachable.
 */
export const featuredRepos: FeaturedRepo[] = [
  {
    repo: "flagmint",
    tags: ["Geography quiz", "Two languages", "Next.js"],
    liveUrl: "https://flagmint.vercel.app",
    description:
      "A flag, capital, and subdivision flag quiz in Indonesian and English. Short rounds, typed answers.",
    fallback: {
      name: "flagmint",
      description:
        "Flag, capital, and subdivision flag quizzes in Indonesian and English. Short rounds, typed answers.",
      url: "https://github.com/ZyrexFX/flagmint",
      homepage: "https://flagmint.vercel.app",
      language: "TypeScript",
      license: "MIT",
      pushedAt: "2026-11-23T12:24:31Z",
      topics: ["flags", "geography", "indonesia", "nextjs", "quiz"],
    },
  },
];
