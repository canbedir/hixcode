"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FaRegDotCircle } from "react-icons/fa";
import { Star } from "lucide-react";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { Suspense } from "react";

interface SearchResult {
  id: string;
  title?: string;
  name?: string;
  username?: string;
  description?: string;
  stars?: number;
  mostPopularLanguage?: string;
  lastUpdated?: string;
  image?: string;
  type: "project" | "user";
  bio?: string;
  badges?: {
    name?: string;
    icon?: string;
  }[];
  user?: {
    name?: string;
    image?: string;
    username?: string;
    bio?: string;
    badges?: {
      name?: string;
      icon?: string;
    }[];
  };
}

const ResultCard = ({ result }: { result: SearchResult }) => (
  <Link
    href={
      result.type === "project"
        ? `/projects/${result.id}`
        : `/${result.username}`
    }
  >
    <Card>
      <CardContent
        className={`flex flex-col p-6 justify-between ${
          result.type === "user" ? "h-[150px]" : "h-[300px]"
        }`}
      >
        <div className="flex items-center mb-2">
          <div className="flex items-center w-full">
            {result.type === "project" ? (
              <>
                {result.user?.image && (
                  <Image
                    src={result.user.image}
                    alt={result.user.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                )}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">
                    {result.user?.username || result.user?.name || "Anonymous User"}
                  </span>
                  <div className="flex items-center gap-2 border rounded-md p-0.5">
                    {result.user?.badges?.map((badge) => (
                      <Image
                        key={badge.name}
                        alt={badge.name ?? ""}
                        src={badge.icon ?? ""}
                        width={16}
                        height={16}
                        className="text-muted-foreground"
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {result.image && (
                  <Image
                    src={result.image}
                    alt={result.username || result.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                )}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">
                    {result.username || result.name || "Anonymous User"}
                  </span>
                  <div className="flex items-center gap-2 border rounded-md p-0.5">
                    {result.badges?.map((badge) => (
                      <Image
                        key={badge.name}
                        alt={badge.name ?? ""}
                        src={badge.icon ?? ""}
                        width={16}
                        height={16}
                        className="text-muted-foreground"
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {result.type === "project" && (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{result.title}</h2>
              <div className="flex items-center gap-2 text-lg">
                <Star size={16} /> {result.stars}
              </div>
            </div>
          )}
          <p className="text-muted-foreground line-clamp-2">
            {result.type === "project"
              ? result.description
              : result.bio || "No bio available"}
          </p>
        </div>
        {result.type === "project" && (
          <div className="flex justify-between items-center text-sm text-muted-foreground mt-auto">
            <div className="flex items-center">
              {result.mostPopularLanguage && (
                <>
                  <FaRegDotCircle className="mr-1" />
                  <span className="text-sm">{result.mostPopularLanguage}</span>
                </>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Updated{" "}
              {result.lastUpdated &&
                new Date(result.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        )}
        <div></div>
      </CardContent>
    </Card>
  </Link>
);

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  );
}

function LoadingSpinner() {
  return (
    <div className="relative h-screen">
      <div
        className="flex justify-center items-center"
        style={{ height: "calc(100% - 160px)" }}
      >
        <ClipLoader color="#b5b5b5" size={100} />
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [projectResults, setProjectResults] = useState<SearchResult[]>([]);
  const [userResults, setUserResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState<"projects" | "users">("projects");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setLoading(true);
        const response = await fetch(`/api/search?q=${query}`);
        if (response.ok) {
          const data = await response.json();
          setProjectResults(
            data.filter((result: SearchResult) => result.type === "project")
          );
          setUserResults(
            data.filter((result: SearchResult) => result.type === "user")
          );
        }
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="relative h-screen">
        <div
          className="flex justify-center items-center"
          style={{ height: "calc(100% - 160px)" }}
        >
          <ClipLoader color="#b5b5b5" size={100} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 flex">Search Results: {query}</h1>
      <div className="flex mb-4 items-end justify-end">
        <button
          className={`mr-4 ${
            activeTab === "projects"
              ? "dark:text-white text-black font-medium"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          Projects ({projectResults.length})
        </button>
        <button
          className={
            activeTab === "users"
              ? "dark:text-white text-black font-medium"
              : "text-muted-foreground"
          }
          onClick={() => setActiveTab("users")}
        >
          Users ({userResults.length})
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === "projects"
          ? projectResults.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))
          : userResults.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
      </div>
    </div>
  );
}
