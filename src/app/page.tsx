import FilterProjects from "@/components/FilterProjects/filter-projects";
import PopularProjects from "@/components/PopularProjects/popular-projects";
import ProjectUpdater from "@/components/ProjectUpdater";
import RecentProjects from "@/components/RecentProjects/recent-projects";

export default function Home() {
  return (
    <div className="mt-10">
      <ProjectUpdater />
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
