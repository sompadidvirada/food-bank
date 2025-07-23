import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import * as yup from "yup";
import { Formik } from "formik";
import { createCategory, deleteCategory } from "../../../api/category";
import useFoodBankStorage from "../../../zustand/foodbank-storage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteCategory = () => {
  const [open, setOpen] = useState(false);
  const token = useFoodBankStorage((state) => state.token);
  const categorys = useFoodBankStorage((state) => state.categorys);
  const getCategory = useFoodBankStorage((state) => state.getCategory);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    console.log(values);

    try {
      const ress = await deleteCategory(values.category, token);
      getCategory(true);
      resetForm();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box>
      <Button
        variant="contained"
        color="error"
        sx={{ fontWeight: "bold", fontFamily: "Noto Sans Lao" }}
        onClick={handleClickOpen}
      >
        ລົບໝວດໝູ່
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
          {"ເລືອກໝວດໝູ່ທີ່ຈະລົບ"}
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
                </Box>
                <Box display="flex" justifyContent="end" mt="20px" gap={3}>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    sx={{ fontFamily: "Noto Sans Lao" }}
                  >
                    ຢືນຢັນ
                  </Button>
                  <Button
                    onClick={handleClose}
                    color="error"
                    variant="contained"
                    sx={{ fontFamily: "Noto Sans Lao" }}
                  >
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
  category: yup
    .number()
    .typeError("Select a valid category") // Ensures a number is selected
    .required("Category is required"),
});

const initialValues = {
  category: "",
};

export default DeleteCategory;
