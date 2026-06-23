// Official GitHub language colors (subset of github-linguist).
// Used to render the familiar colored dot next to a project's primary language.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  "Jupyter Notebook": "#DA5B0B",
  "Objective-C": "#438eff",
  Scala: "#c22d40",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  Perl: "#0298c3",
  R: "#198CE7",
  MATLAB: "#e16737",
  Solidity: "#AA6746",
  Astro: "#ff5a03",
  Zig: "#ec915c",
};

const FALLBACK_COLOR = "#8b949e";

export function getLanguageColor(language?: string | null): string {
  if (!language) return FALLBACK_COLOR;
  return LANGUAGE_COLORS[language] ?? FALLBACK_COLOR;
}
