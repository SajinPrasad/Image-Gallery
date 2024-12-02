import React from "react";
import { Mail, Lock } from "lucide-react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { passwordResetService } from "../../services/userServices/userServices";
import { useNavigate } from "react-router-dom";

const PasswordResetForm = () => {
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    currentPassword: Yup.string().required("Current password is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Please confirm new password"),
  });

  // Initial values for the form
  const initialValues = {
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  };

  // Submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const passwordReseted = await passwordResetService(values);
      if (passwordReseted) {
        navigate("/");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>
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
                  className="w-full pl-10 pr-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Current Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Field
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  className="w-full pl-10 pr-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="currentPassword"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* New Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Field
                  type="password"
                  name="password"
                  placeholder="New Password"
                  className="w-full pl-10 pr-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Confirm New Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  className="w-full pl-10 pr-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="confirmPassword"
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
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PasswordResetForm;
