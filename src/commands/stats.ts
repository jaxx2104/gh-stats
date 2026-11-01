import {
  getContributors,
  getLanguages,
  getRecentActivity,
  getRepositoryInfo,
} from "../cli/gh.ts";
import { getCurrentRepo } from "../cli/repo.ts";
import {
  displayContributors,
  displayError,
  displayKeyMetrics,
  displayLanguages,
  displayLoading,
  displayRecentActivity,
  displayRepositoryHeader,
  displayRepositoryInfo,
} from "../formatters/terminal.ts";
import type { StatsOptions } from "../types.ts";

export async function showStats(options: StatsOptions): Promise<void> {
  try {
    const repo = options.repo || (await getCurrentRepo());

    displayLoading(`Fetching statistics for ${repo}`);

    const repoInfo = await getRepositoryInfo(repo);

    displayRepositoryHeader(repoInfo);
    displayRepositoryInfo(repoInfo);
    displayKeyMetrics(repoInfo);

    if (options.all || options.showContributors) {
      displayLoading("Fetching contributors");
      const contributors = await getContributors(repo);
      displayContributors(contributors);
    }

    if (options.all || options.showLanguages) {
      displayLoading("Fetching language distribution");
      const languages = await getLanguages(repo);
      displayLanguages(languages);
    }

    if (options.all || options.showActivity) {
      displayLoading("Fetching recent activity");
      const activity = await getRecentActivity(repo);
      displayRecentActivity(activity);
    }
  } catch (error) {
    displayError(
      error instanceof Error ? error.message : "Unknown error occurred",
    );
    process.exit(1);
  }
}
