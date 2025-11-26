import {
  Backdrop,
  Box,
  Button,
  DialogTitle,
  FormControl,
  IconButton,
  TextField,
  useTheme,
} from "@mui/material";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { useState } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { useRef } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { tokens } from "../../../theme";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import {
  createCoffeeMenu,
  getUrlUploadCoffeeMenu,
} from "../../../api/coffeeMenu";
import { InputLabel, MenuItem, Select } from "@mui/material";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddCoffeeMenu = ({ fecthCoffeeMenu }) => {
  const [open, setOpen] = useState(false);
  const token = useFoodBankStorage((state) => state.token);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInputRef = useRef(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const typeToExtension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/jpg": "jpg",
    "image/webp": "webp",
  };

  const randomImage = (length = 32) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array); // Secure random numbers
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    type: "",
    type_2:"",
    size: "",
    sellPrice:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setOpenBackdrop(true);
    e.preventDefault();
    let productImage = null;
    let contentType = null;
    if (formData.image) {
      const file = formData.image;
      const extension = typeToExtension[file.type];
      if (!extension) throw new Error("Unsupported file type");

      productImage = `${randomImage()}.${extension}`; // generate name
      contentType = file.type; // e.g., "image/png"
    }
    const payloadURL = {
      image: productImage,
      contentType: contentType,
    };
    const payloadData = {
      name: formData.name,
      description: formData.description,
      image: productImage,
      size: formData.size,
      type: formData.type,
      type_2: formData.type_2,
      sellPrice: formData.sellPrice,
    };
    try {
      if (formData.image) {
        const url = await getUrlUploadCoffeeMenu(payloadURL, token);
        if (url?.data?.uploadUrl) {
          await axios.put(url?.data?.uploadUrl, formData.image, {
            headers: {
              "Content-Type": contentType,
            },
          });
        }
      }
      const ress = await createCoffeeMenu(payloadData, token);
      fecthCoffeeMenu();
      setOpenBackdrop(false);
    } catch (err) {
      console.log(err);
      setOpenBackdrop(false);
    }
    handleClose();
    setPreviewImage(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      description: "",
      image: "",
      type: "",
      type_2:"",
      size: "",
      sellPrice:""
    });
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="success"
        onClick={handleClickOpen}
        sx={{ fontFamily: "Noto Sans Lao" }}
      >
        ເພີ່ມເມນູ
      </Button>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        PaperProps={{
          sx: {
            width: "600px",
            height: "600px",
            borderRadius: 3,
          },
        }}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle fontFamily={"Noto Sans Lao"}>
          {"ເພີ່ມລາຍການວັດຖຸດິບ"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Text Input */}
            <TextField
              label="ຊື່ເມນູ"
              required
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Noto Sans Lao",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Noto Sans Lao",
                  color: colors.grey[100],
                  opacity: 0.5,
                },
                "& .MuiInputLabel-shrink": {
                  // 👇 fix label cut when shrink
                  transform: "translate(14px, -9px) scale(0.75)",
                  fontFamily: "Noto Sans Lao",
                  color: colors.grey[100],
                },
                mt: 1,
              }}
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel
                id="size-label"
                sx={{
                  fontSize: "16px",
                  fontFamily: "Noto Sans Lao",
                  "&.Mui-focused": {
                    color: colors.grey[100], // 👈 label turns red on focus
                  },
                }}
              >
                ຂະໜາດຈອກ
              </InputLabel>
              <Select
                labelId="size-label"
                value={formData.size}
                onChange={handleChange}
                name="size"
              >
                <MenuItem value="TALL">TALL</MenuItem>
                <MenuItem value="SHORT">SHORT</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel
                id="size-label"
                sx={{
                  fontSize: "16px",
                  fontFamily: "Noto Sans Lao",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "gray",
                  },
                  "&.Mui-focused": {
                    color: colors.grey[100], // 👈 label turns red on focus
                  },
                }}
              >
                ປະເພດເຄື່ອງດື່ມ
              </InputLabel>
              <Select
                labelId="size-label"
                value={formData.type}
                onChange={handleChange}
                name="type"
              >
                <MenuItem value="COFFEE">COFFEE</MenuItem>
                <MenuItem value="CHOCOLATE">CHOCOLATE</MenuItem>
                <MenuItem value="TEA">TEA</MenuItem>
                <MenuItem value="ITALIAN SODA">ITALIAN SODA</MenuItem>
                <MenuItem value="MILK">MILK</MenuItem>
                <MenuItem value="EXTRA">EXTRA</MenuItem>
                <MenuItem value="COCOA">COCOA</MenuItem>
                <MenuItem value="MATCHA">MATCHA</MenuItem>
                <MenuItem value="FRUIT JUICE">FRUIT JUICE</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel
                id="size-label"
                sx={{
                  fontSize: "16px",
                  fontFamily: "Noto Sans Lao",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "gray",
                  },
                  "&.Mui-focused": {
                    color: colors.grey[100], // 👈 label turns red on focus
                  },
                }}
              >
                ປະເພດເຄື່ອງດື່ມ
              </InputLabel>
              <Select
                labelId="size-label"
                value={formData.type_2}
                onChange={handleChange}
                name="type_2"
              >
                <MenuItem value="HOT">HOT</MenuItem>
                <MenuItem value="ICED">ICED</MenuItem>
                <MenuItem value="SMOOTIE">SMOOTIE</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="ລາຄາຂາຍ"
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Noto Sans Lao",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Noto Sans Lao",
                  color: colors.grey[100],
                  opacity: 0.5,
                },
                "& .MuiInputLabel-shrink": {
                  // 👇 fix label cut when shrink
                  transform: "translate(14px, -9px) scale(0.75)",
                  fontFamily: "Noto Sans Lao",
                  color: colors.grey[100],
                },
                mt: 1,
              }}
              name="sellPrice"
              type="number"
              onWheel={(e) => e.target.blur()}
              inputProps={{
                min: 1,
              }}
              value={formData.sellPrice}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="ລາຍລະອຽດວັດຖຸດິບ"
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Noto Sans Lao",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Noto Sans Lao",
                  color: colors.grey[100],
                  opacity: 0.5,
                },
                "& .MuiInputLabel-shrink": {
                  // 👇 fix label cut when shrink
                  transform: "translate(14px, -9px) scale(0.75)",
                  fontFamily: "Noto Sans Lao",
                },
                mt: 1,
              }}
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
            <Box display={"flex"} gap={1} flexDirection={"column"}>
              <Box>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{ fontFamily: "Noto Sans Lao" }}
                >
                  ຮູບພາບ
                  <VisuallyHiddenInput
                    type="file"
                    name="image"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (!file) return;

                      // 1. Save file into formData
                      setFormData((prev) => ({
                        ...prev,
                        image: file,
                      }));

                      // 2. Show preview
                      const reader = new FileReader();
                      reader.onloadend = () => setPreviewImage(reader.result);
                      reader.readAsDataURL(file);
                    }}
                  />
                </Button>
              </Box>

              {/* Image Preview */}
              {previewImage && (
                <Box
                  display="flex"
                  position="relative"
                  sx={{ width: "100px", height: "100px" }}
                >
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setPreviewImage(null);
                      setFormData((prev) => ({
                        ...prev,
                        image: null, // clear image from formData
                      }));
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""; // reset file input
                      }
                    }}
                    sx={{
                      position: "absolute",
                      right: "0",
                      top: "0",
                      cursor: "pointer",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <DialogActions>
              <Button
                sx={{ fontFamily: "Noto Sans Lao" }}
                variant="contained"
                type="submit"
                color="success"
              >
                ສົ່ງຟອມ
              </Button>
              <Button
                onClick={handleClose}
                sx={{ fontFamily: "Noto Sans Lao" }}
                variant="contained"
                color="error"
              >
                ຍົກເລີກ
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
        {openBackdrop && (
          <Backdrop
            open
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: (theme) => theme.zIndex.modal + 1, // ensure above dialog
            }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Dialog>
    </Box>
  );
};

export default AddCoffeeMenu;
