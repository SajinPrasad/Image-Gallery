import { publicAxiosInstance } from "../../api/api";

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
