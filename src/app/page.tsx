import FilterProjects from "@/components/FilterProjects/filter-projects";
import PopularProjects from "@/components/PopularProjects/popular-projects";
import RecentProjects from "@/components/RecentProjects/recent-projects";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-10">
      <div className="flex items-start gap-20">
        <FilterProjects />
        <div className="flex flex-col gap-8 w-5/6">
          <PopularProjects />
          <RecentProjects />
        </div>
      </div>
    </div>
  );
}
