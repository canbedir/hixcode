import React, { useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center">
            <Input
              className="pr-10"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Search className="text-gray-400" />
            </button>
          </div>
        </form>
      </div>

      <div className="md:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-2 hover:bg-gray-700 rounded-full">
              <Search className="text-gray-400" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center">
                <Input
                  className="pr-10"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="text-gray-400" />
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default SearchComponent;
