"use client";

import React, { Suspense } from "react";
import ProjectsContent from "./ProjectsContent";
import { ClipLoader } from "react-spinners";

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="relative h-screen">
          <div
            className="flex justify-center items-center"
            style={{ height: "calc(100% - 160px)" }}
          >
            <ClipLoader color="#b5b5b5" size={100} />
          </div>
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
