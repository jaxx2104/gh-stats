import { Command } from "@cliffy/command";
import { StatsOptions } from "./src/types.ts";
import { showStats } from "./src/commands/stats.ts";
import {
  getRepositoryInfo,
  getContributors,
  getLanguages,
  getRecentActivity,
} from "./src/cli/gh.ts";
import { getCurrentRepo } from "./src/cli/repo.ts";
import { generateMarkdownReport } from "./src/formatters/markdown.ts";
import { generateJsonReport } from "./src/formatters/json.ts";
import { generateCsvReport } from "./src/formatters/csv.ts";
import { displayError, displaySuccess } from "./src/formatters/terminal.ts";

async function main() {
  const { options, args } = await new Command()
    .name("gh-stats")
    .version("0.1.0")
    .description("📊 Beautiful repository statistics for GitHub CLI")
    .arguments("[repo:string]")
    .option("-c, --contributors", "Show contributor statistics")
    .option("-l, --languages", "Show language distribution")
    .option("-a, --activity", "Show recent activity")
    .option("--all", "Show all available statistics")
    .option(
      "-e, --export <format:string>",
      "Export report (markdown, json, csv)",
      {
        depends: ["all"],
      },
    )
    .option("-o, --output <file:string>", "Output file path for export")
    .option("-f, --format <format:string>", "Output format (terminal, json)", {
      default: "terminal",
    })
    .example("Current repository", "gh stats")
    .example("Specific repository", "gh stats owner/repo")
    .example("With contributors", "gh stats --contributors")
    .example(
      "Export to markdown",
      "gh stats --all --export markdown --output stats.md",
    )
    .parse(Deno.args);

  try {
    const repo = args[0] || (await getCurrentRepo());

    const statsOptions: StatsOptions = {
      repo,
      showContributors: options.contributors,
      showLanguages: options.languages,
      showActivity: options.activity,
      all: options.all,
      export: options.export as "markdown" | "json" | "csv" | undefined,
      format: options.format as "terminal" | "json",
    };

    if (options.export) {
      await exportReport(repo, options.export, options.output, options.all);
    } else if (options.format === "json") {
      await outputJson(repo, statsOptions);
    } else {
      await showStats(statsOptions);
    }
  } catch (error) {
    displayError(
      error instanceof Error ? error.message : "Unknown error occurred",
    );
    Deno.exit(1);
  }
}

async function exportReport(
  repo: string,
  format: string,
  outputFile?: string,
  includeAll = false,
): Promise<void> {
  const [repoInfo, contributors, languages, activity] = await Promise.all([
    getRepositoryInfo(repo),
    includeAll ? getContributors(repo) : undefined,
    includeAll ? getLanguages(repo) : undefined,
    includeAll ? getRecentActivity(repo) : undefined,
  ]);

  let report: string;
  let extension: string;

  switch (format.toLowerCase()) {
    case "markdown":
    case "md":
      report = generateMarkdownReport(
        repoInfo,
        contributors,
        languages,
        activity,
      );
      extension = ".md";
      break;
    case "json":
      report = generateJsonReport(repoInfo, contributors, languages, activity);
      extension = ".json";
      break;
    case "csv":
      report = generateCsvReport(repoInfo, contributors, languages, activity);
      extension = ".csv";
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }

  const filename = outputFile || `${repo.replace("/", "-")}-stats${extension}`;
  await Deno.writeTextFile(filename, report);
  displaySuccess(`Report exported to ${filename}`);
}

async function outputJson(repo: string, options: StatsOptions): Promise<void> {
  const [repoInfo, contributors, languages, activity] = await Promise.all([
    getRepositoryInfo(repo),
    options.all || options.showContributors ? getContributors(repo) : undefined,
    options.all || options.showLanguages ? getLanguages(repo) : undefined,
    options.all || options.showActivity ? getRecentActivity(repo) : undefined,
  ]);

  const json = generateJsonReport(repoInfo, contributors, languages, activity);
  console.log(json);
}

if (import.meta.main) {
  main();
}
