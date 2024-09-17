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
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

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

const PopularProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPopularProjects = async () => {
      try {
        const response = await fetch("/api/user-projects?sort=stars&limit=5");
        const data = await response.json();

        if (response.ok) {
          setProjects(data);
        } else {
          console.error("Error fetching popular projects:", data.message);
        }
      } catch (error) {
        console.error("Error fetching popular projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProjects();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <Skeleton className="w-full h-8 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-[300px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 px-2">Top 5 Projects</h1>
      <Carousel className="">
        <CarouselContent>
          {projects.map((project) => (
            <CarouselItem key={project.id}>
              <div className="p-1">
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card>
                    <CardContent className="flex flex-col h-[300px] p-6 justify-between">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            {project?.user?.image && (
                              <Image
                                src={project.user.image || "unknown"}
                                alt={project.user.name || "User"}
                                width={24}
                                height={24}
                                className="rounded-full mr-2"
                              />
                            )}
                            <span className="text-sm font-medium">
                              {project?.user?.name || "unknown name"}
                            </span>
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
                        <p className="text-muted-foreground">
                          {project.description ||
                            `${project.title} description`}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-sm mt-auto">
                        <div className="flex items-center">
                          {project.mostPopularLanguage ? (
                            <>
                              <FaRegDotCircle className="mr-1" />
                              <span className="text-sm">
                                {project.mostPopularLanguage}
                              </span>
                            </>
                          ) : (
                            " "
                          )}
                        </div>

                        <div className="text-sm text-gray-400">
                          Updated{" "}
                          {new Date(project.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
