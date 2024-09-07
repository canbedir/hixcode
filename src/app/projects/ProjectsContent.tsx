"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaRegDotCircle } from "react-icons/fa";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  image: string;
  mostPopularLanguage: string;
  stars: number;
  lastUpdated: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

export default function ProjectsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSortBy =
    (searchParams.get("sort") as "lastUpdated" | "stars") || "stars";
  const [sortBy, setSortBy] = useState<"lastUpdated" | "stars">(initialSortBy);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const sortParam = searchParams.get("sort") as "lastUpdated" | "stars";
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/user-projects?sort=${sortBy}`);
        const data = await response.json();

        if (response.ok) {
          setProjects(data);
        } else {
          console.error("Error fetching projects:", data.message);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, [sortBy]);

  const handleSort = (newSortBy: "lastUpdated" | "stars") => {
    setLoading(true);
    router.push(`/projects?sort=${newSortBy}`);
  };

  if (status === "loading" || !session || loading) {
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

  return (
    <div className="container mx-auto mt-10 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Projects</h1>
        <div>
          <button
            onClick={() => handleSort("stars")}
            className={sortBy === "stars" ? "font-bold" : ""}
          >
            Sort by Highest Star
          </button>
          <DropdownMenuSeparator />
          <button
            onClick={() => handleSort("lastUpdated")}
            className={sortBy === "lastUpdated" ? "font-bold" : ""}
          >
            Sort by Last Updated
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card>
              <CardContent className="flex flex-col h-[300px] p-6 justify-between">
                <div className="flex items-center mb-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {project.user.image && (
                        <Image
                          src={project.user.image}
                          alt={project.user.name || "User"}
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />
                      )}
                      <span className="text-sm font-medium">
                        {project.user.name || "Anonymous User"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                      <Star size={16} /> {project.stars}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <p className="text-muted-foreground line-clamp-2">
                    {project.description || `${project.title} description`}
                  </p>
                </div>
                <div className="flex justify-between items-center text-sm text-black mt-auto">
                  <div className="flex items-center">
                    {project.mostPopularLanguage && (
                      <>
                        <FaRegDotCircle className="mr-1" />
                        <span className="text-sm">
                          {project.mostPopularLanguage}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    Updated {new Date(project.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
