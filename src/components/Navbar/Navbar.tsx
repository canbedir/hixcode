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
    <div className="w-full h-[80px] dark:shadow-black shadow-md">
      <div className="flex items-center justify-between h-full text-2xl px-5 md:px-10">
        <div>
          {status === "loading" ? (
            <Skeleton className="w-28 h-10 rounded-md" />
          ) : (
            <Link href={"/"} className="font-semibold">
              <span>hix</span>
              <span>Code</span>
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
