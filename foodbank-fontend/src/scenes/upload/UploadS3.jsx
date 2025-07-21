import { Button, Input } from "@mui/material";
import React from "react";
import { useState } from "react";
import { uploadImageS3 } from "../../api/ManageTeam";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import axios from "axios";

const UploadS3 = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const token = useFoodBankStorage((state) => state.token);
  const user = useFoodBankStorage((state) => state.user);

  const typeToExtension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };

  const randomImage = (length = 32) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array); // Secure random numbers
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const extension = typeToExtension[file.type]; // keep original extension

    if (!extension) {
      alert("Unsupported file type.");
      return;
    }
    const imageName = `${randomImage()}.${extension}`;
    setSelectedImage({ file, imageName });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (selectedImage) {
      formData.append("image", selectedImage.file); // Append the image file if selected
      formData.append("imageName", selectedImage.imageName);
    }
    try {
      const response = await uploadImageS3(
        selectedImage.imageName,
        selectedImage.file.type,
        token
      );

      console.log(response);

      const uploadUrl = response.data.uploadUrl;

      // Upload to S3
      const tryTo = await axios.put(uploadUrl, selectedImage.file, {
        headers: {
          "Content-Type": selectedImage.file.type,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
      console.log(`Upload image success.`, tryTo);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };
  return (
    <div>
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
};

export default UploadS3;
