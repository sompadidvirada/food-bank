import React, { useState } from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const URL =
  "https://treekoff-store-staff-image.s3.ap-southeast-2.amazonaws.com";

const Editprofile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useFoodBankStorage((state) => state.user);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [editProflie, setEditProfile] = useState({
    id: null,
    firstname: "",
    lastname: "",
    phonenumber: "",
    password: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const updateUser = useFoodBankStorage((state) => state.updateUser);
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

  {
    /** FUNCTION */
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProflie, [name]: value });
  };

  const handleOpen = (user) => {
    if (user?.image) {
      // If product has image, create the preview URL
      const imageUrl = `${URL}/${user?.image}`;
      setImagePreview(imageUrl); // Set imagePreview to the image URL
    } else {
      setImagePreview(null); // If no image, reset the image preview
    }
    setEditProfile({
      id: user?.id || null,
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      phonenumber: user?.phonenumber || "",
      password: "", // Usually we don't prefill password for security
      image: user?.image || "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditProfile({
      id: null,
      firstname: "",
      lastname: "",
      phonenumber: "",
      password: "",
      image: "",
    });
    setImagePreview(null);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file selected by the user
    if (!file) return;
    const extension = typeToExtension[file.type]; // keep original extension

    if (!extension) {
      alert("Unsupported file type.");
      return;
    }
    const imageName = `${randomImage()}.${extension}`;
    setSelectedImage(file);
    setEditProfile((prev) => ({
      ...prev,
      imageName: imageName,
      contentType: extension,
    }));
    // Create a preview of the selected image using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set the preview image data URL
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  };

  const handleSubmit = async () => {
    setIsUploading(true); // Show backdrop first

    setTimeout(() => {
      handleClose(); // Close the dialog just after backdrop shows
    }, 50); // 50ms is usually enough

    try {
      await updateUser(editProflie, selectedImage);
      toast.success("ອັບເດດຂໍ້ມູນສໍາເລັດ!");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("ມີບັນຫາໃນການອັບໂຫຼດ!");
    } finally {
      setIsUploading(false); // Hide backdrop
    }
  };

  return (
    <Box>
      <Tooltip
        title="ແກ້ໄຂຂໍ້ມູນໂປຟາຍ"
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: "14px",
              fontFamily: "Noto Sans Lao", // or any font you prefer
              color: "#fff",
              backgroundColor: "#333", // optional
            },
          },
        }}
      >
        <ManageAccountsIcon
          onClick={() => handleOpen(user)}
          sx={{
            ml: "6px",
            cursor: "pointer",
            "&:hover": { color: colors.grey[100] },
          }}
        />
      </Tooltip>
      {/* Modal Edit Product Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label={<Typography variant="laoText">ຊື່</Typography>}
            variant="outlined"
            fullWidth
            margin="normal"
            value={editProflie.firstname}
            onChange={handleEditChange}
            name="firstname"
          />
          <TextField
            label={<Typography variant="laoText">ນາມສະກຸນ</Typography>}
            variant="outlined"
            fullWidth
            margin="normal"
            value={editProflie.lastname}
            onChange={handleEditChange}
            name="lastname"
          />
          <TextField
            label={<Typography variant="laoText">ເບີໂທລະສັບ</Typography>}
            variant="outlined"
            fullWidth
            margin="normal"
            value={editProflie.phonenumber}
            onChange={handleEditChange}
            name="phonenumber"
          />
          <TextField
            label={<Typography variant="laoText">ລະຫັດ</Typography>}
            variant="outlined"
            fullWidth
            margin="normal"
            value={editProflie.password}
            onChange={handleEditChange}
            name="password"
          />

          <Box mt={2}>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              fullWidth
            />
            {imagePreview && (
              <Box mt={2}>
                <img
                  src={imagePreview}
                  alt="Selected"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(imagePreview)}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {" "}
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ບັນທືກ
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>

      {/** image modal */}
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
              src={selectedImageUrl || "nigler.png"}
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isUploading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default Editprofile;
