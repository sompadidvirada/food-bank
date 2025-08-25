import {
  Backdrop,
  Box,
  Button,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { useState } from "react";
import { toast } from "react-toastify";
import OutlinedInput from "@mui/material/OutlinedInput";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { tokens } from "../../../theme";
import { addRawMaterial, getUrlUpload } from "../../../api/rawMaterial";
import CircularProgress from "@mui/material/CircularProgress";
import { useRef } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

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

const AddRawMaterial = ({ categoryRawMaterial, fecthAllRawMaterial }) => {
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
    rawMaterial: "",
    description: "",
    categoryMeterailId: "",
    variantName: "",
    sizeUnit: "",
    costPriceKip: "",
    sellPriceKip: "",
    costPriceBath: "",
    sellPriceBath: "",
    barcode: "",
    image: "",
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
      rawMaterial: formData.rawMaterial,
      description: formData.description,
      categoryMeterailId: formData.categoryMeterailId,
      variantName: formData.variantName,
      sizeUnit: formData.sizeUnit,
      costPriceKip: formData.costPriceKip,
      sellPriceKip: formData.sellPriceKip,
      costPriceBath: formData.costPriceBath,
      sellPriceBath: formData.sellPriceBath,
      barcode: formData.barcode,
      image: productImage,
    };

    try {
      if (formData.image) {
        const url = await getUrlUpload(payloadURL, token);
        console.log(url);
        if (url?.data?.uploadUrl) {
          await axios.put(url?.data?.uploadUrl, formData.image, {
            headers: {
              "Content-Type": contentType,
            },
          });
        }
      }
      const ress = await addRawMaterial(payloadData, token);
      console.log(ress);
      fecthAllRawMaterial();
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
      rawMaterial: "",
      description: "",
      categoryMeterailId: "",
      variantName: "",
      sizeUnit: "",
      costPriceKip: "",
      sellPriceKip: "",
      costPriceBath: "",
      sellPriceBath: "",
      barcode: "",
      image: "",
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
        ເພີ່ມວັດຖຸດິບ
      </Button>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
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
              label="ຊື່ວັດຖຸດິບ"
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
                },
                mt: 1,
              }}
              name="rawMaterial"
              value={formData.rawMaterial}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="ບາໂຄດ"
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
                },
                mt: 1,
              }}
              name="barcode"
              value={formData.barcode}
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

            {/* Select Input */}
            <FormControl fullWidth>
              <InputLabel
                id="category-label"
                sx={{ fontFamily: "Noto Sans Lao" }}
              >
                ໝວດໝູ່
              </InputLabel>
              <Select
                labelId="category-label"
                name="categoryMeterailId"
                sx={{
                  fontFamily: "Noto Sans Lao",
                }}
                value={formData.categoryMeterailId}
                onChange={handleChange}
              >
                {categoryRawMaterial.map((cat) => (
                  <MenuItem
                    key={cat.id}
                    value={cat.id}
                    sx={{
                      fontFamily: "Noto Sans Lao",
                      "&.Mui-selected": {
                        color: "green", // 👈 change text color when selected
                        fontWeight: "bold", // 👈 optional: make it bold
                        backgroundColor: "rgba(25,118,210,0.12)", // 👈 custom bg
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "rgba(25,118,210,0.20)", // 👈 hover style
                      },
                    }}
                  >
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              {/* Submit Button */}
            </FormControl>
            <TextField
              label="ຊື່ແພ໋ກໄຊ້ຂອງວັດຖຸດິບ"
              required
              helperText="ຍົກຕົວຢ່າງເຊັ່ນ ຖ້າເປັນຄີມທຽມ ໃຫ້ໃສ່ວ່າ ຖົງ 1kg"
              FormHelperTextProps={{
                sx: {
                  fontFamily: "Noto Sans Lao",
                  fontSize: "14px",
                },
              }}
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
              name="variantName"
              value={formData.variantName}
              onChange={handleChange}
              fullWidth
            />
            <Box display={"flex"} gap={2}>
              <TextField
                label="ຊື່ບໍ່ລະມາດ"
                required
                helperText="ຍົກຕົວຢ່າງເຊັ່ນ ຖ້າເປັນຄີມທຽມ ຖົງ 1kg (1000g) ໃຫ້ໃສ່ວ່າ g"
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
                name="sizeUnit"
                value={formData.sizeUnit}
                onChange={handleChange}
              />
            </Box>

            <Box display={"flex"} gap={2}>
              <TextField
                label="ລາຄາຕົ້ນທືນກິບ"
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
                }}
                name="costPriceKip"
                type="number"
                value={formData.costPriceKip}
                onWheel={(e) => e.target.blur()} // 👈 prevent scroll changing value
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="ລາຄາຂາຍເງີນກີບ"
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
                }}
                name="sellPriceKip"
                type="number"
                value={formData.sellPriceKip}
                inputProps={{
                  min: 0, // 👈 minimum = 0
                }}
                onWheel={(e) => e.target.blur()} // 👈 prevent scroll changing value
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <Box display={"flex"} gap={2}>
              <TextField
                label="ລາຄາຕົ້ນທືນບາດ"
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
                }}
                name="costPriceBath"
                type="number"
                value={formData.costPriceBath}
                onWheel={(e) => e.target.blur()} // 👈 prevent scroll changing value
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="ລາຄາຂາຍເງີນບາດ"
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
                }}
                name="sellPriceBath"
                type="number"
                value={formData.sellPriceBath}
                onWheel={(e) => e.target.blur()} // 👈 prevent scroll changing value
                onChange={handleChange}
                fullWidth
              />
            </Box>
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

export default AddRawMaterial;
