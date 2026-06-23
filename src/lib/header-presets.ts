// Header background presets for the project detail page. Owners pick one of
// these (or a solid color / cover image). Class strings are full literals so
// Tailwind's content scanner keeps them in the build.

export interface HeaderPreset {
  id: string;
  label: string;
  className: string;
}

export const HEADER_PRESETS: HeaderPreset[] = [
  {
    id: "gradient-blue",
    label: "Blue",
    className: "bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700",
  },
  {
    id: "gradient-violet",
    label: "Violet",
    className: "bg-linear-to-br from-violet-500 via-purple-600 to-fuchsia-600",
  },
  {
    id: "gradient-emerald",
    label: "Emerald",
    className: "bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-600",
  },
  {
    id: "gradient-sunset",
    label: "Sunset",
    className: "bg-linear-to-br from-orange-400 via-pink-500 to-purple-600",
  },
  {
    id: "gradient-rose",
    label: "Rose",
    className: "bg-linear-to-br from-rose-400 via-red-500 to-orange-500",
  },
  {
    id: "gradient-slate",
    label: "Slate",
    className: "bg-linear-to-br from-slate-600 via-slate-800 to-slate-950",
  },
];

export const DEFAULT_HEADER_STYLE = "gradient-blue";

const PRESET_BY_ID = new Map(HEADER_PRESETS.map((p) => [p.id, p]));

// Returns the gradient classes for a preset id, falling back to the default.
// "solid" and "image" styles are handled separately (inline color / cover URL).
export function getHeaderClasses(headerStyle?: string | null): string {
  const preset = PRESET_BY_ID.get(headerStyle ?? DEFAULT_HEADER_STYLE);
  return (preset ?? PRESET_BY_ID.get(DEFAULT_HEADER_STYLE)!).className;
}
