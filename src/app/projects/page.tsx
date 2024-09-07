"use client";

import React, { Suspense } from "react";
import ProjectsContent from "./ProjectsContent";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
