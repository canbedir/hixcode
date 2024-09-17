import Hero from "@/components/Hero/hero";
import PopularProjects from "@/components/PopularProjects/popular-projects";
import RecentProjects from "@/components/RecentProjects/recent-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function LoadingSkeleton() {
  return (
    <div className="mt-10 pb-10">
      <div className="flex flex-col gap-8 w-full">
        <Skeleton className="w-full h-[400px] rounded-xl" />
        <Skeleton className="w-full h-[300px] rounded-xl" />
        <Skeleton className="w-full h-[300px] rounded-xl" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="mt-10 pb-10">
        <div className="flex flex-col gap-8 w-full">
          <Hero />
          <PopularProjects />
          <RecentProjects />
        </div>
      </div>
    </Suspense>
  );
}
