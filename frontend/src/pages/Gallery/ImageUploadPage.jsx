import React from "react";
import ImageUpload from "../../components/Gallery/ImageUpload";
import Header from "../../components/Common/Header";

const ImageUploadPage = () => {
  return (
    <>
      <Header />
      <div className="pt-16">
        <ImageUpload />
      </div>
    </>
  );
};

export default ImageUploadPage;
