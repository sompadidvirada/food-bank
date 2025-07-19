import React, { useEffect, useState, useRef } from "react";
import { Box, Button } from "@mui/material";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { NumericFormat } from "react-number-format";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { createProduct } from "../../../api/product";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddProduct = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const categorys = useFoodBankStorage((state) => state.categorys);
  const getCategory = useFoodBankStorage((state) => state.getCategory);
  const [open, setOpen] = React.useState(false);
  const getProduct = useFoodBankStorage((state) => state.getProduct);
  const token = useFoodBankStorage((state) => state.token);

  useEffect(() => {
    getCategory();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      // Append all other form fields
      Object.keys(values).forEach((key) => {
        if (key === "image") {
          if (values.image) {
            formData.append("image", values.image);
          }
        } else {
          formData.append(key, values[key]);
        }
      });

      const createPro = await createProduct(formData, token);
      console.log(createPro);

      // Reset form after submission
      resetForm(); // Reset Formik values
      setPreviewImage(null); // Clear image preview
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
      getProduct();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="success"
        sx={{ fontWeight: "bold", fontFamily: "Noto Sans Lao" }}
        onClick={handleClickOpen}
      >
        ເພີ່ມສິນຄ້າ
      </Button>

      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ fontFamily: "Noto Sans Lao", alignSelf: "center" }}>
          {"ເພີ່ມລາຍການສິນຄ້າ"}
        </DialogTitle>
        <DialogContent>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection={"column"} gap={5}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="ຊື່ສິນຄ້າ..."
                    InputProps={{
                      sx: {
                        fontFamily: "Noto Sans Lao", // ✅ This will style the input text
                        fontSize: "16px",
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        fontFamily: "Noto Sans Lao",
                        fontSize: "16px",
                      },
                    }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                  <Box display={"flex"} gap={2}>
                    <NumericFormat
                      customInput={TextField}
                      thousandSeparator={true}
                      fullWidth
                      variant="filled"
                      prefix="₭  "
                      type="text"
                      label="ລາຄາຕົ້ນທຶນ..."
                      InputProps={{
                        sx: {
                          fontFamily: "Noto Sans Lao", // ✅ This will style the input text
                          fontSize: "16px",
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          fontFamily: "Noto Sans Lao",
                          fontSize: "16px",
                        },
                      }}
                      onBlur={handleBlur}
                      onValueChange={(values) =>
                        setFieldValue("price", values.value)
                      }
                      value={values.price}
                      name="price"
                      error={!!touched.price && !!errors.price}
                      helperText={touched.price && errors.price}
                    />
                    <NumericFormat
                      customInput={TextField}
                      thousandSeparator={true}
                      fullWidth
                      variant="filled"
                      prefix="₭  "
                      type="text"
                      label="ລາຄາຂາຍ..."
                      InputProps={{
                        sx: {
                          fontFamily: "Noto Sans Lao", // ✅ This will style the input text
                          fontSize: "16px",
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          fontFamily: "Noto Sans Lao",
                          fontSize: "16px",
                        },
                      }}
                      onBlur={handleBlur}
                      onValueChange={(values) =>
                        setFieldValue("sellprice", values.value)
                      }
                      value={values.sellprice}
                      name="sellprice"
                      error={!!touched.sellprice && !!errors.sellprice}
                      helperText={touched.sellprice && errors.sellprice}
                    />
                  </Box>

                  <Box display={"flex"} gap={2}>
                    {/* Select Category */}
                    <FormControl sx={{ width: "200px" }}>
                      <InputLabel
                        id="category-label"
                        sx={{ fontFamily: "Noto Sans Lao" }}
                      >
                        ໝວດໝູ່
                      </InputLabel>
                      <Select
                        labelId="category-label"
                        id="category-select"
                        sx={{ fontFamily: "Noto Sans Lao" }}
                        value={values.category} // ✅ This will now default to "" instead of []
                        onChange={(event) => {
                          setFieldValue("category", Number(event.target.value)); // ✅ Convert to number
                        }}
                      >
                        {categorys?.map((cate) => (
                          <MenuItem
                            key={cate.id}
                            value={cate.id}
                            sx={{ fontFamily: "Noto Sans Lao" }}
                          >
                            {cate.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Select LifeTime */}

                    <FormControl sx={{ width: "200px" }}>
                      <InputLabel
                        id="category-label"
                        sx={{ fontFamily: "Noto Sans Lao" }}
                      >
                        ອາຍຸສິນຄ້າ
                      </InputLabel>
                      <Select
                        labelId="lifetime-label"
                        sx={{ fontFamily: "Noto Sans Lao" }}
                        id="lifetime-select"
                        value={values.lifetime} // ✅ This will now default to "" instead of []
                        onChange={(event) => {
                          setFieldValue("lifetime", Number(event.target.value)); // ✅ Convert to number
                        }}
                      >
                        <MenuItem
                          value={1}
                          sx={{ fontFamily: "Noto Sans Lao" }}
                        >
                          1 ວັນ
                        </MenuItem>
                        <MenuItem
                          value={2}
                          sx={{ fontFamily: "Noto Sans Lao" }}
                        >
                          2 ວັນ
                        </MenuItem>
                        <MenuItem
                          value={3}
                          sx={{ fontFamily: "Noto Sans Lao" }}
                        >
                          3 ວັນ
                        </MenuItem>
                        <MenuItem
                          value={4}
                          sx={{ fontFamily: "Noto Sans Lao" }}
                        >
                          4 ວັນ
                        </MenuItem>
                        <MenuItem
                          value={5}
                          sx={{ fontFamily: "Noto Sans Lao" }}
                        >
                          5 ວັນ
                        </MenuItem>
                        <MenuItem
                          value={6}
                          sx={{ fontFamily: "Noto Sans Lao" }}
                        >
                          6 ວັນ
                        </MenuItem>
                        <MenuItem
                          value={7}
                          sx={{ fontFamily: "Noto Sans Lao" }}
                        >
                          7 ວັນ
                        </MenuItem>
                        <MenuItem
                          value={8}
                          sx={{ fontFamily: "Noto Sans Lao" }}
                        >
                          8 ວັນ
                        </MenuItem>
                        <MenuItem
                          value={9}
                          sx={{ fontFamily: "Noto Sans Lao" }}
                        >
                          9 ວັນ
                        </MenuItem>
                        <MenuItem
                          value={10}
                          sx={{ fontFamily: "Noto Sans Lao" }}
                        >
                          10 ວັນ
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Image Upload */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("image", file);

                      // Preview image
                      const reader = new FileReader();
                      reader.onloadend = () => setPreviewImage(reader.result);
                      if (file) reader.readAsDataURL(file);
                    }}
                    style={{ marginBottom: "10px" }}
                  />

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
                      <CloseIcon
                        sx={{
                          position: "absolute",
                          right: "0",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setPreviewImage(null);
                          setFieldValue("image", null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Box display="flex" justifyContent="end" mt="20px" gap={3}>
                  <Button type="submit" color="secondary" variant="contained" sx={{ fontFamily: "Noto Sans Lao" }}>
                    ສົ່ງຟອມ
                  </Button>
                  <Button onClick={handleClose} color="error" variant="contained" sx={{ fontFamily: "Noto Sans Lao" }}>
                    ຍົກເລີກ
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("Required"),
  price: yup.number().required("Required"),
  price: yup.number().required("Required"),
  sellprice: yup.number().required("Required"),
  category: yup
    .number()
    .typeError("Select a valid category") // Ensures a number is selected
    .required("Category is required"),
  lifetime: yup
    .number()
    .typeError("Select a valid category") // Ensures a number is selected
    .required("lifetime is required"),
});

const initialValues = {
  name: "",
  price: "",
  sellprice: "",
  category: "", // ✅ Change this from [] to ""
  lifetime: "", //
  image: null,
};

export default AddProduct;
