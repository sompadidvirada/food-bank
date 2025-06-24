import React, { useState } from 'react'
import useFoodBankStorage from '../../../zustand/foodbank-storage';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input, TextField, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import CloseIcon from "@mui/icons-material/Close";
import { toast, ToastContainer } from 'react-toastify';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
const URL = import.meta.env.VITE_API_URL;


const Editprofile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const user = useFoodBankStorage((state) => state.user)
    const [open, setOpen] = useState(false);
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


    {/** FUNCTION */ }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditProfile({ ...editProflie, [name]: value });
    };

    const handleOpen = (user) => {

        if (user?.image) {
            // If product has image, create the preview URL
            const imageUrl = `${URL}/staffimage/${user?.image}`;
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
    }

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
    }

    const handleImageClick = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setOpenImageModal(true);
    }

    const handleCloseImageModal = () => {
        setOpenImageModal(false);
        setSelectedImageUrl(null);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the first file selected by the user
        if (file) {
            setSelectedImage(file); // Store the selected image in the state

            // Create a preview of the selected image using FileReader
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the preview image data URL
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("id", editProflie.id);
        formData.append("firstname", editProflie.firstname);
        formData.append("lastname", editProflie.lastname);
        formData.append("phonenumber", editProflie.phonenumber);
        formData.append("password", editProflie.password);
        if (selectedImage) {
            formData.append("image", selectedImage); // Append the image file if selected
        }
        try {
            const ress = await updateUser(formData);
            toast.success("ອັປເດດຂໍ້ມູນສໍາເລັດ!");
            handleClose(); // Close the dialog after successful update
        } catch (err) {
            console.error("Error updating user:", err);
        }

    }
    return (
        <Box>
            <ManageAccountsIcon
                onClick={() => handleOpen(user)}
                sx={{
                    ml: "6px",
                    cursor: "pointer",
                    "&:hover": { color: colors.grey[100] },
                }}
            />
            {/* Modal Edit Product Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        label="firstname"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editProflie.firstname}
                        onChange={handleEditChange}
                        name="firstname"
                    />
                    <TextField
                        label="lastname"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editProflie.lastname}
                        onChange={handleEditChange}
                        name="lastname"
                    />
                    <TextField
                        label="phonenumber"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editProflie.phonenumber}
                        onChange={handleEditChange}
                        name="phonenumber"
                    />
                    <TextField
                        label="password"
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
                    <Button onClick={handleClose} color={colors.redAccent[100]}>
                        Cancel
                    </Button>
                    <Button color={colors.redAccent[100]} onClick={handleSubmit}>
                        Save
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
            <ToastContainer position='top-center' />
        </Box>

    )
}

export default Editprofile