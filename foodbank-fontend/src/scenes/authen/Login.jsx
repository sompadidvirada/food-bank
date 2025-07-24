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
import { createNewpassword } from "../../api/authen";

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarerror, setOpenSnackbarerror] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [newPassword, setNewPassword] = useState(false);
  const actionLogin = useFoodBankStorage((state) => state.actionLogin);

  const [initialValues, setInitialValues] = useState({
    phonenumber: "",
    password: "",
    newPassword: "",
  });

  const handleFormSubmit = async (values) => {
    try {
      const res = await actionLogin(values);
      console.log(res);
      if (res.data.message === "insert new password" && res.status === 200) {
        setInitialValues((prev) => ({
          ...prev,
          phonenumber: values.phonenumber,
          newPassword: "",
          password: "",
        }));
        setNewPassword(true);
        setSnackbarMessage("ປ້ອນລະຫັດໃຫ່ມ.");
        setOpenSnackbar(true);
        return; // <-- IMPORTANT: avoid redirect after asking for new password
      }

      const role = res?.data?.payload?.role;
      roleRedirect(role);
    } catch (err) {
      console.log(err);
      setSnackbarMessage(err.response?.data?.message || "Can't Login!!"); // Use error message from API
      setOpenSnackbarerror(true);
    }
  };

  const handleNewPasswordSubmit = async (values, { resetForm }) => {
    try {
      const res = await createNewpassword({
        phonenumber: values.phonenumber,
        password: values.newPassword,
      });

      if (res.status === 200) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSnackbarMessage("Password updated successfully.");
        setOpenSnackbar(true);

        // Reset form state and go back to login view
        setInitialValues({
          phonenumber: "",
          password: "",
          newPassword: "",
        });
        setNewPassword(false); // go back to login form
        resetForm(); // reset Formik internal state
      }
    } catch (err) {
      console.log(err);
      setSnackbarMessage("Failed to update password.");
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
          ເຂົ້າສູ່ລະບົບຈັດຊື້
        </Typography>
        <Formik
          onSubmit={(values, formikHelpers) =>
            newPassword
              ? handleNewPasswordSubmit(values, formikHelpers)
              : handleFormSubmit(values, formikHelpers)
          }
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={newPassword ? newPasswordSchema : checkoutSchema}
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
              {!newPassword ? (
                // ORIGINAL LOGIN FORM
                <Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={
                      <Typography variant="laoText">ເບີໂທລະສັບ</Typography>
                    }
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
              ) : (
                // NEW PASSWORD FORM
                <Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={
                      <Typography variant="laoText">ເບີໂທລະສັບ</Typography>
                    }
                    value={values.phonenumber}
                    name="phonenumber"
                    disabled
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ my: 2, width: "100%", textAlign: "center" }}>
                    <Typography
                      variant="laoText"
                      sx={{ fontSize: 15, color: colors.greenAccent[400] }}
                    >
                      ກະລຸນາສ້າງລະຫັດໃຫ່ມ
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label={<Typography variant="laoText">ລະຫັດໃໝ່</Typography>}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.newPassword}
                    name="newPassword"
                    error={!!touched.newPassword && !!errors.newPassword}
                    helperText={touched.newPassword && errors.newPassword}
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
              <Box display="flex" justifyContent="center" mt="20px">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  sx={{ fontFamily: "Noto Sans Lao" }}
                >
                  {!newPassword ? "ເຂົ້າສູ່ລະບົບ" : "ຕົກລົງລະຫັດໃໝ່"}
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
          sx={{ width: "100%", fontFamily: "Noto Sans Lao" }}
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
  password: yup.string(),
});

const newPasswordSchema = yup.object().shape({
  newPassword: yup.string().min(3, "Password too short").required("required"),
});

export default Login;
