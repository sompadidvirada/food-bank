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
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../../theme";
import { NumericFormat } from "react-number-format";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { updateProduct } from "../../../api/product";
import { toast, ToastContainer } from "react-toastify";
const URL = import.meta.env.VITE_API_URL;

const EditProduct = ({ productRow }) => {
  {
    /**import theme setting */
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const categorys = useFoodBankStorage((state) => state.categorys);
  const token = useFoodBankStorage((state) => state.token);
  const getCategory = useFoodBankStorage((state) => state.getCategory);
  const [imagePreview, setImagePreview] = useState(null); // To store image preview URL
  const [selectedImage, setSelectedImage] = useState(null); // To store the selected image
  const getProduct = useFoodBankStorage((state) => state.getProduct);

  useEffect(() => {
    getCategory();
  }, []);

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
    image: "",
  });


  const handleOpen = (productRow) => {
      setEditProduct(productRow);
      setSelectedImage(null); 
      if (productRow.image) {
      const imageUrl = `${URL}/product_img/${productRow.image}`;
      console.log(imageUrl)
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

  const handleSubmitEdit = async () => {
    // Create a FormData object to send the data and image together
    const formData = new FormData();
    formData.append("id", editProduct.id);
    formData.append("name", editProduct.name);
    formData.append("price", editProduct.price);
    formData.append("sellprice", editProduct.sellprice);
    formData.append("categoryId", editProduct.categoryId);
    formData.append("lifetime", editProduct.lifetime);
    if (selectedImage) {
      formData.append("image", selectedImage); // Append the image file if selected
    }

    const update = await updateProduct(editProduct.id, formData, token);
    await getProduct();
    setOpen(false);
  };

  return (
    <Box>
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

          <Box display="flex" gap="10px">
            {/* Select LifeTime */}

            <FormControl sx={{ mt: "10px" }}>
              <InputLabel id="category-label">LIFE TIME</InputLabel>
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

            <FormControl sx={{ mt: "10px" }}>
              <InputLabel id="category-label">CATEGORY</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
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
                  <MenuItem key={cate.id} value={cate.id}>
                    {cate.name}
                  </MenuItem>
                ))}
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
          <Button onClick={handleClose} color={colors.redAccent[100]}>
            Cancel
          </Button>
          <Button onClick={handleSubmitEdit} color={colors.redAccent[100]}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditProduct;
