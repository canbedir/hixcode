"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BiLike, BiDislike } from "react-icons/bi";
import { Github, Star } from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LuEye } from "react-icons/lu";
import { GoClock } from "react-icons/go";
import { LuShare2 } from "react-icons/lu";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { FiLoader, FiMessageSquare, FiSend } from "react-icons/fi";
import { Textarea } from "@/components/ui/textarea";
import { signIn, useSession } from "next-auth/react";
import { GoArrowUpRight } from "react-icons/go";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Contributors from "@/components/Contributors/contributors";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  stars: number;
  lastUpdated: string;
  mostPopularLanguage: string;
  views: number;
  username: string;
  user: {
    name: string | null;
    image: string | null;
    username: string | null;
    badges: {
      id: string;
      name: string;
      description: string;
      icon: string;
    }[];
  };
  technicalDetails: string;
  liveUrl: string;
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
  }[];
  technologies: string[];
  contributors: Contributor[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string | null;
    name: string | null;
    image: string | null;
  };
}

interface Contributor {
  id: string;
  name: string;
  githubUrl: string;
  image: string;
}

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(
    null
  );
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEarlyAdopterProject, setIsEarlyAdopterProject] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const router = useRouter();

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

  useEffect(() => {
    if (project && project.user && project.user.badges) {
      const isEarlyAdopter = project.user.badges.some(
        (badge) => badge.name === "Early Adopter"
      );
      setIsEarlyAdopterProject(isEarlyAdopter);
    }
  }, [project]);

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
      const response = await fetch(
        `/api/user-projects/${projectId}/contributors`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: newComment,
      }),
    });

    if (res.ok) {
      const comment = await res.json();
      setComments((prevComments) => [comment, ...prevComments]);
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
        } else {
          console.error("View update failed.");
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
      if (previousReaction === "dislike") {
        setDislikes((prev) => prev - 1);
      }
    } else {
      setDislikes((prev) => (newReaction === "dislike" ? prev + 1 : prev - 1));
      if (previousReaction === "like") {
        setLikes((prev) => prev - 1);
      }
    }

    try {
      const res = await fetch(`/api/user-projects/${projectId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newReaction }),
      });

      if (!res.ok) {
        throw new Error("Reaction update failed");
      }

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

  if (isLoading) {
    return (
      <div className="relative h-screen">
        <div
          className="flex justify-center items-center"
          style={{ height: "calc(100% - 160px)" }}
        >
          <ClipLoader color="#b5b5b5" size={100} />
        </div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10">
        <div className="p-6 sm:p-10 w-full h-[400px] bg-gradient-to-b from-black/5 to-black dark:bg-gradient-to-b dark:from-white/5 dark:to-white/80 rounded-xl text-white dark:text-black">
          <div className="h-full flex flex-col gap-4 justify-end">
            <h1 className="font-bold text-6xl">{project?.title}</h1>
            <h3 className="text-xl">
              {project?.description || "Project description not provided."}
            </h3>
            <div className="flex items-center gap-3">
              <Link href={`/${project.user?.username}`}>
                <img
                  src={project?.user?.image || "/avatar-placeholder.png"}
                  alt={project?.user?.name || "Unknown"}
                  className="w-10 h-10 rounded-full hover:scale-110 transition-all duration-300"
                />
              </Link>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Link href={`/${project.user?.username}`}>
                      <div className="flex items-center gap-1">
                        <h1 className="font-semibold hover:underline">
                          {project?.user?.name || "Unknown"}
                        </h1>
                        <h1 className="text-xs text-white/70 dark:text-slate-600 ">
                          @{project?.user?.username || "Unknown"}
                        </h1>
                      </div>
                    </Link>
                    {project.user?.badges && (
                      <div className="h-5 border rounded-sm flex items-center p-0.5">
                        <div className="flex items-center gap-1">
                          {project.user.badges.map((badge) => (
                            <HoverCard key={badge.id}>
                              <HoverCardTrigger asChild>
                                <div className="relative cursor-pointer">
                                  <Image
                                    src={
                                      badge.icon.startsWith("/")
                                        ? badge.icon
                                        : `/badges/${badge.name
                                            .toLowerCase()
                                            .replace(" ", "-")}.svg`
                                    }
                                    alt={badge.name}
                                    width={16}
                                    height={16}
                                  />
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-64" side="top">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={badge.icon} />
                                    <AvatarFallback>
                                      {badge.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="text-sm font-semibold">
                                      {badge.name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                      {badge.description}
                                    </p>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-white/80 dark:text-black/80">
                    Project Creator
                  </span>
                </div>

                <div className="flex items-center text-lg gap-1">
                  <Star className="h-5 w-5" /> {project?.stars}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="p-6 sm:p-10 w-full lg:w-2/3 h-[450px] md:h-[400px] rounded-xl border flex flex-col justify-center">
            <div className="flex flex-col gap-8">
              <div>
                {project?.technicalDetails ||
                  "Technical details for this project have not been provided."}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {project?.technologies && project.technologies.length > 0 ? (
                  project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="py-2 px-3 text-xs rounded-full bg-gray-200 dark:text-black font-semibold mb-2"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span>No technologies specified</span>
                )}
              </div>
              <div className="flex items-start md:items-center flex-col md:flex-row gap-10 md:gap-0 md:justify-between">
                <div className="flex items-center gap-4">
                  {session ? (
                    <>
                      <Button
                        onClick={() => handleReaction("like")}
                        variant="outline"
                        className={`like-button h-12 w-28 ${
                          hasLiked
                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                            : ""
                        } border transition-colors duration-300`}
                      >
                        <span className="flex items-center gap-2">
                          <BiLike className="h-6 w-6" />
                          <span>{likes}</span>
                        </span>
                      </Button>

                      <Button
                        onClick={() => handleReaction("dislike")}
                        variant="outline"
                        className={`dislike-button h-12 w-28 ${
                          hasDisliked
                            ? "bg-red-600 text-white hover:bg-red-700 hover:text-white"
                            : ""
                        } border transition-colors duration-300`}
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

                {isEarlyAdopterProject && (
                  <div>
                    <span className="py-3 px-5 rounded-full btn-hover color">
                      Early Adopter&apos;s Project
                    </span>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator className="bg-gray-200" />

              <div className="flex justify-between items-center text-muted-foreground">
                <span className="flex items-center gap-2 text-sm">
                  <LuEye className="h-4 w-4" />{" "}
                  <span>{project.views} views</span>
                </span>

                <span className="flex items-center gap-2 text-sm">
                  <GoClock className="h-4 w-4" />
                  <span>
                    Updated {new Date(project.lastUpdated).toLocaleDateString()}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full lg:w-1/3">
            <div className="p-6 sm:p-10 h-[400px] border rounded-xl">
              <div className="flex flex-col h-full items-center justify-around ">
                <Link
                  className="w-full"
                  href={project.githubUrl}
                  target="_blank"
                >
                  <Button className="w-full flex items-center gap-2 h-12 btn-github">
                    <Github className="h-6 w-6" /> View on GitHub
                  </Button>
                </Link>
                <Link
                  className={`w-full ${
                    !project.liveUrl ? "pointer-events-none" : ""
                  }`}
                  href={project.liveUrl || "#"}
                  target="_blank"
                >
                  <Button
                    className="w-full flex items-center gap-2 h-12 btn-live"
                    disabled={!project.liveUrl}
                  >
                    <GoArrowUpRight className="h-6 w-6" />
                    {project.liveUrl ? "View Live" : "No Live URL"}
                  </Button>
                </Link>

                <Button className="w-full flex items-center gap-2 h-12 btn-share">
                  <LuShare2 className="h-6 w-6" /> Share Project
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Contributors contributors={contributors} />

        <div className="flex flex-col gap-6">
          <div className="w-full p-6 sm:p-10 border rounded-xl">
            <div className="flex flex-col gap-10">
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <FiMessageSquare className="h-6 w-6" /> Comments
              </h1>

              {/* Display comments */}
              <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <div className="flex gap-3 items-start">
                        <Link href={`/${comment.user?.username || "#"}`}>
                          <img
                            src={
                              comment.user?.image || "/avatar-placeholder.png"
                            }
                            alt={comment.user?.name || "Unknown"}
                            className="w-10 h-10 rounded-full hover:scale-110 transition-all duration-300"
                          />
                        </Link>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <Link href={`/${comment.user?.username || "#"}`}>
                              <div className="flex items-center gap-1">
                                <h1 className="font-semibold hover:underline">
                                  {comment.user?.name || "Unknown"}
                                </h1>
                                <h1 className="text-xs text-slate-600 dark:text-white/70">
                                  @{comment.user?.username || "Unknown"}
                                </h1>
                              </div>
                            </Link>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}{" "}
                              {new Date(comment.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>

              <DropdownMenuSeparator />

              {/* Add new comment */}
              <div className="flex flex-col gap-3">
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
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
