import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { passwordResetService } from "../../services/userServices/userServices";
import { useNavigate } from "react-router-dom";

const PasswordResetForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {
      email: "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.email) {
      tempErrors.email = "Email is required";
    }

    if (!formData.currentPassword) {
      tempErrors.currentPassword = "Current password is required";
    }

    if (!formData.password) {
      tempErrors.password = "New password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm new password";
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);

    const hasErrors = Object.values(tempErrors).some((error) => error !== "");

    console.log(hasErrors)

    if (!hasErrors) {
      const passwordReseted = await passwordResetService(formData);

      if (passwordReseted) {
        setFormData({
          email: "",
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8  shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Reset Password
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

          {/* Current Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border  focus:outline-none focus:ring-2 
                ${
                  errors.currentPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="New Password"
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

          {/* Confirm New Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border  focus:outline-none focus:ring-2 
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2  hover:bg-blue-600 transition duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetForm;
