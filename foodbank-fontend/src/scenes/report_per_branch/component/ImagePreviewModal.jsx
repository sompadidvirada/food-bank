import React, { useState } from "react";
import { Dialog, DialogContent, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { format } from "date-fns";

const ImagePreviewModal = ({ open, onClose, images = [], baseUrl = "", branch }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={1}
      >
        <IconButton onClick={handlePrev}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <IconButton onClick={handleNext}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <DialogContent>
        {currentImage && (
          <Box display="flex" justifyContent="center" flexDirection={"column"}>
            <img
              src={`${baseUrl}/${images[currentIndex].imageName}`}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
            <Typography sx={{ p:4}} variant="laoText">
                ຮູບພາບຂອງສາຂາ {branch?.name} ປະຈຳວັນທີ {"   "}
              {format(new Date(images[currentIndex].date), "dd/MM/yyyy")}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
