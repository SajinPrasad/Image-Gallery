import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { userLoginService } from "../../services/userServices/userServices";
import { setToken } from "../../features/auth/authSlice";
import { setUser } from "../../features/auth/userSlice";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  function validateEmail(email) {
    // Regular expression for validating an email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Test the email with the regex
    if (emailRegex.test(email)) {
      return true; // Email is valid
    } else {
      return false; // Email is invalid
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = { email: "", password: "" };

    if (!formData.email) {
      tempErrors.email = "Email is required";
    }

    if (!validateEmail(formData.email)) {
      tempErrors.email = "Enter valid email";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    }

    setErrors(tempErrors);

    const hasErrors = Object.values(tempErrors).some((error) => error !== "");

    if (!hasErrors) {
      // Login logic
      const userLogined = await userLoginService(formData);

      if (userLogined) {
        setFormData({
          email: "",
          password: "",
        });

        dispatch(
          setToken({
            accessToken: userLogined.access,
            refreshToken: userLogined.refresh,
          })
        );

        dispatch(
          setUser({
            email: userLogined.email,
            username: userLogined.username,
          })
        );

        navigate("/home");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8  shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border  focus:outline-none focus:ring-2 
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border  focus:outline-none focus:ring-2 
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2  hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <a href="#" className="text-blue-500 hover:underline text-sm">
              Forgot Password?
            </a>
          </div>

          {/* Create account link */}
          <div className="text-center ">
            <a
              onClick={() => navigate("/register")}
              className="cursor-pointer text-blue-500 hover:underline text-sm"
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
