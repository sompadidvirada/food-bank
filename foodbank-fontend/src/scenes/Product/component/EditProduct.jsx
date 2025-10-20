import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../../theme";
import { NumericFormat } from "react-number-format";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { updateProduct } from "../../../api/product";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
const URL =
  "https://treekoff-store-product-image.s3.ap-southeast-2.amazonaws.com";

const EditProduct = ({ productRow }) => {
  {
    /**import theme setting */
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const categorys = useFoodBankStorage((state) => state.categorys);
  const token = useFoodBankStorage((state) => state.token);
  const [imagePreview, setImagePreview] = useState(null); // To store image preview URL
  const [selectedImage, setSelectedImage] = useState(null); // To store the selected image
  const getProduct = useFoodBankStorage((state) => state.getProduct);
  const [isUploading, setIsUploading] = useState(false);

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
    /**create varible state */
  }

  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState({
    id: null,
    name: "",
    price: "",
    sellprice: "",
    categoryId: "",
    lifetime: "",
    status:""
  });

  const handleOpen = (productRow) => {
    setEditProduct(productRow);
    setSelectedImage(null);
    if (productRow.image) {
      const imageUrl = `${URL}/${productRow.image}`;
      setImagePreview(imageUrl); // Set imagePreview to the image URL
    } else {
      setImagePreview(null); // If no image, reset the image preview
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
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

    setSelectedImage(file); // Store the selected image in the state
    setEditProduct((prev) => ({
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

  const handleSubmitEdit = async () => {
    setIsUploading(true); // Show backdrop first

    setTimeout(() => {
      handleClose(); // Close the dialog just after backdrop shows
    }, 50); // 50ms is usually enough

    try {
      const update = await updateProduct(editProduct.id, editProduct, token);
      if (update.data.imageUploadUrl) {
        await axios.put(update.data.imageUploadUrl, selectedImage, {
          headers: {
            "Content-Type": editProduct.contentType,
          },
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      await getProduct(true);
      toast.success("ອັປເດດສິນຄ້າສຳເລັດ.");
      setOpen(false);
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Tooltip
        title="ແກ້ໄຂສິນຄ້າ"
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
        <IconButton onClick={() => handleOpen(productRow)}>
          <EditIcon
            sx={{
              cursor: "pointer",
              color: colors.blueAccent[500],
              "&:hover": {
                color: colors.blueAccent[700],
              },
            }}
          />
        </IconButton>
      </Tooltip>

      {/* Modal Edit Product Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editProduct.name}
            onChange={handleEditChange}
            name="name"
          />
          <NumericFormat
            customInput={TextField}
            thousandSeparator={true}
            prefix="₭  "
            label="Price"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editProduct.price}
            onValueChange={(values) =>
              setEditProduct({ ...editProduct, price: values.value })
            }
            name="price"
          />
          <NumericFormat
            customInput={TextField}
            thousandSeparator={true}
            prefix="₭  "
            label="Sell Price"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editProduct.sellprice}
            onValueChange={(values) =>
              setEditProduct({ ...editProduct, sellprice: values.value })
            }
            name="sellprice"
          />

          <Box display="flex" gap="10px" sx={{width:"100%"}}>
            {/* Select LifeTime */}

            <FormControl sx={{ mt: "10px", width:"30%" }}>
              <InputLabel id="category-label" sx={{fontFamily:"Noto Sans Lao"}}>ອາຍຸສິນຄ້າ</InputLabel>
              <Select
                labelId="lifetime-label"
                id="lifetime-select"
                value={editProduct.lifetime} // ✅ This will now default to "" instead of []
                onChange={(event) => {
                  setEditProduct({
                    ...editProduct,
                    lifetime: Number(event.target.value),
                  }); // ✅ Convert to number
                }}
              >
                <MenuItem value={1}>1 Day</MenuItem>
                <MenuItem value={2}>2 Day</MenuItem>
                <MenuItem value={3}>3 Day</MenuItem>
                <MenuItem value={4}>4 Day</MenuItem>
                <MenuItem value={5}>5 Day</MenuItem>
                <MenuItem value={6}>6 Day</MenuItem>
                <MenuItem value={7}>7 Day</MenuItem>
                <MenuItem value={8}>8 Day</MenuItem>
                <MenuItem value={9}>9 Day</MenuItem>
                <MenuItem value={10}>10 Day</MenuItem>
              </Select>
            </FormControl>
            {/* Select Category */}

            <FormControl sx={{ mt: "10px", width:"30%" }}>
              <InputLabel id="category-label" sx={{fontFamily:"Noto Sans Lao"}}>CATEGORY</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                sx={{fontFamily:"Noto Sans Lao"}}
                value={editProduct.categoryId} // ✅ This will now default to the selected category ID
                onChange={(event) => {
                  // Update the categoryId in editProduct state
                  setEditProduct({
                    ...editProduct,
                    categoryId: Number(event.target.value),
                  });
                }}
              >
                {categorys?.map((cate) => (
                  <MenuItem key={cate.id} value={cate.id} sx={{fontFamily:"Noto Sans Lao"}}>
                    {cate.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


            {/** SELECT STATUS */}

            <FormControl sx={{ mt: "10px", width:"30%" }}>
              <InputLabel id="status-label" sx={{fontFamily:"Noto Sans Lao"}}>ສະຖານະສິນຄ້າ</InputLabel>
              <Select
                labelId="status-select"
                id="status-select"
                value={editProduct.status} // ✅ This will now default to "" instead of []
                onChange={(event) => {
                  setEditProduct({
                    ...editProduct,
                    status: event.target.value,
                  }); // ✅ Convert to number
                }}
              >
                <MenuItem value={"A"}>A</MenuItem>
                <MenuItem value={"B"}>B</MenuItem>
                <MenuItem value={"F"}>F</MenuItem>
                <MenuItem value={"LPB"}>LPB</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
                  }}
                  onClick={() => handleImageClick(imagePreview)}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmitEdit}
            color="success"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 15 }}
          >
            ຕົກລົງ
          </Button>
          <Button
            onClick={handleClose}
            color="error"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 15 }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
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

export default EditProduct;
