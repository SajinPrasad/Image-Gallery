import React, { useState } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { useLocation, useNavigate } from "react-router-dom";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { orderUpdateService } from "../../services/galleryServices/galleryServices";

const ImageReorder = () => {
  const location = useLocation();
  const { images: initialImages = [] } = location.state || {};
  const [images, setImages] = useState(initialImages);
  const [isReordered, setIsReordered] = useState(false);
  const navigate = useNavigate();

  console.log("PRevious images: ", images);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    // Reorder the list
    const reorderedImages = Array.from(images);
    const [movedItem] = reorderedImages.splice(source.index, 1);
    reorderedImages.splice(destination.index, 0, movedItem);

    setIsReordered(true);
    setImages(reorderedImages);
  };

  const handleSubmit = async () => {
    const updatedImages = images.filter((image, index) => {
      const originalImage = initialImages.find((img) => img.id === image.id);
      return originalImage && originalImage.order !== index + 1; // Compare old and new order
    });
  
    const formattedData = updatedImages.map((image, index) => ({
      id: image.id,
      order: index + 1, // New order position
    }));
  
    try {
      const orderUpdated = await orderUpdateService({ metadata: formattedData }); // Send JSON data
  
      if (orderUpdated) {
        navigate("/home");
      }
    } catch (error) {
      console.error(
        "Error updating order:",
        error.response?.data || error.message
      );
    }
  };
  

  return (
    <div className="pt-16">
      <p className="text-center text-blue-950 font-bold text-xl mb-6">
        Drag and drop to reorder images
      </p>

      {isReordered && (
        <button
          onClick={handleSubmit}
          className="bg-blue-700 py-1 rounded text-white px-3 my-2 font-semibold"
        >
          Submit
        </button>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId="imageList">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4"
            >
              {images.map((image, index) => (
                <Draggable
                  key={image.id}
                  draggableId={image.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative bg-white border border-gray-300 rounded p-2 shadow-md group"
                    >
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-40 object-cover rounded"
                      />
                      <div className="absolute top-2 left-2 bg-gray-700 text-white text-sm rounded px-2 py-1">
                        Drag
                      </div>
                      <p className="mt-2 text-center text-sm font-medium text-gray-800">
                        {image.title}
                      </p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </div>
  );
};

export default ImageReorder;
