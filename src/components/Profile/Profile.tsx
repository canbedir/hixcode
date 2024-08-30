import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Profile = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || undefined },
    include: { projects: true },
  });

  return (
    <div className="m-10">
      <div className="flex">
        <div className="flex flex-col gap-5">
          <div>
            <Image
              src={user?.image || ""}
              alt="profile"
              width={350}
              height={100}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold">{user?.name}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <div>
            <p>{user?.bio}</p>
          </div>
          <div>
            <Link href="/settings">
              <Button className="w-full">Edit Profile</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-5 items-center w-full">
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl font-bold">Projects</h1>
              {user?.projects.map((project) => (
                <div key={project.id}>{project.title}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;
