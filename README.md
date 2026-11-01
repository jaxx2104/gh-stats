# gh-stats 📊

A GitHub CLI extension that provides beautiful repository statistics right in your terminal.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Bun](https://img.shields.io/badge/bun-1.4+-black)
![License](https://img.shields.io/badge/license-MIT-yellow)

## ✨ Features

- 📈 **Repository Statistics** - View comprehensive metrics including stars, forks, issues, and PRs
- 👥 **Contributor Analytics** - Analyze top contributors with detailed contribution data
- 💻 **Language Distribution** - Visualize programming language usage with colorful charts
- 📊 **Terminal Graphs** - Beautiful ASCII charts and graphs directly in your terminal
- 📄 **Export Reports** - Generate reports in Markdown, JSON, or CSV formats
- 🎨 **Colorful Output** - Enhanced terminal experience with syntax highlighting
- 🚀 **Fast & Efficient** - Built with Bun and TypeScript for optimal performance

## 📊 Output Examples

### Repository Statistics

```
📊 Fetching statistics for owner/repo...

📋 Repository Overview
──────────────────────────────────────────────────
Name            awesome-project
Description     An awesome project that does cool things
Created         Jan 15, 2023
Last Updated    Dec 20, 2024
Primary Language TypeScript

📈 Key Metrics
──────────────────────────────────────────────────
⭐ Stars         1.2k
🍴 Forks         234
👁️ Watchers      89
🐛 Issues        45
🔀 Pull Requests 128
📦 Releases      15
💾 Commits       2.3k

💻 Language Distribution
──────────────────────────────────────────────────
TypeScript      ████████████████████ 85.2%
JavaScript      ███ 8.3%
CSS             ██ 4.1%
HTML            █ 2.4%
```

### Contributor Statistics

```
👥 Top Contributors
──────────────────────────────────────────────────
# │ Username  │ Name        │ Contributions │ Activity    │ %
1 │ alice     │ Alice Smith │ 523          │ ▇▆▇█▇▆▅▇█  │ 100.0%
2 │ bob       │ Bob Jones   │ 342          │ ▅▆▄▅▇▄▃▅▆  │ 65.4%
3 │ charlie   │ Charlie Lee │ 198          │ ▃▄▃▅▄▂▃▄▃  │ 37.9%
```

## 📦 Installation

gh-stats runs on [Bun](https://bun.sh). Make sure `bun` (1.4 or later) is on your `PATH`, then install the extension:

```sh
gh extension install jaxx2104/gh-stats
gh stats owner/repo
```

Dependencies are installed automatically with `bun install --production` on the first run.

## 🛠️ Development

The Bun version is managed with [mise](https://mise.jdx.dev).

```sh
mise install
bun install

bun run dev -- owner/repo --all   # run the CLI
bun test                          # run tests (bun:test)
bun run typecheck                 # tsc --noEmit
bun run check                     # Biome lint + format check
bun run fmt                       # apply Biome formatting
```
