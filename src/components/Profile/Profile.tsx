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

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    githubUrl: string;
    stars: number;
    mostPopularLanguage: string;
    technicalDetails: string;
  }>;
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for username:", username);
        const response = await fetch(`/api/user/${username}`);
        if (response.ok) {
          const userData: UserData = await response.json();
          console.log("Fetched user data:", userData);
          console.log("User badges:", userData.badges);
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
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [username]);

  useEffect(() => {
    if (user && user.badges) {
      const formatted = user.badges.map((badge) => ({
        id: parseInt(badge.id),
        name: badge.name,
        designation: badge.description,
        image: badge.icon.startsWith("/")
          ? badge.icon
          : `/${badge.name.toLowerCase().replace(" ", "-")}.svg`,
      }));
      setFormattedBadges(formatted);
    }
  }, [user]);

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

  if (!user) {
    return <div>Loading...</div>;
  }

  const isOwnProfile = session?.user?.email === user.email;

  return (
    <div className="container mt-10 p-4">
      <div className="flex flex-col justify-between md:flex-row space-y-8 md:space-y-0 md:space-x-32">
        <div className="md:w-1/5">
          <div className="">
            <div className="flex flex-col">
              <div className="flex items-center justify-center">
                <Image
                  src={user.image || "/default-profile-image.jpg"}
                  alt="profile"
                  width={300}
                  height={300}
                  className="rounded-full mb-4 hover:scale-105 transition-all duration-300"
                />
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">
                  {user.name || "Anonymous"}
                </h1>
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
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {user.email || "No email provided"}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                {user.bio || ""}
              </p>
              {isOwnProfile && (
                <Link href="/settings" className="mt-6 w-full">
                  <Button className="w-full">Edit Profile</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
