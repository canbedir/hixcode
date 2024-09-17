"use client";
import React, { useState, useEffect } from "react";
import { ThemeAwareWavyBackground } from "../ui/wavy-background";
import { Button } from "../ui/button";
import Link from "next/link";
import { TbUpload } from "react-icons/tb";
import UploadProjectsModal from "../UploadProjectsModal";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

const Hero = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: session } = useSession();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <ThemeAwareWavyBackground className="w-full py-20 md:py-32 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4 relative z-10">
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6`}>
          Showcase Your GitHub Projects
        </h1>
        <p
          className={`text-lg md:text-xl font-medium mb-8 text-muted-foreground`}
        >
          Discover amazing projects, connect with developers, and get inspired.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/projects?sort=stars">
            <Button size="lg">Browse Projects</Button>
          </Link>
          {session && (
            <Button
              size="lg"
              variant={"outline"}
              onClick={() => setIsUploadModalOpen(true)}
            >
              <TbUpload className="mr-2 h-5 w-5" />
              Upload Project
            </Button>
          )}
        </div>
      </div>
      <UploadProjectsModal
        isOpen={isUploadModalOpen}
        setIsOpen={setIsUploadModalOpen}
      />
    </ThemeAwareWavyBackground>
  );
};

export default Hero;
