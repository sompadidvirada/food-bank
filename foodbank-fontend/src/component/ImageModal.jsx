import React, { useState } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImageModal = React.forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // expose a method to parent via ref
  React.useImperativeHandle(ref, () => ({
    openModal: (url) => {
      setImageUrl(url);
      setOpen(true);
    },
    closeModal: () => {
      setOpen(false);
      setImageUrl(null);
    },
  }));

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogContent sx={{ position: "relative", padding: 0 }}>
        <IconButton
          onClick={handleClose}
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
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Large Preview"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
});

export default React.memo(ImageModal);
