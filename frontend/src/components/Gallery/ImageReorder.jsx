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

    const reorderedData = images.reduce((result, image, index) => {
      const newOrder = index + 1;
      if (image.order !== newOrder) {
        result.push({ id: image.id, order: newOrder });
      }
      return result;
    }, []);

    const orderUpdated = await orderUpdateService({ orders: reorderedData });

    if (orderUpdated) {
      setIsReordered(false);
      navigate("/home");
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
          className="bg-blue-500 py-2 mx-5 rounded text-xl text-white px-4 my-2 font-semibold"
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
              className="grid grid-cols-3 gap-4 p-4"
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
                      className="bg-white border border-gray-300 rounded p-2 shadow-md"
                    >
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-40 object-cover rounded"
                      />
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
