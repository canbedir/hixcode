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
import { Button } from "../ui/button";

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  image: string;
  mostPopularLanguage: string;
  stars: number;
  lastUpdated: string;
}

const RecentProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

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
          console.error(
            "Son güncellenen projeleri alma başarısız oldu:",
            data.message
          );
        }
      } catch (error) {
        console.error("Son güncellenen projeleri alırken hata oluştu:", error);
      }
    };

    fetchRecentProjects();
    const interval = setInterval(fetchRecentProjects, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-bold mb-4">Last Updated Projects</h1>
        <Button>View All</Button>
      </div>
      <Carousel>
        <CarouselContent className="flex">
          {chunkProjects(projects, 3).map((group, index) => (
            <CarouselItem key={index} className="w-full flex">
              {group.map((project) => (
                <div key={project.id} className="w-1/3 p-1">
                  <Card>
                    <CardContent className="flex flex-col h-[300px] p-6 justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {project.title}
                        </h2>
                        <p className="text-gray-500">
                          {project.description ||
                            `${project.title} description`}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-300 mt-auto">
                        <div className="flex items-center gap-2">
                          <FaRegDotCircle size={10} />
                          {project.mostPopularLanguage}
                        </div>
                        <div className="flex items-center gap-2 text-lg">
                          <Star size={16} /> {project.stars}
                        </div>
                        <div className="text-sm text-gray-400">
                          Updated{" "}
                          {new Date(project.lastUpdated).toLocaleString(
                            "tr-TR",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
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
