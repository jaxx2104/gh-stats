import { expect, test } from "bun:test";
import { runCommand } from "../src/cli/repo.ts";

test("runCommand captures stdout, stderr and exit code", async () => {
  const result = await runCommand("sh", [
    "-c",
    "printf out; printf err >&2; exit 3",
  ]);
  expect(result).toEqual({ stdout: "out", stderr: "err", code: 3 });
});
