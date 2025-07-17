import { Box, IconButton, useTheme } from "@mui/material";
import { forwardRef, useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout =  () => {
    navigate('/')
    setOpen(false);
    useFoodBankStorage.persist.clearStorage();
  } 
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box></Box>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleClickOpen}>
          <LogoutIcon />
        </IconButton>
      </Box>

      {/** DIALOG LOGOUT */}

      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ fontFamily:"Noto Sans Lao", textAlign:"center", fontSize:25}}>{"ອອກຈາກລະບົບ"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" sx={{ fontFamily:"Noto Sans Lao", fontSize: 20}}>
            ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ບໍ່ ??
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display:"flex", justifyContent:"center"}}>
          <Button onClick={handleLogout} sx={{ fontFamily:"Noto Sans Lao", fontSize:18}} color="success">ຢືນຢັນ</Button>
          <Button onClick={handleClose} sx={{ fontFamily:"Noto Sans Lao", fontSize:18}} color="error">ຍົກເລີກ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;
