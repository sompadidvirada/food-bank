import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const URL =
  "https://treekoff-storage-track-image.s3.ap-southeast-2.amazonaws.com";

const DialogDetailAdmin = ({
  openDialog,
  setOpenDialog,
  selectedReport,
  setImageIndex,
  imageIndex,
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      maxWidth="md"
      fullWidth
    >
      {/* Close button */}
      <IconButton
        onClick={() => setOpenDialog(false)}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          zIndex: 2000,
          border: "1px white solid",
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Image Carousel */}
      <DialogContent sx={{ textAlign: "center", position: "relative" }}>
        <Typography
          sx={{
            position: "absolute",
            top: 5,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
            px: 2,
            py: 0.5,
            borderRadius: "12px",
            fontSize: 13,
            fontFamily: "Noto Sans Lao",
          }}
        >
          {imageIndex + 1} / {selectedReport?.imageReportBaristar.length}
        </Typography>
        {selectedReport && (
          <>
            {/* Prev Button */}
            {selectedReport.imageReportBaristar.length > 1 && (
              <IconButton
                onClick={() =>
                  setImageIndex((prev) =>
                    prev > 0
                      ? prev - 1
                      : selectedReport.imageReportBaristar.length - 1
                  )
                }
                sx={{ position: "absolute", left: 5, top: "50%" }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            )}

            {/* IMAGE */}
            <img
              src={`${URL}/${selectedReport?.imageReportBaristar[imageIndex]?.image}`}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                borderRadius: "10px",
                marginBottom: "14px", // <-- add spacing
                marginTop: "24px",
              }}
            />

            {/* Next Button */}
            {selectedReport.imageReportBaristar.length > 1 && (
              <IconButton
                onClick={() =>
                  setImageIndex((prev) =>
                    prev < selectedReport.imageReportBaristar.length - 1
                      ? prev + 1
                      : 0
                  )
                }
                sx={{ position: "absolute", right: 5, top: "50%" }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            )}

            {/* TITLE + DESCRIPTION */}
            <Box sx={{ mt: 4, textAlign: "left" }}>
              <Typography
                sx={{
                  fontFamily: "Noto Sans Lao",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {selectedReport.branch.branchname}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Noto Sans Lao",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                - {selectedReport.title}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontFamily: "Noto Sans Lao",
                  fontSize: 15,
                  color: "#dadadad6",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 240,
                }}
              >
                {selectedReport.description}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogDetailAdmin;
