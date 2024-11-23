import React from "react";
import { User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { userLogoutService } from "../../services/userServices/userServices";
import { clearToken } from "../../features/auth/authSlice";
import { clearUser } from "../../features/auth/userSlice";

const Header = () => {
  const { username } = useSelector((state) => state.user);
  const { refreshToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const loggedOut = await userLogoutService(refreshToken);

    if (loggedOut) {
      dispatch(clearToken());
      dispatch(clearUser());
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white z-10">
      <div className="flex justify-between">
        <div className="flex gap-5 justify-around ml-10 items-center">
          <p className="text-lg text-green-800 font-bold">Image Gallery</p>
          <div className="flex gap-3 items-center cursor-pointer font-semibold justify-start p-4 ml-5 px-4">
            <p onClick={() => navigate("/home")} className="text-gray-600">
              Home
            </p>
            <p onClick={() => navigate("/upload")} className="text-gray-600">
              Upload
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center justify-end p-4 mr-5 px-4">
          <User className="cursor-pointer" size={24} color="gray" />
          <p className="text-md font-semibold text-gray-400 hover:text-gray-600">
            {username}
          </p>
          <p
            onClick={handleLogout}
            className="text-md font-semibold cursor-pointer ml-3 text-gray-400 hover:text-blue-800"
          >
            Logout
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
