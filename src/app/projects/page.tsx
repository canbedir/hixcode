"use client";

import React, { Suspense } from "react";
import ProjectsContent from "./ProjectsContent";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectGridSkeleton } from "@/components/skeletons/ProjectCardSkeleton";

function ProjectsFallback() {
  return (
    <div className="mt-10 py-4">
      <div className="mb-6 border-b pb-4">
        <Skeleton className="h-10 w-full max-w-md" />
      </div>
      <div className="flex justify-between items-center mb-6 mt-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-40" />
      </div>
      <ProjectGridSkeleton count={9} />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsFallback />}>
      <ProjectsContent />
    </Suspense>
  );
}
