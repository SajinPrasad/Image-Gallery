import React, { useEffect } from "react";
import { Lock, Mail, Phone } from "lucide-react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { userRegistrationService } from "../../services/userServices/userServices";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RegistrationForm = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Please confirm your password"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  };

  // Submit handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const userRegistered = await userRegistrationService(values);
    if (userRegistered) {
      resetForm();
      navigate("/");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
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
                  className={`w-full pl-10 pr-3 py-2 border -lg focus:outline-none focus:ring-2`}
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
                  className={`w-full pl-10 pr-3 py-2 border -lg focus:outline-none focus:ring-2`}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`w-full pl-10 pr-3 py-2 border -lg focus:outline-none focus:ring-2`}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Phone Number Input */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Field
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className={`w-full pl-10 pr-3 py-2 border -lg focus:outline-none focus:ring-2`}
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 -lg hover:bg-blue-600 transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>

              {/* Login Link */}
              <div className="text-center mt-4">
                <a
                  onClick={() => navigate("/")}
                  className="cursor-pointer text-blue-500 hover:underline text-sm"
                >
                  Login
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegistrationForm;
