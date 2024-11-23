import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../Common/Header";
import {
  deleteImageService,
  getImagesService,
  updateImageService,
} from "../../services/galleryServices/galleryServices";
import ImagePreview from "./ImagePreview";

const Home = () => {
  const [images, setImages] = useState([]);
  const [isOpenPreview, setIsOpenPrevew] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/reorder", { state: { images } });
  };

  async function fetchImages() {
    const fetchedImages = await getImagesService();

    if (fetchedImages) {
      setImages(fetchedImages);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  const handlePreview = (image) => {
    setPreviewImage(image);
    setIsOpenPrevew(true);
  };

  const handleDeleteImage = async (imageId) => {
    const deleted = await deleteImageService(imageId);

    if (deleted) {
      const filteredImages = images.filter((image) => image.id != imageId);
      setImages(filteredImages);
    }
  };

  const handleEditPreviewOpen = (image) => {
    setPreviewImage(image);
    setIsImageEditing(true);
    setIsOpenPrevew(true);
  };

  const handleEdit = async (formData, imageId) => {
    try {
      // Call the service to update the image
      const imageUpdated = await updateImageService(formData, imageId);

      if (imageUpdated) {
        // Update the image in the `images` array
        const updatedImages = images.map((image) =>
          image.id === imageId ? { ...image, ...imageUpdated } : image
        );

        // Update the state with the new array of images
        setImages(updatedImages);
      }
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  return (
    <>
      <Header />
      {isOpenPreview && (
        <ImagePreview
          image={previewImage}
          setIsOpen={setIsOpenPrevew}
          isEditing={isImageEditing}
          setIsEditing={setIsImageEditing}
          handleEdit={handleEdit}
        />
      )}
      <div className="pt-16">
        <p className="text-center text-blue-950 font-bold text-xl mb-6">
          This is Home
        </p>
        <p
          onClick={handleNavigate}
          className="cursor-pointer my-3 mx-4 px-3 border inline-block rounded border-gray-200 text-start text-gray-700 font-semibold"
        >
          Click to reorder images
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative bg-white border border-gray-300 rounded p-2 shadow-md group"
            >
              {/* Image */}
              <img
                src={image.image}
                alt={image.title}
                className="w-full h-40 object-cover rounded"
              />
              {/* Icons Overlay */}
              <div className="absolute inset-0 bg-gray-800 bg-opacity-60 rounded flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Eye
                  className="text-white w-6 h-6 cursor-pointer"
                  onClick={() => handlePreview(image)}
                  title="Preview"
                />
                <Edit
                  className="text-white w-6 h-6 cursor-pointer"
                  onClick={() => handleEditPreviewOpen(image)}
                  title="Edit"
                />
                <Trash2
                  className="text-white w-6 h-6 cursor-pointer"
                  onClick={() => handleDeleteImage(image.id)}
                  title="Delete"
                />
              </div>

              {/* Image Title */}
              <p className="mt-2 text-center text-sm font-medium text-gray-800">
                {image.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
