import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Trash, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { uploadImageService } from "../../services/galleryServices/galleryServices";

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [titles, setTitles] = useState([]); // Initialize titles as an empty array
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const onDrop = useCallback(
    (acceptedFiles) => {
      setSelectedImages([...selectedImages, ...acceptedFiles]);
      setTitles([...titles, ...Array(acceptedFiles.length).fill("")]); // Add corresponding empty titles
    },
    [selectedImages, titles]
  );

  const handleRemoveImage = (image, index) => {
    const filteredImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(filteredImages);

    const filteredTitles = titles.filter((_, i) => i !== index); // Remove the corresponding title
    setTitles(filteredTitles);
  };

  const handleEdit = (index) => {
    setEditingImageIndex(index);
    if (inputRef.current) {
      inputRef.current.click(); // Trigger the input click
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the new file
    if (file !== null && editingImageIndex !== null) {
      const updatedImages = [...selectedImages];
      updatedImages[editingImageIndex] = file; // Replace the image at the selected index
      setSelectedImages(updatedImages);
      setEditingImageIndex(null); // Reset editing index
    }
  };

  const handleTitleChange = (e, index) => {
    const updatedTitles = [...titles];
    updatedTitles[index] = e.target.value; // Update the title for the given index
    setTitles(updatedTitles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleSubmit = async () => {
    const imagesUploaded = await uploadImageService(selectedImages, titles);

    if (imagesUploaded) {
      navigate("/home");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h3 className="text-center text-lg text-gray-800 font-semibold mb-4">
        Upload the images here.
      </h3>
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-300 p-4 rounded cursor-pointer text-center"
      >
        <input {...getInputProps()} accept="image/*" multiple />
        <p className="text-gray-500">
          Drag and drop images here, or click to select files
        </p>
      </div>
      {selectedImages.length > 0 && (
        <div className="mt-4 w-4/6 mx-auto">
          <h4 className="text-lg text-center font-semibold mb-2">
            Selected Files
          </h4>
          {selectedImages.length > 0 && (
            <div className="text-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white text-lg font-semibold py-1 rounded m-3 px-3"
              >
                Submit
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedImages.map((file, index) => (
              <div
                key={index} // Use index as key (for simplicity)
                className="flex flex-col p-2 border border-gray-300 rounded"
              >
                <div className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Image ${index + 1}`}
                    className="w-52 h-52 rounded object-cover"
                  />
                </div>
                <div className="flex justify-center items-center space-x-4 mt-2">
                  <Trash
                    onClick={() => handleRemoveImage(file, index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer w-5 h-5"
                  />
                  <Edit
                    className="text-blue-500 hover:text-blue-700 cursor-pointer w-5 h-5"
                    onClick={() => handleEdit(index)}
                  />
                </div>
                <input
                  type="text"
                  className="w-full text-center font-semibold text-gray-800 border border-gray-400 rounded mt-2 p-1 focus:outline-none focus:border-gray-500"
                  placeholder="Title..."
                  value={titles[index]} // Bind the input to the title
                  onChange={(e) => handleTitleChange(e, index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Hidden input element outside the map loop */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUpload;
