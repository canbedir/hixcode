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
import FilterProjects from "@/components/FilterProjects/filter-projects";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

export default function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSortBy =
    (searchParams.get("sort") as "lastUpdated" | "stars") || "stars";
  const [sortBy, setSortBy] = useState<"lastUpdated" | "stars">(initialSortBy);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    language: "",
    topic: "",
    minStars: 0,
  });

  useEffect(() => {
    const sortParam = searchParams.get("sort") as "lastUpdated" | "stars";
    const languageParam = searchParams.get("language");
    const topicParam = searchParams.get("topic");
    const minStarsParam = searchParams.get("minStars");

    if (sortParam) setSortBy(sortParam);
    if (languageParam)
      setFilters((prev) => ({ ...prev, language: languageParam }));
    if (topicParam) setFilters((prev) => ({ ...prev, topic: topicParam }));
    if (minStarsParam)
      setFilters((prev) => ({ ...prev, minStars: parseInt(minStarsParam) }));
  }, [searchParams]);

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams();
        searchParams.set("sort", sortBy);
        if (filters.language !== "all")
          searchParams.set("language", filters.language);
        if (filters.topic !== "all") searchParams.set("topic", filters.topic);
        if (filters.minStars > 0)
          searchParams.set("minStars", filters.minStars.toString());

        const response = await fetch(
          `/api/user-projects?${searchParams.toString()}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, [sortBy, filters]);

  const handleSort = (newSortBy: "lastUpdated" | "stars") => {
    setLoading(true);
    router.push(`/projects?sort=${newSortBy}`);
  };

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    const searchParams = new URLSearchParams(window.location.search);
    if (newFilters.language !== "all")
      searchParams.set("language", newFilters.language);
    else searchParams.delete("language");
    if (newFilters.topic !== "all") searchParams.set("topic", newFilters.topic);
    else searchParams.delete("topic");
    if (newFilters.minStars > 0)
      searchParams.set("minStars", newFilters.minStars.toString());
    else searchParams.delete("minStars");
    router.push(`/projects?${searchParams.toString()}`, { scroll: false });
  };

  if (loading) {
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

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  return (
    <div className="mt-10 py-4">
      <div className="mb-6 border-b">
        <FilterProjects onFilter={handleFilter} initialFilters={filters} />
      </div>
      <div className="flex justify-between items-center mb-6 mt-6">
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
        {currentProjects.map((project) => (
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
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {project.user.name || "Anonymous User"}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
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
      <Pagination className="mt-32">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {Array.from({
            length: Math.ceil(projects.length / projectsPerPage),
          }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(projects.length / projectsPerPage)
                  )
                )
              }
              className={
                currentPage === Math.ceil(projects.length / projectsPerPage)
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}