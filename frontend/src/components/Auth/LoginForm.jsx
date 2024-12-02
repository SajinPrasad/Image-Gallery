import React, { useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { userLoginService } from "../../services/userServices/userServices";
import { setToken } from "../../features/auth/authSlice";
import { setUser } from "../../features/auth/userSlice";

const LoginForm = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken) {
      navigate("/home");
    }
  }, [accessToken, navigate]);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial values for the form
  const initialValues = {
    email: "",
    password: "",
  };

  // Submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userLogined = await userLoginService(values);

      if (userLogined) {
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
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full pl-10 pr-3 py-2 border focus:outline-none focus:ring-2`}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full pl-10 pr-3 py-2 border focus:outline-none focus:ring-2`}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 hover:bg-blue-600 transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center mt-4">
                <a
                  onClick={() => navigate("/password-reset")}
                  className="text-blue-500 hover:underline cursor-pointer text-sm"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Create Account Link */}
              <div className="text-center">
                <a
                  onClick={() => navigate("/register")}
                  className="cursor-pointer text-blue-500 hover:underline text-sm"
                >
                  Sign Up
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
