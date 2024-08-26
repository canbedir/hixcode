"use client";
import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import ProfileButton from "./ProfileButton";

export default function SignIn() {

  const { data: session } = useSession();

  return (
    <div>
      {session?.user ? (
        <ProfileButton/>
      ) : (
        <Button onClick={() => signIn()}>Sign in</Button>
      )}
    </div>
  );
}
