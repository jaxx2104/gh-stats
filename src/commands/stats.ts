import { Repository, StatsOptions } from "../types.ts";
import {
  getRepositoryInfo,
  getContributors,
  getLanguages,
  getRecentActivity,
} from "../cli/gh.ts";
import { getCurrentRepo } from "../cli/repo.ts";
import {
  displayRepositoryHeader,
  displayRepositoryInfo,
  displayKeyMetrics,
  displayContributors,
  displayLanguages,
  displayRecentActivity,
  displayLoading,
  displayError,
} from "../formatters/terminal.ts";

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
    Deno.exit(1);
  }
}
