"use client";
import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import SignInButton from "../Profile/SignInButton";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { status } = useSession();

  return (
    <div className="w-full h-[80px] border-b shadow-md">
      <div className="flex items-center justify-between h-full text-2xl px-20">
        <div>
          {status === "loading" ? (
            <Skeleton className="w-28 h-10 rounded-md" />
          ) : (
            <Link href={"/"}>
              <span className="font-">hix</span>
              <span className="font-bold">Code</span>
            </Link>
          )}
        </div>
        <div>
          {status === "loading" ? (
            <Skeleton className="h-11 w-11 rounded-full" />
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
