import { describe, expect, test } from "bun:test";
import {
  formatDuration,
  formatNumber,
  formatPercentage,
} from "../src/utils/format.ts";

describe("formatNumber", () => {
  test("keeps small numbers as-is", () => {
    expect(formatNumber(999)).toBe("999");
  });
  test("abbreviates thousands and millions", () => {
    expect(formatNumber(1234)).toBe("1.2k");
    expect(formatNumber(2_500_000)).toBe("2.5M");
  });
});

describe("formatPercentage", () => {
  test("handles a zero total", () => {
    expect(formatPercentage(1, 0)).toBe("0.0%");
  });
  test("formats with one decimal", () => {
    expect(formatPercentage(1, 3)).toBe("33.3%");
  });
});

describe("formatDuration", () => {
  test("covers each unit", () => {
    expect(formatDuration(0)).toBe("today");
    expect(formatDuration(1)).toBe("1 day ago");
    expect(formatDuration(14)).toBe("2 weeks ago");
    expect(formatDuration(90)).toBe("3 months ago");
    expect(formatDuration(800)).toBe("2 years ago");
  });
});
