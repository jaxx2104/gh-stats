import type { Contributor, Language, Repository } from "../types.ts";
import {
  createActivitySparkline,
  createLanguageChart,
  createTable,
} from "../utils/charts.ts";
import {
  blue,
  bold,
  cyan,
  dim,
  green,
  highlight,
  magenta,
  muted,
  yellow,
} from "../utils/colors.ts";
import {
  calculateDaysAgo,
  formatDate,
  formatDuration,
  formatNumber,
} from "../utils/format.ts";

export function displayRepositoryHeader(_repo: Repository): void {
  console.log();
  console.log(bold(cyan("📊 Repository Statistics")));
  console.log(dim("─".repeat(50)));
  console.log();
}

export function displayRepositoryInfo(repo: Repository): void {
  console.log(bold("📋 Repository Overview"));
  console.log(dim("─".repeat(50)));
  console.log(`${muted("Name:")}         ${highlight(repo.nameWithOwner)}`);

  if (repo.description) {
    console.log(`${muted("Description:")}  ${repo.description}`);
  }

  console.log(`${muted("Created:")}      ${formatDate(repo.createdAt)}`);
  console.log(
    `${muted("Last Updated:")} ${formatDate(repo.updatedAt)} (${formatDuration(calculateDaysAgo(repo.updatedAt))})`,
  );
  console.log(
    `${muted("Last Push:")}    ${formatDate(repo.pushedAt)} (${formatDuration(calculateDaysAgo(repo.pushedAt))})`,
  );

  if (repo.primaryLanguage) {
    console.log(`${muted("Primary Lang:")} ${repo.primaryLanguage.name}`);
  }

  if (repo.licenseInfo) {
    console.log(`${muted("License:")}      ${repo.licenseInfo.name}`);
  }

  const badges = [];
  if (repo.isPrivate) badges.push(yellow("🔒 Private"));
  if (repo.isArchived) badges.push(dim("📦 Archived"));
  if (repo.isFork) badges.push(blue("🍴 Fork"));

  if (badges.length > 0) {
    console.log(`${muted("Status:")}       ${badges.join(" ")}`);
  }

  console.log();
}

export function displayKeyMetrics(repo: Repository): void {
  console.log(bold("📈 Key Metrics"));
  console.log(dim("─".repeat(50)));

  const metrics = [
    { icon: "⭐", label: "Stars", value: repo.stargazerCount },
    { icon: "🍴", label: "Forks", value: repo.forkCount },
    { icon: "👁️", label: "Watchers", value: repo.watchers.totalCount },
    { icon: "🐛", label: "Issues", value: repo.issues.totalCount },
    { icon: "🔀", label: "Pull Requests", value: repo.pullRequests.totalCount },
    { icon: "📦", label: "Releases", value: repo.releases.totalCount },
    {
      icon: "💾",
      label: "Commits",
      value: repo.defaultBranchRef?.target?.history?.totalCount || 0,
    },
  ];

  for (const metric of metrics) {
    const formattedValue = formatNumber(metric.value);
    console.log(
      `${metric.icon} ${metric.label.padEnd(13)} ${green(formattedValue)}`,
    );
  }

  console.log();
}

export function displayContributors(contributors: Contributor[]): void {
  if (contributors.length === 0) return;

  console.log(bold("👥 Top Contributors"));
  console.log(dim("─".repeat(50)));

  const maxContributions = contributors[0]?.contributions || 1;
  const rows = contributors.slice(0, 10).map((c, i) => {
    const activityBar = createActivitySparkline(
      Array.from({ length: 10 }, () => Math.random() * c.contributions),
    );
    return [
      `${i + 1}`,
      c.login,
      formatNumber(c.contributions),
      activityBar,
      `${((c.contributions / maxContributions) * 100).toFixed(1)}%`,
    ];
  });

  const table = createTable(
    ["#", "Username", "Contributions", "Activity", "%"],
    rows,
    [3, 15, 13, 12, 7],
  );

  for (const line of table) {
    console.log(line);
  }

  console.log();
}

export function displayLanguages(languages: Language): void {
  const entries = Object.entries(languages);
  if (entries.length === 0) return;

  console.log(bold("💻 Language Distribution"));
  console.log(dim("─".repeat(50)));

  const chart = createLanguageChart(languages);
  for (const line of chart) {
    console.log(line);
  }

  console.log();
}

export function displayRecentActivity(activity: {
  commits: number;
  issues: number;
  pullRequests: number;
}): void {
  console.log(bold("📊 Recent Activity (Last 7 Days)"));
  console.log(dim("─".repeat(50)));

  console.log(
    `${magenta("●")} Commits:       ${green(activity.commits.toString())}`,
  );
  console.log(
    `${cyan("●")} Issues:        ${yellow(activity.issues.toString())}`,
  );
  console.log(
    `${blue("●")} Pull Requests: ${blue(activity.pullRequests.toString())}`,
  );

  console.log();
}

export function displayError(message: string): void {
  console.error(`\n❌ ${bold("Error:")} ${message}\n`);
}

export function displaySuccess(message: string): void {
  console.log(`\n✅ ${green(message)}\n`);
}

export function displayLoading(message: string): void {
  console.log(`\n⏳ ${dim(message)}...`);
}
