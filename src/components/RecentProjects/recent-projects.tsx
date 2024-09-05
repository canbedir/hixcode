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
import Image from "next/image";

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
          console.error("Failed to fetch last updated projects:", data.message);
        }
      } catch (error) {
        console.error("Error fetching last updated projects:", error);
      }
    };

    fetchRecentProjects();
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
            <CarouselItem key={index} className="basis-full">
              <div className="grid grid-cols-3 gap-4">
                {group.map((project) => (
                  <Card key={project.id} className="w-full h-[230px] flex flex-col">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex items-center mb-2">
                        {project.user.image && (
                          <Image
                            src={project.user.image}
                            alt={project.user.name || "User"}
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                        )}
                        <span className="text-sm font-medium">{project.user.name}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-1">{project.title}</h3>
                      <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center">
                          <FaRegDotCircle className="mr-1" />
                          <span className="text-sm">{project.mostPopularLanguage}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          <span className="text-sm">{project.stars}</span>
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
