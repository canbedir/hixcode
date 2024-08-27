import React from "react";
import SignInButton from "../Profile/SignInButton";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full h-[80px] border-b shadow-md">
      <div className="flex items-center justify-between h-full text-2xl px-20">
        <div>
          <Link href={"/"}>
            <span className="font-">hix</span>
            <span className="font-bold">Code</span>
          </Link>
        </div>
        <div>
          <SignInButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
