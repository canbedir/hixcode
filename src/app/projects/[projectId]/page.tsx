"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BiLike, BiDislike } from "react-icons/bi";
import { Star, Settings2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LuEye, LuShare2 } from "react-icons/lu";
import { GoClock, GoArrowUpRight } from "react-icons/go";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { FiLoader, FiMessageSquare, FiSend } from "react-icons/fi";
import { Textarea } from "@/components/ui/textarea";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Contributors from "@/components/Contributors/contributors";
import LanguageBadge from "@/components/LanguageBadge";
import CustomizeProjectSheet from "@/components/Project/CustomizeProjectSheet";
import { getHeaderClasses } from "@/lib/header-presets";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  stars: number;
  lastUpdated: string;
  mostPopularLanguage: string;
  views: number;
  user: {
    name: string | null;
    image: string | null;
    username: string | null;
    email: string | null;
  };
  technicalDetails: string;
  liveUrl: string;
  technologies: string[];
  coverImage: string | null;
  headerStyle: string | null;
  headerColor: string | null;
  contributors: Contributor[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { username: string | null; name: string | null; image: string | null };
}

interface Contributor {
  id: string;
  name: string;
  githubUrl: string;
  image: string;
}

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const isOwner =
    !!session?.user?.email && session.user.email === project?.user?.email;

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchComments();
      fetchContributors();
    }
  }, [projectId]);

  useEffect(() => {
    if (project) {
      setHasLiked(userReaction === "like");
      setHasDisliked(userReaction === "dislike");
    }
  }, [project, userReaction]);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user-projects/${projectId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.statusText}`);
      }
      const data = await response.json();
      setProject(data);
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserReaction(null);
      setHasLiked(false);
      setHasDisliked(false);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    const res = await fetch(`/api/user-projects/${projectId}/comments`);
    const data = await res.json();
    setComments(data);
  };

  const fetchContributors = async () => {
    try {
      const response = await fetch(`/api/user-projects/${projectId}/contributors`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setContributors(data);
    } catch (error) {
      console.error("Error fetching contributors:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }
    if (!newComment.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/user-projects/${projectId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    });
    if (res.ok) {
      const comment = await res.json();
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    } else {
      console.error("Failed to add comment");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!session?.user?.email) return;
    const viewedProjects = JSON.parse(
      localStorage.getItem("viewedProjects") || "[]"
    );
    if (!viewedProjects.includes(projectId)) {
      const updateViews = async () => {
        const res = await fetch(`/api/user-projects/${projectId}/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-email": session.user?.email ?? "",
          },
        });
        if (res.ok) {
          localStorage.setItem(
            "viewedProjects",
            JSON.stringify([...viewedProjects, projectId])
          );
        }
      };
      updateViews();
    }
  }, [projectId, session?.user?.email]);

  const handleReaction = async (type: "like" | "dislike") => {
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }
    const newReaction = userReaction === type ? null : type;
    const previousReaction = userReaction;
    const previousLikes = likes;
    const previousDislikes = dislikes;

    setUserReaction(newReaction);
    setHasLiked(newReaction === "like");
    setHasDisliked(newReaction === "dislike");

    if (type === "like") {
      setLikes((prev) => (newReaction === "like" ? prev + 1 : prev - 1));
      if (previousReaction === "dislike") setDislikes((prev) => prev - 1);
    } else {
      setDislikes((prev) => (newReaction === "dislike" ? prev + 1 : prev - 1));
      if (previousReaction === "like") setLikes((prev) => prev - 1);
    }

    try {
      const res = await fetch(`/api/user-projects/${projectId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newReaction }),
      });
      if (!res.ok) throw new Error("Reaction update failed");
      const data = await res.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserReaction(data.userReaction);
      setHasLiked(data.userReaction === "like");
      setHasDisliked(data.userReaction === "dislike");
    } catch (error) {
      console.error("Error updating reaction:", error);
      setUserReaction(previousReaction);
      setLikes(previousLikes);
      setDislikes(previousDislikes);
      setHasLiked(previousReaction === "like");
      setHasDisliked(previousReaction === "dislike");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied to clipboard", variant: "success" });
    } catch {
      toast({ title: "Could not copy link", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <Skeleton className="w-full h-[400px] rounded-xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!project) {
    return <div className="py-20 text-center text-muted-foreground">Project not found</div>;
  }

  const headerIsImage = project.headerStyle === "image" && !!project.coverImage;
  const headerIsSolid = project.headerStyle === "solid" && !!project.headerColor;
  const headerGradientClass =
    !headerIsImage && !headerIsSolid ? getHeaderClasses(project.headerStyle) : "";

  const techPills = (project.technologies || []).filter(
    (t) => t.toLowerCase() !== (project.mostPopularLanguage || "").toLowerCase()
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10">
        {/* Customizable header */}
        <div
          className={cn(
            "relative w-full h-[420px] overflow-hidden rounded-2xl border",
            headerGradientClass
          )}
          style={
            headerIsImage
              ? {
                  backgroundImage: `url(${project.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : headerIsSolid
              ? { backgroundColor: project.headerColor as string }
              : undefined
          }
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10" />

          {isOwner && (
            <Button
              onClick={() => setCustomizeOpen(true)}
              size="sm"
              className="absolute right-4 top-4 z-10 gap-2 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
            >
              <Settings2 className="h-4 w-4" /> Customize
            </Button>
          )}

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-white sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              {project.mostPopularLanguage && (
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur-md">
                  <LanguageBadge language={project.mostPopularLanguage} />
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="max-w-2xl text-base text-white/90 sm:text-lg">
              {project.description || "Project description not provided."}
            </p>
            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/${project.user?.username}`}
                className="flex items-center gap-3 transition-opacity hover:opacity-90"
              >
                <img
                  src={project.user?.image || "/avatar-placeholder.png"}
                  alt={project.user?.name || "Unknown"}
                  className="h-10 w-10 rounded-full ring-2 ring-white/30"
                />
                <div className="flex flex-col">
                  <span className="font-semibold leading-tight">
                    {project.user?.name || "Unknown"}
                  </span>
                  <span className="text-xs text-white/70">
                    @{project.user?.username || "unknown"} · Creator
                  </span>
                </div>
              </Link>
              <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur-md">
                <Star className="h-4 w-4" /> {project.stars}
              </div>
            </div>
          </div>
        </div>

        {/* Details + actions */}
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex w-full flex-col gap-8 rounded-xl border p-6 sm:p-10 lg:w-2/3">
            <p className="text-muted-foreground">
              {project.technicalDetails ||
                "Technical details for this project have not been provided."}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {project.mostPopularLanguage && (
                <LanguageBadge
                  language={project.mostPopularLanguage}
                  className="rounded-full border px-3 py-1"
                />
              )}
              {techPills.length > 0 ? (
                techPills.map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tech}
                  </span>
                ))
              ) : !project.mostPopularLanguage ? (
                <span className="text-sm text-muted-foreground">
                  No technologies specified
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Button
                    onClick={() => handleReaction("like")}
                    variant="outline"
                    className={cn(
                      "h-12 w-28 transition-colors duration-300",
                      hasLiked &&
                        "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <BiLike className="h-6 w-6" />
                      <span>{likes}</span>
                    </span>
                  </Button>
                  <Button
                    onClick={() => handleReaction("dislike")}
                    variant="outline"
                    className={cn(
                      "h-12 w-28 transition-colors duration-300",
                      hasDisliked &&
                        "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <BiDislike className="h-6 w-6" />
                      <span>{dislikes}</span>
                    </span>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => signIn("github", { callbackUrl: "/" })}
                  variant="outline"
                  className="h-12"
                >
                  Sign in to like this project
                </Button>
              )}
            </div>

            <DropdownMenuSeparator />

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2 text-sm">
                <LuEye className="h-4 w-4" /> <span>{project.views} views</span>
              </span>
              <span className="flex items-center gap-2 text-sm">
                <GoClock className="h-4 w-4" />
                <span>
                  Updated {new Date(project.lastUpdated).toLocaleDateString()}
                </span>
              </span>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="flex h-full flex-col justify-around gap-4 rounded-xl border p-6 sm:p-10">
              <Link className="w-full" href={project.githubUrl} target="_blank">
                <Button className="btn-github flex h-12 w-full items-center gap-2">
                  <FaGithub className="h-6 w-6" /> View on GitHub
                </Button>
              </Link>
              <Link
                className={cn("w-full", !project.liveUrl && "pointer-events-none")}
                href={project.liveUrl || "#"}
                target="_blank"
              >
                <Button
                  className="btn-live flex h-12 w-full items-center gap-2"
                  disabled={!project.liveUrl}
                >
                  <GoArrowUpRight className="h-6 w-6" />
                  {project.liveUrl ? "View Live" : "No Live URL"}
                </Button>
              </Link>
              <Button
                onClick={handleShare}
                className="btn-share flex h-12 w-full items-center gap-2"
              >
                <LuShare2 className="h-6 w-6" /> Share Project
              </Button>
            </div>
          </div>
        </div>

        <Contributors contributors={contributors} />

        {/* Comments */}
        <div className="w-full rounded-xl border p-6 sm:p-10">
          <div className="flex flex-col gap-10">
            <h2 className="flex items-center gap-2 text-2xl font-semibold">
              <FiMessageSquare className="h-6 w-6" /> Comments
            </h2>

            <div className="flex max-h-[400px] flex-col gap-6 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Link href={`/${comment.user?.username || "#"}`}>
                      <img
                        src={comment.user?.image || "/avatar-placeholder.png"}
                        alt={comment.user?.name || "Unknown"}
                        className="h-10 w-10 rounded-full transition-all duration-300 hover:scale-110"
                      />
                    </Link>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <Link href={`/${comment.user?.username || "#"}`}>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold hover:underline">
                              {comment.user?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              @{comment.user?.username || "unknown"}
                            </span>
                          </div>
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}{" "}
                          {new Date(comment.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            <DropdownMenuSeparator />

            {session ? (
              <div className="flex flex-col gap-4">
                <Textarea
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={loading || !newComment.trim()}
                  className="self-end"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <FiLoader className="animate-spin" /> Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FiSend /> Post
                    </span>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                variant="outline"
                className="h-12"
              >
                Sign in to post a comment
              </Button>
            )}
          </div>
        </div>
      </div>

      {isOwner && (
        <CustomizeProjectSheet
          open={customizeOpen}
          onOpenChange={setCustomizeOpen}
          projectId={project.id}
          initial={{
            title: project.title,
            description: project.description || "",
            technicalDetails: project.technicalDetails || "",
            liveUrl: project.liveUrl || "",
            technologies: project.technologies || [],
            coverImage: project.coverImage || "",
            headerStyle: project.headerStyle || "",
            headerColor: project.headerColor || "",
          }}
          onSaved={fetchProject}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;
