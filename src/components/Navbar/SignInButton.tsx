"use client";
import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import ProfileButton from "./ProfileButton";
import { Github } from "lucide-react";

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
            <Github size={22} /> Login with GitHub
          </span>
          <span className="flex gap-2 md:hidden">
            <Github size={22} /> Login
          </span>
        </Button>
      )}
    </div>
  );
}
