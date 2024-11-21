import React, { useState } from "react";
import { Lock, Mail, Phone } from "lucide-react";

import { userRegistrationService } from "../../services/userServices/userServices";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
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
    let tempErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    };

    // Email validation
    if (!formData.email) {
      tempErrors.email = "Email is required";
    }

    if (!validateEmail(formData.email)) {
      tempErrors.email = "Enter valid email";
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    // Phone Number validation
    if (!formData.phoneNumber) {
      tempErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      tempErrors.phoneNumber = "Phone number must be 10 digits";
    }

    // Set errors
    setErrors(tempErrors);

    // Check if any errors exist
    const hasErrors = Object.values(tempErrors).some((error) => error !== "");

    if (!hasErrors) {
      const userRegistered = await userRegistrationService(formData);
      console.log("User registered: ", userRegistered);
      if (userRegistered) {
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
        });
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8  shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
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
              className={`w-full pl-10 pr-3 py-2 border -lg focus:outline-none focus:ring-2 
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
              className={`w-full pl-10 pr-3 py-2 border -lg focus:outline-none focus:ring-2 
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

          {/* Confirm Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border -lg focus:outline-none focus:ring-2 
                ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border -lg focus:outline-none focus:ring-2 
                ${
                  errors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 -lg hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>

          {/* Login page */}
          <div className="text-center mt-4">
            <a
              onClick={() => navigate("/")}
              className="cursor-pointer text-blue-500 hover:underline text-sm"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
