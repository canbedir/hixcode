import { getLanguageColor } from "@/lib/language-colors";
import { cn } from "@/lib/utils";

interface LanguageBadgeProps {
  language?: string | null;
  className?: string;
}

// GitHub-style colored dot + language label.
export default function LanguageBadge({ language, className }: LanguageBadgeProps) {
  if (!language) return null;

  return (
    <span className={cn("flex items-center gap-1.5 text-sm", className)}>
      <span
        className="h-3 w-3 rounded-full ring-1 ring-black/10 dark:ring-white/10"
        style={{ backgroundColor: getLanguageColor(language) }}
        aria-hidden
      />
      {language}
    </span>
  );
}
