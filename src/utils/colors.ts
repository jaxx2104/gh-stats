import {
  bold,
  cyan,
  green,
  yellow,
  red,
  blue,
  magenta,
  gray,
  brightBlue,
  brightGreen,
  brightYellow,
  brightRed,
  brightMagenta,
  brightCyan,
  white,
  dim,
  italic,
  underline,
  stripAnsiCode,
} from "@std/fmt/colors";

export {
  bold,
  cyan,
  green,
  yellow,
  red,
  blue,
  magenta,
  gray,
  brightBlue,
  brightGreen,
  brightYellow,
  brightRed,
  brightMagenta,
  brightCyan,
  white,
  dim,
  italic,
  underline,
  stripAnsiCode,
};

export function success(text: string): string {
  return brightGreen(text);
}

export function error(text: string): string {
  return brightRed(text);
}

export function warning(text: string): string {
  return brightYellow(text);
}

export function info(text: string): string {
  return brightBlue(text);
}

export function highlight(text: string): string {
  return brightCyan(text);
}

export function muted(text: string): string {
  return gray(text);
}

export function getLanguageColor(language: string): (text: string) => string {
  const colors: Record<string, (text: string) => string> = {
    TypeScript: brightBlue,
    JavaScript: yellow,
    Python: blue,
    Java: red,
    Go: cyan,
    Rust: brightRed,
    C: gray,
    "C++": magenta,
    "C#": green,
    Ruby: red,
    PHP: blue,
    Swift: brightRed,
    Kotlin: brightMagenta,
    Dart: brightCyan,
    Shell: green,
    HTML: red,
    CSS: blue,
    SCSS: magenta,
    Vue: brightGreen,
    React: brightCyan,
  };

  return colors[language] || white;
}
