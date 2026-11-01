import { expect, test } from "bun:test";
import { generateJsonReport } from "../src/formatters/json.ts";
import type { Repository } from "../src/types.ts";

const repo: Repository = {
  nameWithOwner: "owner/repo",
  name: "repo",
  owner: { login: "owner" },
  description: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
  pushedAt: "2024-01-02T00:00:00Z",
  stargazerCount: 10,
  forkCount: 2,
  watchers: { totalCount: 1 },
  issues: { totalCount: 3 },
  pullRequests: { totalCount: 4 },
  releases: { totalCount: 0 },
  defaultBranchRef: { target: { history: { totalCount: 42 } } },
  primaryLanguage: null,
  isPrivate: false,
  isArchived: false,
  isFork: false,
  homepageUrl: null,
  licenseInfo: null,
};

test("generateJsonReport emits parseable JSON", () => {
  const parsed = JSON.parse(generateJsonReport(repo));
  expect(JSON.stringify(parsed)).toContain("owner/repo");
});
