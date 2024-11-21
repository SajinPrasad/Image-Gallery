import React from "react";
import { User } from "lucide-react";
import { useSelector } from "react-redux";

const Header = () => {
  const { username } = useSelector((state) => state.user);
  return (
    <header className="fixed top-0 w-full bg-white z-10">
      <div className="flex gap-3 items-center justify-end p-4 mr-5 px-4">
        <User className="cursor-pointer" size={24} color="gray" />
        <p className="text-md font-semibold text-gray-400 hover:text-gray-600">
          {username}
        </p>
        <p className="text-md font-semibold cursor-pointer ml-3 text-gray-400 hover:text-blue-800">
          Logout
        </p>
      </div>
    </header>
  );
};

export default Header;
