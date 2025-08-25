import { Repository, Contributor, Language } from "../types.ts";

export function generateCsvReport(
  repo: Repository,
  contributors?: Contributor[],
  languages?: Language,
  activity?: { commits: number; issues: number; pullRequests: number },
): string {
  const lines: string[] = [];

  lines.push("Repository Statistics Report");
  lines.push(`Generated,${new Date().toISOString()}`);
  lines.push("");

  lines.push("Repository Overview");
  lines.push("Property,Value");
  lines.push(`Name,${repo.nameWithOwner}`);
  lines.push(`Owner,${repo.owner.login}`);
  lines.push(`Description,"${repo.description || ""}"`);
  lines.push(`Created,${repo.createdAt}`);
  lines.push(`Last Updated,${repo.updatedAt}`);
  lines.push(`Last Push,${repo.pushedAt}`);
  lines.push(`Primary Language,${repo.primaryLanguage?.name || "N/A"}`);
  lines.push(`License,${repo.licenseInfo?.name || "N/A"}`);
  lines.push(`Private,${repo.isPrivate}`);
  lines.push(`Archived,${repo.isArchived}`);
  lines.push(`Fork,${repo.isFork}`);
  lines.push("");

  lines.push("Key Metrics");
  lines.push("Metric,Count");
  lines.push(`Stars,${repo.stargazerCount}`);
  lines.push(`Forks,${repo.forkCount}`);
  lines.push(`Watchers,${repo.watchers.totalCount}`);
  lines.push(`Issues,${repo.issues.totalCount}`);
  lines.push(`Pull Requests,${repo.pullRequests.totalCount}`);
  lines.push(`Releases,${repo.releases.totalCount}`);
  lines.push(
    `Commits,${repo.defaultBranchRef?.target?.history?.totalCount || 0}`,
  );
  lines.push("");

  if (contributors && contributors.length > 0) {
    lines.push("Top Contributors");
    lines.push("Rank,Username,Contributions,Percentage");

    const maxContributions = contributors[0].contributions;
    contributors.slice(0, 10).forEach((c, i) => {
      const percentage = ((c.contributions / maxContributions) * 100).toFixed(
        1,
      );
      lines.push(`${i + 1},${c.login},${c.contributions},${percentage}%`);
    });
    lines.push("");
  }

  if (languages && Object.keys(languages).length > 0) {
    lines.push("Language Distribution");
    lines.push("Language,Bytes,Percentage");

    const total = Object.values(languages).reduce((sum, val) => sum + val, 0);
    Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([lang, bytes]) => {
        const percentage = ((bytes / total) * 100).toFixed(1);
        lines.push(`${lang},${bytes},${percentage}%`);
      });
    lines.push("");
  }

  if (activity) {
    lines.push("Recent Activity (Last 7 Days)");
    lines.push("Type,Count");
    lines.push(`Commits,${activity.commits}`);
    lines.push(`Issues,${activity.issues}`);
    lines.push(`Pull Requests,${activity.pullRequests}`);
  }

  return lines.join("\n");
}
