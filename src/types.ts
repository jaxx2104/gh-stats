export interface Repository {
  nameWithOwner: string;
  name: string;
  owner: {
    login: string;
  };
  description: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  stargazerCount: number;
  forkCount: number;
  watchers: {
    totalCount: number;
  };
  issues: {
    totalCount: number;
  };
  pullRequests: {
    totalCount: number;
  };
  releases: {
    totalCount: number;
  };
  defaultBranchRef: {
    target: {
      history: {
        totalCount: number;
      };
    };
  };
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  isPrivate: boolean;
  isArchived: boolean;
  isFork: boolean;
  homepageUrl: string | null;
  licenseInfo: {
    name: string;
    spdxId: string;
  } | null;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  type: string;
}

export interface Language {
  [name: string]: number;
}

export interface StatsOptions {
  showContributors?: boolean;
  showLanguages?: boolean;
  showActivity?: boolean;
  export?: "markdown" | "json" | "csv";
  format?: "terminal" | "json";
  repo?: string;
  all?: boolean;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  code: number;
}
