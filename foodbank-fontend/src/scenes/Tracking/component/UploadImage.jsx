import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import AddIcon from "@mui/icons-material/Add";
import {
  checkImages,
  deleteImages,
  uploadImageTrack,
} from "../../../api/tracking";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { format } from "date-fns";

const URL =
  "https://treekoff-storage-track-image.s3.ap-southeast-2.amazonaws.com";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadImage = ({ selectFormtracksell, checkImage, setCheckImage }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const token = useFoodBankStorage((state) => state.token);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);

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

  const date = new Date(selectFormtracksell?.sellAt).toLocaleDateString(
    "lo-LA",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    const newImages = [];

    files.forEach((file) => {
      const extension = typeToExtension[file.type];
      if (!extension) {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
      const imageName = `${randomImage()}.${extension}`;
      newImages.push({ file, name: imageName });

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        // Once all previews are read, update state
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
          setSelectedImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const preparePayload = () => {
    return {
      branchId: selectFormtracksell?.brachId,
      Datetime: selectFormtracksell?.sellAt,
      images: selectedImages.map((img) => ({
        imagesName: img.name,
        contentType: img.file.type,
      })),
    };
  };

  const handleUpload = async () => {
    const data = preparePayload(); // includes branchId and image metadata
    setIsUploading(true);

    try {
      // 1. Request signed upload URLs from backend
      const response = await uploadImageTrack(data, token); // should return { data: [...] }
      const uploadUrls = response?.data?.data;

      if (!uploadUrls || !Array.isArray(uploadUrls)) {
        throw new Error("Invalid upload URL response");
      }

      // 2. Upload each image to its corresponding signed URL
      for (const uploadItem of uploadUrls) {
        const { uploadUrl, filename } = uploadItem;
        const matchedImage = selectedImages.find(
          (img) => img.name === filename
        );

        if (!matchedImage) {
          console.warn(`No matching image found for ${filename}`);
          continue;
        }
        await axios.put(uploadUrl, matchedImage.file, {
          headers: {
            "Content-Type": matchedImage.file.type,
          },
        });
      }
      toast.success("ອັປໂຫລດຮູບພາບສຳເລັດ");
      setCheckImage((prev) => [
        ...prev,
        ...selectedImages.map((img) => ({
          imageName: img.name,
          date: selectFormtracksell?.sellAt,
          branchId: selectFormtracksell?.brachId,
        })),
      ]);
      // 3. Reset
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("ລອງໃຫ່ມອີກຄັ້ງ.");
    } finally {
      setIsUploading(false);
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteImages = async () => {
    setIsUploading(true); // Show backdrop first

    setTimeout(() => {
      handleClose(); // Close the dialog just after backdrop shows
    }, 50); // 50ms is usually enough
    const payload = {
      date: selectFormtracksell?.sellAt,
      branchId: selectFormtracksell?.brachId,
      images: checkImage.map((img) => img.imageName), // <-- only image names
    };
    try {
      const ress = await deleteImages(payload, token);

      const deletedNames = payload.images;

      setCheckImage((prev) =>
        prev.filter((img) => !deletedNames.includes(img.imageName))
      );
    } catch (err) {
      console.log(err);
      toast.error(`ລອງໃຫ່ມອີກຄັ້ງ`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl(null);
  };

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        gap: 4,
        alignContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        alignContent={"center"}
        gap={3}
        display={"flex"}
        alignItems={"center"}
      >
        {selectedImages.length > 0 ? (
          <Box>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              color="success"
              tabIndex={-1}
              startIcon={<AddIcon />}
              onClick={handleUpload}
              sx={{ fontFamily: "Noto Sans Lao" }}
            >
              ອັປໂຫລດຮູບ
            </Button>
          </Box>
        ) : (
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              color="info"
              disabled={checkImage?.length > 0 ? true : false}
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{ fontFamily: "Noto Sans Lao" }}
            >
              ອັປໂຫລດຮູບ
              <VisuallyHiddenInput
                type="file"
                onChange={handleImageChange}
                multiple
              />
            </Button>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              color="error"
              disabled={checkImage?.length > 0 ? false : true}
              tabIndex={-1}
              onClick={handleClickOpen}
              startIcon={<DeleteForeverIcon />}
              sx={{ fontFamily: "Noto Sans Lao" }}
            >
              ລົບຮູບທັງໝົດ
            </Button>
          </Box>
        )}
      </Box>

      {checkImage.length > 0 || imagePreviews.length > 0 ? (
        <Box mt={2} display="flex" gap={2} flexWrap="wrap">
          {/* Display checkImage if available */}
          {checkImage.length > 0
            ? checkImage.map((img, index) => (
                <Box
                  key={`check-${index}`}
                  sx={{ position: "relative", width: 100, height: 100 }}
                >
                  <img
                    src={`${URL}/${img.imageName}`}
                    alt={`Uploaded ${index}`}
                    onClick={() => handleImageClick(img.imageName)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                      cursor:"pointer"
                    }}
                  />
                </Box>
              ))
            : imagePreviews.map((preview, index) => (
                <Box
                  key={`preview-${index}`}
                  sx={{ position: "relative", width: 100, height: 100 }}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setImagePreviews((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setSelectedImages((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      zIndex: 1,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.6)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <img
                    src={preview}
                    alt={`Selected ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </Box>
              ))}
        </Box>
      ) : (
        // Empty fallback box
        <Box
          mt={2}
          display="flex"
          gap={2}
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              border: "2px dashed #aaa",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#aaa",
              fontFamily: "Noto Sans Lao",
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 30, mb: 1 }} />
            <Typography variant="laoText">ບໍ່ມີຮູບພາບ</Typography>
          </Box>
        </Box>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isUploading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/** DIALOG CONFIRM DELETE IMAGE */}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontFamily: "Noto Sans Lao", fontSize: 20 }}
        >
          {`ຕ້ອງການລົບຮູບພາບທັງໝົດຂອງວັນທີ່ ${date} ແທ້ບໍ່?`}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleDeleteImages}
            autoFocus
            variant="contained"
            color="success"
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>

      {/** IMAGE MODAL */}

      <Dialog
        open={openImageModal}
        onClose={handleCloseImageModal}
        maxWidth="md"
      >
        <DialogContent sx={{ position: "relative", padding: "0" }}>
          <IconButton
            onClick={handleCloseImageModal}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "white",
              "&:hover": { backgroundColor: "gray" },
            }}
          >
            <CloseIcon sx={{ color: "black" }} />
          </IconButton>
          {selectedImageUrl && (
            <img
              src={`${URL}/${selectedImageUrl}`}
              alt="Large Preview"
              style={{
                width: "100%",
                height: "800px",
                maxHeight: "90vh",
                overflow: "hidden",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UploadImage;
