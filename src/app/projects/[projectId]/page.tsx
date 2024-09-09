"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BiLike, BiDislike } from "react-icons/bi";
import { Github, Star } from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LuEye } from "react-icons/lu";
import { GoClock } from "react-icons/go";
import { LuShare2 } from "react-icons/lu";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { FiMessageSquare, FiSend } from "react-icons/fi";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  stars: number;
  lastUpdated: string;
  mostPopularLanguage: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const router = useRouter()

  const handleLike = async () => {
    const res = await fetch(`/api/user-projects/${projectId}/like`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } else {
      console.error("Like işlemi başarısız oldu.");
    }
  };
  
  const handleDislike = async () => {
    const res = await fetch(`/api/user-projects/${projectId}/dislike`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setDislikes(data.dislikes);
      setLikes(data.likes);
    } else {
      console.error("Dislike işlemi başarısız oldu.");
    }
  };

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        const response = await fetch(`/api/user-projects/${projectId}`);
        const data = await response.json();
        setProject(data);
        setLikes(data.likes);
        setDislikes(data.dislikes);
      };
  
      fetchProject();
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        const response = await fetch(`/api/user-projects/${projectId}`);
        const data = await response.json();
        setProject(data);
        setLikes(data.likes);
        setDislikes(data.dislikes);
      };

      fetchProject();
    }
  }, [projectId]);

  if (!project)
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

  return (
    <div className="py-12">
      <div className="flex flex-col gap-10">
        <div className="p-10 w-full h-[400px] bg-gradient-to-b from-black/5 to-black dark:bg-gradient-to-b dark:from-white/5 dark:to-white/80 rounded-xl text-white dark:text-black">
          <div className="h-full flex flex-col gap-4 justify-end">
            <h1 className="font-bold text-6xl">{project?.title}</h1>
            <h3 className="text-xl">
              {project?.description || `${project.title} description`}
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={project?.user.image || "/avatar-placeholder.png"}
                alt={project?.user.name || "Unknown"}
                className="w-12 h-12 rounded-full hover:scale-110 duration-300 cursor-pointer"
              />
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <h1 className="font-semibold">
                    {project?.user.name || "Unknown"}
                  </h1>
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

        <div className="flex justify-between items-center gap-10">
          <div className="p-10 w-2/3 h-[400px] rounded-xl border">
            <div className="flex flex-col gap-8">
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
                rerum autem ratione ullam sunt itaque neque quae, tempora dolor
                ducimus suscipit minus est amet dolorum! Sequi omnis illum neque
                incidunt.
              </div>
              <div className="flex items-center gap-2">
                <span className="py-2 px-3 text-xs rounded-full bg-gray-100 dark:text-black font-semibold">
                  {project?.mostPopularLanguage}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleLike}
                    variant="outline"
                    className="h-12 w-28"
                  >
                    <span className="flex items-center gap-2">
                      <BiLike className="h-6 w-6" /> <span>{likes > 0 ? likes : 0}</span>
                    </span>
                  </Button>

                  <Button
                    onClick={handleDislike}
                    variant="outline"
                    className="h-12 w-28"
                  >
                    <span className="flex items-center gap-2">
                      <BiDislike className="h-6 w-6" /> <span>{dislikes > 0 ? dislikes : 0}</span>
                    </span>
                  </Button>
                </div>

                <div>
                  <span className="py-3 px-5 rounded-full btn-hover color">
                    Project of the Month
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-gray-200" />

              <div className="flex justify-between items-center text-muted-foreground">
                <span className="flex items-center gap-2 text-sm">
                  <LuEye className="h-4 w-4" /> <span>1200 Views</span>
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

          <div className="flex flex-col gap-5 w-1/3">
            <div className="p-10 h-[190px] border rounded-xl">
              <div className="flex flex-col items-center justify-center gap-4">
                <Link
                  className="w-full"
                  href={project.githubUrl}
                  target="_blank"
                >
                  <Button className="w-full flex items-center gap-2 h-12">
                    <Github className="h-6 w-6" /> View on Github
                  </Button>
                </Link>

                <Button
                  variant={"outline"}
                  className="w-full flex items-center gap-2 h-12"
                >
                  <LuShare2 className="h-6 w-6" /> Share Project
                </Button>
              </div>
            </div>
            <div className="p-10 h-[190px] border rounded-xl">
              <div className="flex flex-col justify-between h-full">
                <h1 className="text-2xl font-semibold">Contributors</h1>
                <div className="flex items-center gap-5">
                  <span className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:text-black">
                    A
                  </span>
                  <span className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:text-black">
                    B
                  </span>
                  <span className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:text-black">
                    C
                  </span>
                  <span className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:text-black">
                    D
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-10">
          <div className="p-10 min-h-[300px] w-2/3 border rounded-xl">
            <div className="flex flex-col gap-10">
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <FiMessageSquare className="h-6 w-6" /> Comments
              </h1>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <img
                        src={project.user.image || "/avatar-placeholder.png"}
                        alt={project.user.name || "Unknown"}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <h1 className="font-semibold">
                          {project.user.name || "Unknown"}
                        </h1>
                        <div>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Eveniet rerum autem ratione ullam sunt itaque
                          neque quae, tempora dolor ducimus suscipit minus est
                          amet dolorum! Sequi omnis illum neque incidunt.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <img
                        src={project.user.image || "/avatar-placeholder.png"}
                        alt={project.user.name || "Unknown"}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <h1 className="font-semibold">
                          {project.user.name || "Unknown"}
                        </h1>
                        <div>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Eveniet rerum autem ratione ullam sunt itaque
                          neque quae, tempora dolor ducimus suscipit minus est
                          amet dolorum! Sequi omnis illum neque incidunt.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-3">
                <Textarea
                  placeholder="Add a comment..."
                  className="min-h-[150px]"
                />
                <Button className="w-1/4 p-6 flex items-center gap-1">
                  <FiSend className="h-6 w-6" /> Post Comment
                </Button>
              </div>
            </div>
          </div>

          <div className="w-1/3 border rounded-xl p-10 h-[400px]">
            <div className="flex flex-col gap-10">
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                Related Projects
              </h1>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <img
                    src={project.user.image || "s"}
                    alt={project.user.name || "a"}
                    className="rounded-full h-12 w-12"
                  />
                  <h2>Project A</h2>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={project.user.image || "s"}
                    alt={project.user.name || "a"}
                    className="rounded-full h-12 w-12"
                  />
                  <h2>Project B</h2>
                </div>

                <div className="flex items-center gap-2">
                  <img
                    src={project.user.image || "s"}
                    alt={project.user.name || "a"}
                    className="rounded-full h-12 w-12"
                  />
                  <h2>Project C</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
