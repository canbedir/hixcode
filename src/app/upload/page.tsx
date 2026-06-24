"use client";
import React, { useEffect, useState, KeyboardEvent } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import {
  Search,
  Loader2,
  Star,
  FolderGit2,
  Check,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import LanguageBadge from "@/components/LanguageBadge";
import HeaderStylePicker from "@/components/Project/HeaderStylePicker";
import { getHeaderClasses, DEFAULT_HEADER_STYLE } from "@/lib/header-presets";
import { cn } from "@/lib/utils";

interface Contributor {
  name: string;
  githubUrl: string;
  image: string;
}

const MAX_TECHS = 8;

export default function UploadPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [repos, setRepos] = useState<any[]>([]);
  const [existingProjects, setExistingProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);
  const [loadingContrib, setLoadingContrib] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technicalDetails, setTechnicalDetails] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [currentTech, setCurrentTech] = useState("");
  const [headerStyle, setHeaderStyle] = useState(DEFAULT_HEADER_STYLE);
  const [headerColor, setHeaderColor] = useState("#1e293b");
  const [coverImage, setCoverImage] = useState("");
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;
    (async () => {
      try {
        const res = await fetch(
          `/api/github-repos?accessToken=${session.accessToken}`
        );
        const data = await res.json();
        if (Array.isArray(data)) setRepos(data);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      }
    })();
  }, [session?.accessToken]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      try {
        const res = await fetch(
          "/api/user-projects?limit=all&onlyUserProjects=true"
        );
        const data = await res.json();
        if (Array.isArray(data)) setExistingProjects(data);
      } catch (error) {
        console.error("Failed to fetch existing projects:", error);
      }
    })();
  }, [session]);

  const selectRepo = async (repo: any) => {
    setSelectedRepo(repo);
    setTitle(repo.name || "");
    setDescription(repo.description || "");
    setTechnicalDetails("");
    setLiveUrl(repo.homepage || "");
    setTechnologies([]);
    setCurrentTech("");
    setHeaderStyle(DEFAULT_HEADER_STYLE);
    setHeaderColor("#1e293b");
    setCoverImage("");
    setContributors([]);

    setLoadingContrib(true);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo.full_name}/contributors`
      );
      if (res.ok) {
        const list = await res.json();
        const mapped = await Promise.all(
          list.slice(0, 12).map(async (c: any) => {
            const u = await (await fetch(c.url)).json();
            return {
              name: u.name || u.login,
              githubUrl: u.html_url,
              image: u.avatar_url,
            };
          })
        );
        setContributors(mapped);
      }
    } catch (error) {
      console.error("Error fetching contributors:", error);
    } finally {
      setLoadingContrib(false);
    }
  };

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

  const handleUpload = async () => {
    if (!selectedRepo || !title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/save-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repos: [
            {
              ...selectedRepo,
              name: title,
              description,
              technicalDetails,
              liveUrl,
              technologies,
              contributors,
              headerStyle,
              headerColor: headerStyle === "solid" ? headerColor : "",
              coverImage: headerStyle === "image" ? coverImage : "",
            },
          ],
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Unknown error");

      toast({ title: "Project uploaded", variant: "success" });
      setExistingProjects((prev) => [
        ...prev,
        { id: selectedRepo.id, title, githubUrl: selectedRepo.html_url },
      ]);
      setRepos((prev) => prev.filter((r) => r.id !== selectedRepo.id));
      setSelectedRepo(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to upload project: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Repos not yet uploaded, filtered by search.
  const availableRepos = repos
    .filter((r) => !existingProjects.some((p) => p.githubUrl === r.html_url))
    .filter((r) =>
      `${r.name} ${r.description ?? ""}`.toLowerCase().includes(search.toLowerCase())
    );

  // Large live header preview (mirrors the detail page header).
  const isSolid = headerStyle === "solid";
  const isImage = headerStyle === "image" && !!coverImage;
  const gradientClass = !isSolid && !isImage ? getHeaderClasses(headerStyle) : "";

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-6xl py-10">
        <Skeleton className="mb-8 h-10 w-64" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
          <Skeleton className="h-[60vh] w-full rounded-xl" />
          <Skeleton className="h-[60vh] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-32 text-center">
        <FolderGit2 className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Sign in to add a project</h1>
        <p className="text-muted-foreground">
          Connect your GitHub account to import and showcase your repositories.
        </p>
        <Button onClick={() => signIn("github", { callbackUrl: "/upload" })} size="lg">
          <FaGithub className="mr-2 h-5 w-5" /> Continue with GitHub
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add a project</h1>
        <p className="text-muted-foreground">
          Import a repository and customize how it's presented.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* Repo picker */}
        <aside className="flex flex-col gap-3 rounded-xl border p-4 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-semibold">Your repositories</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories…"
              className="pl-9"
            />
          </div>
          <div className="flex max-h-[58vh] flex-col gap-2 overflow-y-auto pr-1">
            {availableRepos.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No repositories to import.
              </p>
            ) : (
              availableRepos.map((repo) => {
                const active = selectedRepo?.id === repo.id;
                return (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => selectRepo(repo)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent",
                      active
                        ? "border-primary bg-accent ring-1 ring-primary"
                        : "hover:border-primary/40"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{repo.name}</span>
                        {repo.private && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
                            Private
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="truncate text-xs text-muted-foreground">
                          {repo.description}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        {repo.language && (
                          <LanguageBadge language={repo.language} className="text-xs" />
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" /> {repo.stargazers_count}
                        </span>
                      </div>
                    </div>
                    {active && <Check className="h-5 w-5 shrink-0 text-primary" />}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Configure */}
        <main className="min-w-0">
          {!selectedRepo ? (
            <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center">
              <FolderGit2 className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">Select a repository</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Pick a repo from the left to configure its details and customize
                its header.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Large live preview */}
              <div
                className={cn(
                  "relative h-56 w-full overflow-hidden rounded-2xl border",
                  gradientClass
                )}
                style={
                  isImage
                    ? {
                        backgroundImage: `url(${coverImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : isSolid
                    ? { backgroundColor: headerColor }
                    : undefined
                }
              >
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-white">
                  <h2 className="text-3xl font-bold">{title || "Project title"}</h2>
                  <p className="line-clamp-2 max-w-xl text-sm text-white/85">
                    {description || "Your project description will appear here."}
                  </p>
                </div>
              </div>

              <HeaderStylePicker
                headerStyle={headerStyle}
                setHeaderStyle={setHeaderStyle}
                headerColor={headerColor}
                setHeaderColor={setHeaderColor}
                coverImage={coverImage}
                setCoverImage={setCoverImage}
                hidePreview
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Live URL</Label>
                  <Input
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://your-project.com"
                  />
                </div>
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
                  placeholder="Built with Next.js, Tailwind CSS and Prisma…"
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
                        onClick={() =>
                          setTechnologies(technologies.filter((_, j) => j !== i))
                        }
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

              <div className="flex flex-col gap-2">
                <Label>
                  Contributors{" "}
                  {loadingContrib && (
                    <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />
                  )}
                </Label>
                <div className="flex flex-wrap items-center gap-1">
                  {contributors.slice(0, 10).map((c, i) => (
                    <Image
                      key={i}
                      src={c.image || "/avatar-placeholder.png"}
                      alt={c.name}
                      width={32}
                      height={32}
                      title={c.name}
                      className="rounded-full ring-1 ring-border"
                    />
                  ))}
                  {contributors.length > 10 && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      +{contributors.length - 10}
                    </span>
                  )}
                  {!loadingContrib && contributors.length === 0 && (
                    <span className="text-sm text-muted-foreground">None found</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRepo(null)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={saving || !title.trim()}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading
                    </>
                  ) : (
                    "Upload project"
                  )}
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
