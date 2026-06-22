"use client";
import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import ProfileButton from "./ProfileButton";
import { FaGithub } from "react-icons/fa";

export default function SignIn() {
  const { data: session } = useSession();

  return (
    <div>
      {session?.user ? (
        <ProfileButton />
      ) : (
        <Button
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <span className="gap-2 hidden md:flex">
            <FaGithub size={22} /> Login with GitHub
          </span>
          <span className="flex gap-2 md:hidden">
            <FaGithub size={22} /> Login
          </span>
        </Button>
      )}
    </div>
  );
}
