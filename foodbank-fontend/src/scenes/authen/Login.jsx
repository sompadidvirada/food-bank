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

const Login = () => {

  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarerror, setOpenSnackbarerror] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFormSubmit = async (values) => {
    try {
      const res = await actionLogin(values);
      const role = res.data.payload.role;
      roleRedirect(role);
      if (res && res.data) {
        setSnackbarMessage(res.data.message || "Login successful!"); // Use API response message
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.log(err);
      setSnackbarMessage(err.response?.data?.message || "Can't Login!!"); // Use error message from API
      setOpenSnackbarerror(true);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };
  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ margin: 8, padding: 2 }}>
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: "secondary.main",
            textAlign: "center",
            mb: 1,
          }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Singin
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
                  label="Contact Number"
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
                  label="Password..."
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
                <Button type="submit" color="secondary" variant="contained">
                  LOG IN
                </Button>
              </Box>
              <Grid2 container justifyContent="space-between" sx={{ mt: 1 }}>
                <Grid2>
                  <Link
                    component={RouterLink}
                    to="/forgot"
                    sx={{ color: colors.grey[100] }}
                  >
                    <Typography sx={{ font: "bold" }}>
                      Forgot Password ?
                    </Typography>
                  </Link>
                </Grid2>
                <Grid2>
                  <Link
                    component={RouterLink}
                    to="/singin"
                    sx={{ color: colors.grey[100] }}
                  >
                    <Typography sx={{ font: "bold" }}>Sing in</Typography>
                  </Link>
                </Grid2>
              </Grid2>
            </form>
          )}
        </Formik>
      </Paper>
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
