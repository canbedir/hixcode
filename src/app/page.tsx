import Hero from "@/components/Hero/hero";
import PopularProjects from "@/components/PopularProjects/popular-projects";
import RecentProjects from "@/components/RecentProjects/recent-projects";

export default function Home() {
  return (
    <div className="mt-10 pb-10">
      <div className="flex flex-col gap-8 w-full">
        <Hero />
        <PopularProjects />
        <RecentProjects />
      </div>
    </div>
  );
}
