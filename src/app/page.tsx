import FilterProjects from "@/components/FilterProjects/filter-projects";
import PopularProjects from "@/components/PopularProjects/popular-projects";
import RecentProjects from "@/components/RecentProjects/recent-projects";

export default function Home() {
  return (
    <div className="mt-10">
      <div className="flex flex-col gap-8 w-full">
        <PopularProjects />
        <RecentProjects />
      </div>
    </div>
  );
}
