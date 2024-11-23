import React, { useEffect, useRef, useState } from "react";
import { Edit, X } from "lucide-react";

const ImagePreview = ({
  image,
  setIsOpen,
  isEditing,
  setIsEditing,
  handleEdit,
}) => {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null); // Separate ref for file input
  const [editedTitle, setEditedTitle] = useState(image.title);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClose = () => {
    setIsOpen(false);
    setIsEditing(false);
  };

  const handleImageEdit = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formData = new FormData();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(URL.createObjectURL(file));
      formData.append("image", file);
      handleEdit(formData, image.id);
      setIsOpen(false);
      setIsEditing(false);
    }
  };

  const handleSubmit = () => {
    if (image.title !== editedTitle) {
      formData.append("title", editedTitle);
      handleEdit(formData, image.id);
      setIsOpen(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-[95%] h-[86%] p-4 flex flex-col justify-between">
        {/* Title */}
        {isEditing ? (
          <div className="flex justify-center items-center gap-3">
            <input
              onChange={(e) => setEditedTitle(e.target.value)}
              ref={inputRef}
              value={editedTitle}
              className="mt-2 text-center text-xl rounded-md border-2 border-gray-500 font-semibold text-gray-800"
            />
            {image.title !== editedTitle && (
              <p
                onClick={handleSubmit}
                className="text-sm font-semibold cursor-pointer text-blue-800"
              >
                Save
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-center text-xl font-semibold text-gray-800">
            {image.title}
          </p>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute mr-3 mt-3 hover:text-gray-800 top-3 right-3 text-gray-600 rounded-full p-2 font-semibold"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Edit Icon */}
        {isEditing && (
          <div className="absolute top-3 left-3 bg-gray-800 p-2 rounded-full">
            <Edit
              onClick={handleImageEdit} // Changed from onCanPlay to onClick
              className="text-white w-5 h-5 cursor-pointer"
              title="Edit"
            />
          </div>
        )}

        {/* Image */}
        <img
          src={newImage || image.image} // Show new image if available
          alt={image.title}
          className="w-full h-[90%] object-contain rounded-lg"
        />

        {/* Submit Button */}
        {/* {isEditing && (
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md self-end"
          >
            Submit
          </button>
        )} */}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef} // Use fileInputRef instead of imageRef
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImagePreview;
