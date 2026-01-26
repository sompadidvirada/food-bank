import {
  TextField,
  Box,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import * as yup from "yup";
import { Formik } from "formik";
import { createCategory } from "../../../api/category";
import useFoodBankStorage from "../../../zustand/foodbank-storage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddCategory = () => {
  const [open, setOpen] = useState(false);
  const token = useFoodBankStorage((state) => state.token);
  const getCategory = useFoodBankStorage((state) => state.getCategory);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const ress = await createCategory(values, token);
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
        color="success"
        sx={{ fontWeight: "bold", fontFamily: "Noto Sans Lao" }}
        onClick={handleClickOpen}
      >
        ເພີ່ມໝວດໝູ່
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
          {"ເພີ່ມໝວດໝູ່"}
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
                    label="ຊື່ໝວດໝູ່..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    InputProps={{
                      sx: {
                        fontFamily: "Noto Sans Lao", // ✅ This will style the input text
                        fontSize: "16px",
                      },
                    }}
                    name="name"
                    InputLabelProps={{
                      sx: {
                        fontFamily: "Noto Sans Lao",
                        fontSize: "16px",
                      },
                    }}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </Box>
                <Box display="flex" justifyContent="end" mt="20px" gap={3}>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    sx={{ fontFamily: "Noto Sans Lao" }}
                  >
                    ສ້າງໝວດໝູ່
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
  name: yup.string().required("Required"),
});

const initialValues = {
  name: "",
};

export default AddCategory;
