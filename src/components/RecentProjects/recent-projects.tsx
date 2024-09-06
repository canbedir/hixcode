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
import { FaRegDotCircle } from "react-icons/fa";
import { Star } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

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

const RecentProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
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
      }
    };

    fetchRecentProjects();
  }, []);

  const handleViewAll = () => {
    router.push('/projects?sort=lastUpdated');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-2 mb-4">
        <h1 className="text-2xl font-bold">Recently Updated Projects</h1>
        {!showAll && <Button onClick={handleViewAll}>View All</Button>}
      </div>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {chunkProjects(projects, 2).map((group, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.map((project) => (
                  <Card key={project.id}>
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
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default RecentProjects;
