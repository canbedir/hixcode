import React from "react";
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
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";

const FilterProjects = () => {
  return (
    <div className="h-[300px] w-[300px]">
      <h1 className="text-2xl font-semibold">Filter Projects</h1>
      <div className="flex flex-col rounded-lg gap-3 mt-5 border p-5">
        <div className="flex flex-row gap-3 justify-center">
          <div className="flex items-start flex-col gap-3">
            <Select defaultValue="all">
              <Label>Language</Label>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-start flex-col gap-3">
            <Select defaultValue="all">
              <Label>Topic</Label>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex flex-col w-full gap-3">
            <Label>Min Stars</Label>
            <Slider defaultValue={[0]} max={5} />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex flex-row w-full gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md p-2 w-full">
              Apply
            </Button>
            <Button className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md p-2 w-full">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterProjects;
