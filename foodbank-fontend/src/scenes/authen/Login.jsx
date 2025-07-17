import React, { useState } from "react";
import { tokens } from "../../theme";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Container,
  Paper,
  Avatar,
  TextField,
  Grid2,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Link as RouterLink } from "react-router-dom";
import useFoodBankStorage from "../../zustand/foodbank-storage";

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarerror, setOpenSnackbarerror] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const actionLogin = useFoodBankStorage((state) => state.actionLogin);

  const handleFormSubmit = async (values) => {
    try {
      const res = await actionLogin(values);
      console.log(res);
      const role = res?.data?.payload?.role;
      roleRedirect(role);
    } catch (err) {
      console.log(err);
      setSnackbarMessage(err.response?.data?.message || "Can't Login!!"); // Use error message from API
      setOpenSnackbarerror(true);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "staff") {
      navigate("/user");
    } else {
      return;
    }
  };
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Paper elevation={10} sx={{ padding: 4, width: "100%", maxWidth: 500 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <img
            src="/TK.png"
            alt="Logo"
            style={{
              height: 120,
              display: "block",
              margin: "16px auto",
            }}
          />
        </Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: "Noto Sans Lao",
            textAlign: "center",
            mb: 2,
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          ເຂົ້າສູ່ລະບົບຂາຍ
        </Typography>
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
          }) => (
            <form onSubmit={handleSubmit}>
              <Box>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label={<Typography variant="laoText">ເບີໂທລະສັບ</Typography>}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phonenumber}
                  name="phonenumber"
                  error={!!touched.phonenumber && !!errors.phonenumber}
                  helperText={touched.phonenumber && errors.phonenumber}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label={<Typography variant="laoText">ລະຫັດຜ່ານ</Typography>}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained" sx={{fontFamily:"Noto Sans Lao"}}>
                  ເຂົ້າສູ່ລະບົບ
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Paper>
      <Box sx={{ mt: 4 }}>
        <Typography sx={{ color: colors.grey[500], textAlign: "center" }}>
          Copyright © 2025 BigTree Trading. All rights reserved.
        </Typography>
      </Box>
      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000} // Hide after 3 seconds
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {/* Snackbar for error message */}
      <Snackbar
        open={openSnackbarerror}
        autoHideDuration={2000} // Hide after 3 seconds
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbarerror(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  phonenumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  password: yup.string().required("required"),
});

const initialValues = {
  phonenumber: "",
  password: "",
};

export default Login;
