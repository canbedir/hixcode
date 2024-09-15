import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Contributor {
  id: string;
  name: string;
  githubUrl: string;
  image: string;
}

interface ContributorsProps {
  contributors: Contributor[];
}

const Contributors: React.FC<ContributorsProps> = ({ contributors }) => {
  if (!contributors || contributors.length === 0) {
    return (
      <div className="w-1/3 p-6 border rounded-xl">
        <h2 className="text-2xl font-semibold">Contributors</h2>
        <p>No contributors found for this project.</p>
      </div>
    );
  }

  return (
    <div className="w-1/3 border rounded-xl">
      <h2 className="text-2xl px-10 pt-10 pb-4 font-semibold mb-6">
        Contributors
      </h2>
      <div className="grid grid-cols-2 max-h-[300px] overflow-y-auto">
        {contributors.map((contributor) => (
          <div key={contributor.id} className="flex mx-auto items-center gap-3">
            <Image
              src={contributor.image || "/default-avatar.png"}
              alt={contributor.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <Link
                href={contributor.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="font-medium hover:underline">
                  {contributor.name}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contributors;
