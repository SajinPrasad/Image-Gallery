import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { refreshToken } = useSelector((state) => state.auth);

  if (!refreshToken) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
