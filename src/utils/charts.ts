import { formatPercentage } from "./format.ts";
import { getLanguageColor, dim, bold } from "./colors.ts";

export function createBarChart(
  value: number,
  maxValue: number,
  width = 20,
  filled = "█",
  empty = "░",
): string {
  const percentage = maxValue > 0 ? value / maxValue : 0;
  const filledLength = Math.round(width * percentage);
  const emptyLength = width - filledLength;

  return filled.repeat(filledLength) + dim(empty.repeat(emptyLength));
}

export function createHorizontalBar(
  label: string,
  value: number,
  maxValue: number,
  width = 30,
  showPercentage = true,
): string {
  const bar = createBarChart(value, maxValue, width);
  const percentage = showPercentage
    ? ` ${formatPercentage(value, maxValue)}`
    : "";
  return `${label.padEnd(15)} ${bar}${percentage}`;
}

export function createLanguageChart(
  languages: Record<string, number>,
  width = 40,
): string[] {
  const total = Object.values(languages).reduce((sum, val) => sum + val, 0);
  const sorted = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const lines: string[] = [];

  for (const [lang, bytes] of sorted) {
    const percentage = (bytes / total) * 100;
    if (percentage < 0.1) continue;

    const color = getLanguageColor(lang);
    const barWidth = Math.round((percentage / 100) * width);
    const bar = color("█".repeat(Math.max(1, barWidth)));
    const label = `${lang.padEnd(12)} ${bar} ${percentage.toFixed(1)}%`;
    lines.push(label);
  }

  return lines;
}

export function createActivitySparkline(values: number[], height = 4): string {
  if (values.length === 0) return "";

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const chars = [" ", "▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

  return values
    .map((v) => {
      const normalized = (v - min) / range;
      const index = Math.round(normalized * (chars.length - 1));
      return chars[index];
    })
    .join("");
}

export function createProgressBar(
  current: number,
  total: number,
  width = 30,
  showNumbers = true,
): string {
  const percentage = total > 0 ? current / total : 0;
  const filled = Math.round(width * percentage);
  const empty = width - filled;

  const bar = "█".repeat(filled) + dim("░".repeat(empty));
  const numbers = showNumbers ? ` ${current}/${total}` : "";

  return `[${bar}]${numbers}`;
}

export function createTable(
  headers: string[],
  rows: string[][],
  columnWidths?: number[],
): string[] {
  const widths =
    columnWidths ||
    headers.map((h, i) => {
      const maxLength = Math.max(
        h.length,
        ...rows.map((r) => r[i]?.length || 0),
      );
      return Math.min(maxLength + 2, 30);
    });

  const lines: string[] = [];

  const separator = "─".repeat(widths.reduce((sum, w) => sum + w + 3, -1));
  lines.push(separator);

  const headerRow = headers
    .map((h, i) => bold(h.padEnd(widths[i])))
    .join(" │ ");
  lines.push(headerRow);
  lines.push(separator);

  for (const row of rows) {
    const rowStr = row
      .map((cell, i) => (cell || "").padEnd(widths[i]))
      .join(" │ ");
    lines.push(rowStr);
  }

  lines.push(separator);

  return lines;
}
