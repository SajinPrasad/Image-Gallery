import { toast } from "react-toastify";
import privateAxiosInstance from "../../api/api";

export const uploadImageService = async (images, titles) => {
  console.log("Calling the service");
  console.log("Images: ", images);
  console.log("Titles: ", titles);
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
