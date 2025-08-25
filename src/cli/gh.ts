import { runCommand } from "./repo.ts";
import { Contributor, Language, Repository } from "../types.ts";

export async function ghApi<T>(endpoint: string): Promise<T> {
  const result = await runCommand("gh", ["api", endpoint]);

  if (result.code !== 0) {
    throw new Error(`GitHub API error: ${result.stderr}`);
  }

  return JSON.parse(result.stdout);
}

export async function ghGraphQL<T>(query: string): Promise<T> {
  const result = await runCommand("gh", [
    "api",
    "graphql",
    "-f",
    `query=${query}`,
  ]);

  if (result.code !== 0) {
    throw new Error(`GitHub GraphQL error: ${result.stderr}`);
  }

  return JSON.parse(result.stdout);
}

export async function getRepositoryInfo(repo: string): Promise<Repository> {
  const query = `
    query {
      repository(owner: "${repo.split("/")[0]}", name: "${repo.split("/")[1]}") {
        nameWithOwner
        name
        owner {
          login
        }
        description
        createdAt
        updatedAt
        pushedAt
        stargazerCount
        forkCount
        watchers {
          totalCount
        }
        issues {
          totalCount
        }
        pullRequests {
          totalCount
        }
        releases {
          totalCount
        }
        defaultBranchRef {
          target {
            ... on Commit {
              history {
                totalCount
              }
            }
          }
        }
        primaryLanguage {
          name
          color
        }
        isPrivate
        isArchived
        isFork
        homepageUrl
        licenseInfo {
          name
          spdxId
        }
      }
    }
  `;

  const response = await ghGraphQL<{ data: { repository: Repository } }>(query);
  return response.data.repository;
}

export async function getContributors(repo: string): Promise<Contributor[]> {
  return await ghApi<Contributor[]>(`/repos/${repo}/contributors?per_page=10`);
}

export async function getLanguages(repo: string): Promise<Language> {
  return await ghApi<Language>(`/repos/${repo}/languages`);
}

export async function getRecentActivity(
  repo: string,
  days = 7,
): Promise<{
  commits: number;
  issues: number;
  pullRequests: number;
}> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [commits, issues, prs] = await Promise.all([
    ghApi<Array<unknown>>(`/repos/${repo}/commits?since=${since}&per_page=100`),
    ghApi<Array<unknown>>(
      `/repos/${repo}/issues?since=${since}&state=all&per_page=100`,
    ),
    ghApi<Array<unknown>>(`/repos/${repo}/pulls?state=all&per_page=100`),
  ]);

  return {
    commits: commits.length,
    issues: issues.length,
    pullRequests: prs.filter(
      (pr: any) => new Date(pr.created_at) > new Date(since),
    ).length,
  };
}
