import { Repository, Contributor, Language } from "../types.ts";

export interface JsonReport {
  metadata: {
    generatedAt: string;
    repository: string;
  };
  overview: {
    name: string;
    owner: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    primaryLanguage: string | null;
    license: string | null;
    isPrivate: boolean;
    isArchived: boolean;
    isFork: boolean;
    homepageUrl: string | null;
  };
  metrics: {
    stars: number;
    forks: number;
    watchers: number;
    issues: number;
    pullRequests: number;
    releases: number;
    commits: number;
  };
  contributors?: Array<{
    rank: number;
    username: string;
    contributions: number;
    percentage: number;
  }>;
  languages?: Array<{
    name: string;
    bytes: number;
    percentage: number;
  }>;
  recentActivity?: {
    commits: number;
    issues: number;
    pullRequests: number;
  };
}

export function generateJsonReport(
  repo: Repository,
  contributors?: Contributor[],
  languages?: Language,
  activity?: { commits: number; issues: number; pullRequests: number },
): string {
  const report: JsonReport = {
    metadata: {
      generatedAt: new Date().toISOString(),
      repository: repo.nameWithOwner,
    },
    overview: {
      name: repo.name,
      owner: repo.owner.login,
      description: repo.description,
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
      pushedAt: repo.pushedAt,
      primaryLanguage: repo.primaryLanguage?.name || null,
      license: repo.licenseInfo?.name || null,
      isPrivate: repo.isPrivate,
      isArchived: repo.isArchived,
      isFork: repo.isFork,
      homepageUrl: repo.homepageUrl,
    },
    metrics: {
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      watchers: repo.watchers.totalCount,
      issues: repo.issues.totalCount,
      pullRequests: repo.pullRequests.totalCount,
      releases: repo.releases.totalCount,
      commits: repo.defaultBranchRef?.target?.history?.totalCount || 0,
    },
  };

  if (contributors && contributors.length > 0) {
    const maxContributions = contributors[0].contributions;
    report.contributors = contributors.slice(0, 10).map((c, i) => ({
      rank: i + 1,
      username: c.login,
      contributions: c.contributions,
      percentage: parseFloat(
        ((c.contributions / maxContributions) * 100).toFixed(1),
      ),
    }));
  }

  if (languages && Object.keys(languages).length > 0) {
    const total = Object.values(languages).reduce((sum, val) => sum + val, 0);
    report.languages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: parseFloat(((bytes / total) * 100).toFixed(1)),
      }));
  }

  if (activity) {
    report.recentActivity = activity;
  }

  return JSON.stringify(report, null, 2);
}
