import React from "react";
import SignInButton from "../SignInButton";

const Navbar = () => {
  return (
    <div className="w-full h-[60px] fixed">
      <div className="flex items-center justify-between container h-full text-2xl">
        <div>
          <span className="font-semibold">hix</span>
          <span className="font-bold">Code</span>
        </div>
        <div>
          <SignInButton/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
