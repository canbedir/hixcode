"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { Star } from "lucide-react";
import LanguageBadge from "@/components/LanguageBadge";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { ProjectGridSkeleton } from "@/components/skeletons/ProjectCardSkeleton";

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
    username: string | null;
  };
}

const RecentProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const chunkProjects = (projects: Project[], size: number) => {
    const chunked = [];
    for (let i = 0; i < projects.length; i += size) {
      chunked.push(projects.slice(i, i + size));
    }
    return chunked;
  };

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const response = await fetch("/api/user-projects/last-updated", {
          cache: "no-store",
        });
        const data = await response.json();

        if (response.ok) {
          setProjects(data);
        } else {
          console.error("Error fetching recent projects:", data.message);
        }
      } catch (error) {
        console.error("Error fetching recent projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between px-2 mb-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-9 w-20" />
        </div>
        <ProjectGridSkeleton
          count={2}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        />
      </div>
    );
  }

  const handleViewAll = () => {
    router.push("/projects?sort=lastUpdated");
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-2 mb-4">
        <h1 className="text-2xl font-bold">Recently Updated Projects</h1>
        {!showAll && <Button onClick={handleViewAll}>View All</Button>}
      </div>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {chunkProjects(projects, 2).map((group, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
                      <CardContent className="flex flex-col h-[300px] p-4 sm:p-6 justify-between">
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
                              <div className="flex items-center gap-1">
                                <span className="font-medium hover:underline">
                                  {project.user.name || "Anonymous User"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  @{project.user.username || "Anonymous User"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-lg">
                              <Star size={16} /> {project.stars}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h2 className="text-xl font-semibold">
                            {project.title}
                          </h2>
                          <p className="text-muted-foreground line-clamp-2">
                            {project.description ||
                              `${project.title} description`}
                          </p>
                        </div>

                        <div className="flex justify-between items-center text-sm mt-auto">
                          <LanguageBadge
                            language={project.mostPopularLanguage}
                          />

                          <div className="text-sm text-gray-400">
                            Updated{" "}
                            {new Date(project.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0">
          <CarouselPrevious className="left-0 -translate-x-1/2" />
          <CarouselNext className="right-0 translate-x-1/2" />
        </div>
      </Carousel>
    </div>
  );
};

export default RecentProjects;
