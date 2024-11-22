import { toast } from "react-toastify";
import privateAxiosInstance, { publicAxiosInstance } from "../../api/api";

export const userRegistrationService = async (formData) => {
  const { email, password, confirmPassword, phoneNumber } = formData;

  try {
    const response = await publicAxiosInstance.post("/register/", {
      email,
      password,
      password2: confirmPassword,
      phone_number: phoneNumber,
    });

    if (response.status >= 200 && response.status < 300) {
      toast.success("Registration successful!");
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code outside 2xx
      if (error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.response.status === 400) {
        // Validation errors or bad request
        const { data } = error.response;

        if (data) {
          // Toast error messages, ensuring robust parsing
          Object.values(data).forEach((messages) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => toast.error(msg)); // Handle array of errors
            } else if (typeof messages === "string") {
              toast.error(messages); // Handle single string error
            }
          });
        }
      }
    } else {
      toast.error("An unexpected error occurred");
    }
  }
};

export const userLoginService = async (formData) => {
  try {
    const response = await publicAxiosInstance.post("/login/", formData);

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error(
          "Invalid credentials. Please check your email or password."
        );
      } else if (error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } else {
      toast.error("Unable to connect to the server.");
    }
  }
};

export const userLogoutService = async (refreshToken) => {
  try {
    const response = await privateAxiosInstance.post(`/logout/`, {
      refresh: refreshToken,
    });

    if (response.status >= 200 && response.status < 301) {
      toast.success("Logout successful!");
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        toast.error("Invalid token. Unable to log out.");
      } else if (error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } else {
      toast.error("Unable to connect to the server.");
    }
  }
};

export const passwordResetService = async (formData) => {
  const { email, currentPassword, password, confirmPassword } = formData;

  try {
    const response = await privateAxiosInstance.put("/reset-password/", {
      email,
      current_password: currentPassword,
      confirm_password: confirmPassword,
      password,
    });

    if (response.status >= 200 && response.status < 301) {
      toast.success("Password reset successful!");
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      const { data } = error.response;
      if (data) {
        // Handle validation errors
        Object.values(data).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(msg));
          } else if (typeof messages === "string") {
            toast.error(messages);
          }
        });
      } else if (error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } else {
      toast.error("Unable to connect to the server.");
    }
  }
};
