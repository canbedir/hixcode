"use client";

import React, { useEffect, useState, KeyboardEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HEADER_PRESETS,
  DEFAULT_HEADER_STYLE,
  getHeaderClasses,
} from "@/lib/header-presets";

export interface CustomizeInitial {
  title: string;
  description: string;
  technicalDetails: string;
  liveUrl: string;
  technologies: string[];
  coverImage: string;
  headerStyle: string;
  headerColor: string;
}

interface CustomizeProjectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  initial: CustomizeInitial;
  onSaved: () => void;
}

const MAX_TECHS = 8;

export default function CustomizeProjectSheet({
  open,
  onOpenChange,
  projectId,
  initial,
  onSaved,
}: CustomizeProjectSheetProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [technicalDetails, setTechnicalDetails] = useState(
    initial.technicalDetails
  );
  const [liveUrl, setLiveUrl] = useState(initial.liveUrl);
  const [technologies, setTechnologies] = useState<string[]>(
    initial.technologies
  );
  const [currentTech, setCurrentTech] = useState("");
  const [headerStyle, setHeaderStyle] = useState(
    initial.headerStyle || DEFAULT_HEADER_STYLE
  );
  const [headerColor, setHeaderColor] = useState(initial.headerColor || "#1e293b");
  const [coverImage, setCoverImage] = useState(initial.coverImage);

  // Reset local form whenever the sheet opens with (possibly) fresh data.
  useEffect(() => {
    if (open) {
      setTitle(initial.title);
      setDescription(initial.description);
      setTechnicalDetails(initial.technicalDetails);
      setLiveUrl(initial.liveUrl);
      setTechnologies(initial.technologies);
      setCurrentTech("");
      setHeaderStyle(initial.headerStyle || DEFAULT_HEADER_STYLE);
      setHeaderColor(initial.headerColor || "#1e293b");
      setCoverImage(initial.coverImage);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const addTech = () => {
    const t = currentTech.trim();
    if (t && technologies.length < MAX_TECHS && !technologies.includes(t)) {
      setTechnologies([...technologies, t]);
    }
    setCurrentTech("");
  };

  const handleTechKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && currentTech.trim()) {
      e.preventDefault();
      addTech();
    } else if (e.key === "Backspace" && currentTech === "" && technologies.length) {
      setTechnologies(technologies.slice(0, -1));
    }
  };

  // Preview style for the small header thumbnail.
  const previewStyle: React.CSSProperties =
    headerStyle === "solid"
      ? { backgroundColor: headerColor }
      : headerStyle === "image" && coverImage
      ? { backgroundImage: `url(${coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
      : {};
  const previewClass =
    headerStyle === "solid" || headerStyle === "image"
      ? ""
      : getHeaderClasses(headerStyle);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/user-projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          technicalDetails,
          liveUrl,
          technologies,
          headerStyle,
          headerColor: headerStyle === "solid" ? headerColor : "",
          coverImage: headerStyle === "image" ? coverImage : coverImage,
        }),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      toast({ title: "Project updated", variant: "success" });
      onOpenChange(false);
      onSaved();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to save changes", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customize project</SheetTitle>
          <SheetDescription>
            Make this page yours. Changes are visible to everyone.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6">
          {/* Live header preview */}
          <div
            className={cn(
              "relative h-24 w-full overflow-hidden rounded-lg border",
              previewClass
            )}
            style={previewStyle}
          >
            <div className="absolute inset-0 bg-black/20" />
            <span className="absolute bottom-2 left-3 text-sm font-semibold text-white drop-shadow">
              {title || "Project title"}
            </span>
          </div>

          {/* Header style */}
          <div className="flex flex-col gap-3">
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
                    headerStyle === preset.id && "ring-2 ring-ring ring-offset-2 ring-offset-background"
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
                  headerStyle === "solid" && "ring-2 ring-ring ring-offset-2 ring-offset-background"
                )}
                style={{ backgroundColor: headerColor }}
              />
            </div>

            {headerStyle === "solid" && (
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

          {/* Fields */}
          <div className="flex flex-col gap-1">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="max-h-40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Technical details</Label>
            <Textarea
              value={technicalDetails}
              onChange={(e) => setTechnicalDetails(e.target.value)}
              className="max-h-40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Live URL</Label>
            <Input
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://your-project.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Technologies (max {MAX_TECHS})</Label>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, i) => (
                <span
                  key={`${tech}-${i}`}
                  className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs text-primary"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => setTechnologies(technologies.filter((_, j) => j !== i))}
                    className="text-primary/60 hover:text-primary"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <Input
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value)}
              onKeyDown={handleTechKeyDown}
              placeholder="Type and press space to add"
              disabled={technologies.length >= MAX_TECHS}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
