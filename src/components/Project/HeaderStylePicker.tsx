"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HEADER_PRESETS,
  DEFAULT_HEADER_STYLE,
  getHeaderClasses,
} from "@/lib/header-presets";

interface HeaderStylePickerProps {
  headerStyle: string;
  setHeaderStyle: (v: string) => void;
  headerColor: string;
  setHeaderColor: (v: string) => void;
  coverImage: string;
  setCoverImage: (v: string) => void;
  previewLabel?: string;
  /** Hide the built-in thumbnail (when the parent renders its own preview). */
  hidePreview?: boolean;
}

// Shared header-customization control: live preview + gradient presets +
// solid color + cover-image URL. Used by the upload flow and the edit sheet.
export default function HeaderStylePicker({
  headerStyle,
  setHeaderStyle,
  headerColor,
  setHeaderColor,
  coverImage,
  setCoverImage,
  previewLabel,
  hidePreview = false,
}: HeaderStylePickerProps) {
  const isSolid = headerStyle === "solid";
  const isImage = headerStyle === "image" && !!coverImage;

  const previewStyle: React.CSSProperties = isSolid
    ? { backgroundColor: headerColor }
    : isImage
    ? {
        backgroundImage: `url(${coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};
  const previewClass = isSolid || isImage ? "" : getHeaderClasses(headerStyle);

  return (
    <div className="flex flex-col gap-3">
      {/* Live preview */}
      {!hidePreview && (
        <div
          className={cn(
            "relative h-24 w-full overflow-hidden rounded-lg border",
            previewClass
          )}
          style={previewStyle}
        >
          <div className="absolute inset-0 bg-black/20" />
          <span className="absolute bottom-2 left-3 text-sm font-semibold text-white drop-shadow">
            {previewLabel || "Project title"}
          </span>
        </div>
      )}

      <Label>Header style</Label>
      <div className="flex flex-wrap gap-2">
        {HEADER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            title={preset.label}
            onClick={() => setHeaderStyle(preset.id)}
            className={cn(
              "relative h-9 w-9 rounded-full border",
              preset.className,
              headerStyle === preset.id &&
                "ring-2 ring-ring ring-offset-2 ring-offset-background"
            )}
          >
            {headerStyle === preset.id && (
              <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
            )}
          </button>
        ))}
        <button
          type="button"
          title="Solid color"
          onClick={() => setHeaderStyle("solid")}
          className={cn(
            "h-9 w-9 rounded-full border",
            isSolid && "ring-2 ring-ring ring-offset-2 ring-offset-background"
          )}
          style={{ backgroundColor: headerColor }}
        />
      </div>

      {isSolid && (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={headerColor}
            onChange={(e) => setHeaderColor(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded border bg-transparent"
          />
          <Input
            value={headerColor}
            onChange={(e) => setHeaderColor(e.target.value)}
            placeholder="#1e293b"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Cover image URL (overrides the gradient)
        </Label>
        <Input
          value={coverImage}
          onChange={(e) => {
            setCoverImage(e.target.value);
            setHeaderStyle(e.target.value ? "image" : DEFAULT_HEADER_STYLE);
          }}
          placeholder="https://…/cover.png"
        />
      </div>
    </div>
  );
}
