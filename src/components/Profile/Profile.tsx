"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProjectCard from "./ProjectCard";
import { useToast } from "../ui/use-toast";
import { ClipLoader } from "react-spinners";
import { Project } from "@prisma/client";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  image: string | null;
  bio: string | null;
  projects: Project[];
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

interface FormattedBadge {
  id: number;
  name: string;
  designation: string;
  image: string;
}

const Profile = ({ username }: { username: string }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const { data: session } = useSession();
  const [formattedBadges, setFormattedBadges] = useState<FormattedBadge[]>([]);
  const { toast } = useToast();
  const [pinnedProjects, setPinnedProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for username:", username);
        const response = await fetch(`/api/user/${username}`);
        if (response.ok) {
          const userData: UserData = await response.json();
          console.log("Fetched user data:", userData);
          setUser(userData);

          const formatted = userData.badges.map((badge) => ({
            id: parseInt(badge.id),
            name: badge.name,
            designation: badge.description,
            image: badge.icon.startsWith("/")
              ? badge.icon
              : `/badges/${badge.name.toLowerCase().replace(" ", "-")}.svg`,
          }));
          setFormattedBadges(formatted);

          const pinned = userData.projects.filter(
            (project) => project.isPinned
          );
          setPinnedProjects(pinned);

          setDisplayedProjects(
            showAllProjects
              ? userData.projects
              : pinned.length > 0
              ? pinned.slice(0, 4)
              : userData.projects.slice(-4).reverse()
          );
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [username, showAllProjects]);

  useEffect(() => {
    if (user) {
      setDisplayedProjects(
        showAllProjects
          ? user.projects
          : pinnedProjects.length > 0
          ? pinnedProjects.slice(0, 4)
          : user.projects.slice(-4).reverse()
      );
    }
  }, [showAllProjects, user, pinnedProjects]);

  const handleUpdateProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/update-project/${projectId}`, {
        method: "POST",
      });
      if (response.ok) {
        router.refresh();
      } else {
        console.error("An error occurred while updating the project");
      }
    } catch (error) {
      console.error("An error occurred while updating the project:", error);
    }
  };

  const handleUpdateAllProjects = async () => {
    try {
      const response = await fetch("/api/update-all-projects", {
        method: "POST",
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "All projects have been updated.",
          variant: "default",
        });
        router.refresh();
      } else {
        throw new Error("An error occurred while updating projects");
      }
    } catch (error) {
      console.error("An error occurred while updating projects:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating projects.",
        variant: "destructive",
      });
    }
  };

  const handlePinProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/pin`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();

        setUser((prevUser) => {
          if (!prevUser) return null;
          const updatedProjects = prevUser.projects.map((project) =>
            project.id === projectId
              ? { ...project, isPinned: data.isPinned }
              : project
          );
          const newUser = { ...prevUser, projects: updatedProjects };

          const newPinnedProjects = newUser.projects.filter(
            (project) => project.isPinned
          );
          setPinnedProjects(newPinnedProjects);

          setDisplayedProjects((prev) => {
            if (showAllProjects) {
              return updatedProjects;
            } else {
              return newPinnedProjects.length > 0
                ? newPinnedProjects.slice(0, 4)
                : updatedProjects.slice(-4).reverse();
            }
          });

          return newUser;
        });

        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });
      } else {
        throw new Error("Failed to pin/unpin project");
      }
    } catch (error) {
      console.error("Error pinning/unpinning project:", error);
      toast({
        title: "Error",
        description: "Failed to pin/unpin project. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
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

  const isOwnProfile = session?.user?.email === user.email;

  return (
    <div className="container mt-10 p-4">
      <div
        className={`flex flex-col lg:flex-row justify-between space-y-8 lg:space-y-0 lg:space-x-8 xl:space-x-32`}
      >
        <div className="w-full lg:w-1/3 xl:w-1/4">
          <div>
            <div className="flex flex-col items-center lg:items-start">
              <Image
                src={user.image || "/default-profile-image.jpg"}
                alt="profile"
                width={256}
                height={256}
                className="rounded-full mb-4 hover:scale-105 transition-all duration-300"
              />
              <div className="flex items-center gap-3">
                <div className="flex flex-row items-center gap-1">
                  <h1 className="text-2xl font-semibold text-center lg:text-left">
                    {user.name || "Anonymous"}
                  </h1>
                  <h1 className="font-semibold text-muted-foreground">
                    @{user.username || "Anonymous"}
                  </h1>
                </div>
                {formattedBadges ? (
                  <div className="flex items-center gap-2 max-w-full h-6 p-1 rounded-sm border">
                    {formattedBadges.map((badge) => (
                      <HoverCard key={badge.id}>
                        <HoverCardTrigger asChild>
                          <div className="relative cursor-pointer">
                            <Image
                              src={badge.image}
                              alt={badge.name}
                              width={20}
                              height={24}
                            />
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64" side="top">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={badge.image} />
                              <AvatarFallback>
                                {badge.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="text-sm font-semibold">
                                {badge.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {badge.designation}
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-4 text-center lg:text-left">
                {user.bio || ""}
              </p>
              {isOwnProfile && (
                <Link href="/settings" className="mt-6 w-1/2 lg:w-full">
                  <Button className="w-full">Edit Profile</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
            <h2
              className="text-3xl font-bold cursor-pointer mb-4 lg:mb-0"
              onClick={() => setShowAllProjects(!showAllProjects)}
            >
              Projects
              <span className="text-sm text-gray-500 ml-2">
                ({showAllProjects ? user.projects.length : displayedProjects.length}/{user.projects.length})
              </span>
            </h2>
            {isOwnProfile && (
              <Button onClick={handleUpdateAllProjects} className="w-1/2 lg:w-auto">
                Update All Projects
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPin={handlePinProject}
                isPinDisabled={pinnedProjects.length >= 4}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;