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

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (errors) {
    console.log(errors);
  }
};

export const userLoginService = async (formData) => {
  try {
    const response = await publicAxiosInstance.post("/login/", formData);

    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (errors) {
    console.log(errors);
  }
};

export const userLogoutService = async (refreshToken) => {
  try {
    const response = await privateAxiosInstance.post(`/logout/`, {
      refresh: refreshToken,
    });

    // No data is expected, but just in case the backend returns a success message
    if (response.status >= 200 && response.status < 301) {
      return response.data;
    }
  } catch (error) {
    console.log(error)
  }
};
