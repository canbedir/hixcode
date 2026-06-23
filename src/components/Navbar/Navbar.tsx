"use client";
import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';

const NavbarMenu = dynamic(() => import("./NavbarMenu"), { ssr: false });

const Navbar = () => {
  const { status } = useSession();

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-between h-18 text-2xl px-5 md:px-10">
        <div>
          {status === "loading" ? (
            <Skeleton className="w-28 h-10 rounded-md" />
          ) : (
            <Link
              href={"/"}
              className="font-bold tracking-tight transition-opacity hover:opacity-80"
            >
              <span>hix</span>
              <span className="text-primary">Code</span>
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
