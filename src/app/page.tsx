import FilterProjects from "@/components/FilterProjects/filter-projects";
import PopularProjects from "@/components/PopularProjects/popular-projects";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-10">
      <div className="flex items-center gap-20">
        <FilterProjects />
        <PopularProjects />
      </div>
    </div>
  );
}
