"use client";
import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import NavbarMenu from "./NavbarMenu";

const Navbar = () => {
  const { status } = useSession();

  return (
    <div className="w-full h-[80px] border-b shadow-md">
      <div className="flex items-center justify-between h-full text-2xl px-5 md:px-10">
        <div>
          {status === "loading" ? (
            <Skeleton className="w-28 h-10 rounded-md" />
          ) : (
            <Link href={"/"}>
              <span>hix</span>
              <span className="font-semibold">Code</span>
            </Link>
          )}
        </div>
        <div>
          {status === "loading" ? (
            <Skeleton className="h-11 w-11 rounded-full" />
          ) : (
            <NavbarMenu />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
