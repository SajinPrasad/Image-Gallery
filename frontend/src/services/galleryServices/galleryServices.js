import { toast } from "react-toastify";
import privateAxiosInstance from "../../api/api";

export const uploadImageService = async (images, titles) => {
  const formData = new FormData();

  images.forEach((image, index) => {
    formData.append("images", image);
    formData.append("titles", titles[index]);
  });

  try {
    const response = await privateAxiosInstance.post("/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status >= 200 && response.status < 301) {
      toast.success("Uploaded images.");
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response;
  
      if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (status === 400 && data) {
        const handleErrors = (errors) => {
          if (typeof errors === "string") {
            toast.error(errors);
          } else if (Array.isArray(errors)) {
            errors.forEach((err) => handleErrors(err));
          } else if (typeof errors === "object") {
            Object.entries(errors).forEach(([key, value]) => handleErrors(value));
          }
        };
  
        handleErrors(data);
      }
    } else {
      toast.error("An unexpected error occurred");
    }
  }
  
};

export const getImagesService = async () => {
  try {
    const response = await privateAxiosInstance.get("/list-images/");

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } else {
      toast.error("Unable to connect to the server.");
    }
  }
};

export const deleteImageService = async (imageId) => {
  try {
    const response = await privateAxiosInstance.delete(
      `/delete-image/${imageId}`
    );

    if (response.status === 204) {
      toast.success("Image deleted");
      return true;
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateImageService = async (formData, imageId) => {
  try {
    const response = await privateAxiosInstance.patch(
      `/update-image/${imageId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status >= 200 && response.status < 301) {
      toast.success("Updated image.");
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const orderUpdateService = async (formData) => {
  try {
    const response = await privateAxiosInstance.patch(
      `/order-change/`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status >= 200 && response.status < 301) {
      toast.success("Updated order.");
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};
