export const site = {
  name: "Tazky Ferliansyah",
  firstName: "Tazky",
  lastName: "Ferliansyah",
  logo: "Tazky.F",
  githubUser: "ZyrexFX",
  githubUrl: "https://github.com/ZyrexFX",
  email: "tazky.ferliansyah21@gmail.com",
  location: "Bogor, Indonesia",
  role: "Undergrad",
  degree: "Undergraduate B.Sc. Informatics",
  semester: "Semester 7",
  focus: "Data and front-end",
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
  {
    repo: "sentimen-access-kai",
    tags: ["Sentiment analysis", "FastAPI", "scikit-learn"],
    liveUrl: "https://sentimen-access-kai.vercel.app",
    description:
      "Review sentiment for Access by KAI, from TF-IDF and a LinearSVC model behind FastAPI to a React front end.",
    fallback: {
      name: "sentimen-access-kai",
      description:
        "Analisis sentimen ulasan Access by KAI: FastAPI, TF-IDF + LinearSVC, React.",
      url: "https://github.com/ZyrexFX/sentimen-access-kai",
      homepage: "https://sentimen-access-kai.vercel.app",
      language: "Python",
      license: null,
      pushedAt: "2026-11-24T03:17:20Z",
      topics: ["fastapi", "indonesia", "react", "scikit-learn", "sentiment-analysis", "vercel"],
    },
  },
];
