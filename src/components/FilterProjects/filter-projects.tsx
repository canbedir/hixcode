"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

interface FilterProjectsProps {
  onFilter: (filters: {
    language: string;
    topic: string;
    minStars: number;
  }) => void;
  initialFilters: {
    language: string;
    topic: string;
    minStars: number;
  };
}

const FilterProjects: React.FC<FilterProjectsProps> = ({
  onFilter,
  initialFilters,
}) => {
  const [language, setLanguage] = useState(initialFilters.language || "all");
  const [topic, setTopic] = useState(initialFilters.topic || "all");
  const [minStars, setMinStars] = useState(initialFilters.minStars || 0);

  const handleApply = () => {
    onFilter({ language, topic, minStars });
  };

  const handleReset = () => {
    setLanguage("all");
    setTopic("all");
    setMinStars(0);
    onFilter({ language: "all", topic: "all", minStars: 0 });
  };

  return (
    <div className="w-full mb-6">
      <h1 className="text-2xl font-semibold mb-4">Filter Projects</h1>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <Label>Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <Label>Topic</Label>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="angular">Angular</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
              <SelectItem value="nodejs">Node.js</SelectItem>
              <SelectItem value="express">Express</SelectItem>
              <SelectItem value="nextjs">Next.js</SelectItem>
              <SelectItem value="django">Django</SelectItem>
              <SelectItem value="flask">Flask</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[200px] flex flex-col justify-end">
          <Label className="mb-2">Min Stars: {minStars}</Label>
          <Slider
            value={[minStars]}
            onValueChange={(value) => setMinStars(value[0])}
            max={1000}
            step={50}
            className="mb-2"
          />
        </div>
        <div className="flex-1 min-w-[200px] flex flex-col justify-end">
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterProjects;
