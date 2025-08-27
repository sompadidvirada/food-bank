import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useRef, useState } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import { tokens } from "../../../theme";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { updateCoffeeMenu } from "../../../api/coffeeMenu";
const URL =
  "https://treekoff-storage-coffee-menu.s3.ap-southeast-2.amazonaws.com";

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

const UpdateCoffeeMenu = ({ row, fecthCoffeeMenu }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const token = useFoodBankStorage((state) => state.token);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    size: "",
    type: "",
    sellPrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleClickOpen = () => {
    setFormData({
      id: row?.id,
      name: row?.name,
      description: row?.description,
      size: row?.size,
      type: row?.type,
      sellPrice:row?.sellPrice
    });

    setPreviewImage(row?.image ? `${URL}/${row?.image}` : null); // optional preview
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      type: "",
      size: "",
      sellPrice: "",
    });
    setPreviewImage("");
    setOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenBackdrop(true);
    let productImage = null;
    let contentType = null;

    if (formData.image) {
      const file = formData.image;
      const extension = typeToExtension[file.type];
      if (!extension) throw new Error("Unsupported file type");

      productImage = `${randomImage()}.${extension}`; // generate name
      contentType = file.type; // e.g., "image/png"
    }
    const payload = {
      name: formData.name,
      description: formData.description,
      size: formData.size,
      type: formData.type,
      sellPrice: formData.sellPrice,
      image: productImage,
      contentType: contentType,
    };
    try {
      const ress = await updateCoffeeMenu(row.id, payload, token);
      if (ress.data.imageUploadUrl) {
        await axios.put(ress.data.imageUploadUrl, formData.image, {
          headers: {
            "Content-Type": contentType,
          },
        });
      }
      fecthCoffeeMenu();
      handleClose();
      setOpenBackdrop(false);
      toast.success(`ແກ້ໄຂລາຍການວັດຖຸດິບສຳເລັດ.`);
    } catch (err) {
      console.log(err);
      setOpenBackdrop(false);
      toast.error(`error.`);
    }
  };

  return (
    <Box>
      <IconButton color="info" onClick={handleClickOpen}>
        <Tooltip
          title="ແກ້ໄຂລາຍລະອຽດວັດຖຸດິບ"
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
          <EditNoteIcon />
        </Tooltip>
      </IconButton>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        onClose={handleClose}
        maxWidth="md" // xs, sm, md, lg, xl
        fullWidth // expands to 100% of maxWidth
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
                }}
              >
                ຂະໜາດຈອກ
              </InputLabel>
              <Select
                labelId="size-label"
                name="size" // 👈 important for handleChange
                value={formData.size || ""} // 👈 bind to formData
                onChange={handleChange}
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

export default UpdateCoffeeMenu;
