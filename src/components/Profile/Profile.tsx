"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
}

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const userData: UserData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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
              <h1 className="text-2xl font-semibold">
                {user.name || "Anonymous"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {user.email || "No email provided"}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                {user.bio || ""}
              </p>
              <Link href="/settings" className="mt-6 w-full">
                <Button className="w-full">Edit Profile</Button>
              </Link>
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
