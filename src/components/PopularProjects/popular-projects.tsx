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

const PopularProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchPopularProjects = async () => {
      try {
        const response = await fetch("/api/user-projects");
        const data = await response.json();

        if (response.ok) {
          setProjects(data);
        } else {
          console.error("Failed to fetch popular projects:", data.message);
        }
      } catch (error) {
        console.error("Error fetching popular projects:", error);
      }
    };

    fetchPopularProjects();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Popular Projects</h1>
      <Carousel className="w-full">
        <CarouselContent>
          {projects.map((project) => (
            <CarouselItem key={project.id}>
              <div className="p-1">
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
                        Updated {new Date(project.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

export default PopularProjects;
