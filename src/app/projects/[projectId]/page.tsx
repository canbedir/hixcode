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

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        const response = await fetch(`/api/user-projects/${projectId}`);
        const data = await response.json();
        setProject(data);
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
        <div className="p-10 w-full h-[400px] bg-gradient-to-b from-black/5 to-black rounded-xl text-white dark:text-black">
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
                <span className="py-2 px-3 text-xs rounded-full bg-gray-100 dark:bg-black/80 font-semibold">
                  {project?.mostPopularLanguage}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant={"outline"} className="h-12 w-28">
                    <span className="flex items-center gap-2">
                      <BiLike className="h-6 w-6" /> <span>142</span>
                    </span>
                  </Button>

                  <Button variant={"outline"} className="h-12 w-28">
                    <span className="flex items-center gap-2">
                      <BiDislike className="h-6 w-6" /> <span>4</span>
                    </span>
                  </Button>
                </div>

                <div>
                  <span className="py-3 px-5 rounded-full bg-gradient-to-r from-black/20 to-black font-semibold text-white">
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
                  <span className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                    A
                  </span>
                  <span className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                    B
                  </span>
                  <span className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                    C
                  </span>
                  <span className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                    D
                  </span>
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
