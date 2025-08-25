import { CommandResult } from "../types.ts";

export async function runCommand(
  cmd: string,
  args: string[],
): Promise<CommandResult> {
  const command = new Deno.Command(cmd, {
    args,
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await command.output();

  return {
    stdout: new TextDecoder().decode(stdout),
    stderr: new TextDecoder().decode(stderr),
    code,
  };
}

export async function getCurrentRepo(): Promise<string> {
  try {
    const result = await runCommand("gh", [
      "repo",
      "view",
      "--json",
      "nameWithOwner",
    ]);

    if (result.code !== 0) {
      throw new Error(`Failed to get current repository: ${result.stderr}`);
    }

    const data = JSON.parse(result.stdout);
    return data.nameWithOwner;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Could not determine")
    ) {
      throw new Error(
        "Not in a git repository or no GitHub remote found. Please run this command in a GitHub repository.",
      );
    }
    throw error;
  }
}
