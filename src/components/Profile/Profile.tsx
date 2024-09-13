"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Trophy, Rocket, Heart } from "lucide-react";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  }>;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

interface FormattedBadge {
  id: number; // string yerine number olarak değiştirildi
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

          // Format badges for AnimatedTooltip
          const formatted = userData.badges.map((badge) => ({
            id: parseInt(badge.id), // string id'yi number'a çevir
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
        id: parseInt(badge.id), // string id'yi number'a çevir
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
                              <AvatarFallback>{badge.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="text-sm font-semibold">{badge.name}</h4>
                              <p className="text-xs text-muted-foreground">{badge.designation}</p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                ) : ""}
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
              <div
                key={project.id}
                className="flex flex-col h-full shadow-md shadow-dark/50 dark:shadow-white/50 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                  {project.description}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    GitHub Repository
                  </a>
                  <Button
                    onClick={() => handleUpdateProject(project.id)}
                    size="sm"
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
