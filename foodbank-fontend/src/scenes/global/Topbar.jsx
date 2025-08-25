import { Box, IconButton, styled, useTheme } from "@mui/material";
import { forwardRef, useContext, useEffect, useRef, useState } from "react";
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
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import { useNavigate } from "react-router-dom";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { useSocket } from "../../../socket-io-provider/SocketProvider";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [openNotification, setOpenNotification] = useState(false);
  const menuRef = useRef(null);
  const socket = useSocket(); // get the socket instance
  const user = useFoodBankStorage((state) => state.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If menuRef is set and click is outside, close the menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
    setOpen(false);
    useFoodBankStorage.setState({ user: null, token: null }); // clear memory
    useFoodBankStorage.persist.clearStorage(); // clear localStorage
  };

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
        <Box sx={{ position: "relative" }} ref={menuRef}>
          <IconButton
            onClick={() => setOpenNotification((prev) => !prev)}
            sx={{ bgcolor: openNotification ? colors.primary[800] : "none" }}
          >
            <NotificationsIcon
              sx={{ color: openNotification ? colors.blueAccent[400] : "none" }}
            />
            <CartBadge badgeContent={0} color="error" overlap="circular" />
          </IconButton>
          <Box
            sx={{
              position: "absolute",
              width: 200,
              minHeight: 100,
              bgcolor: colors.primary[800],
              right: 0,
              zIndex: 999,
              borderRadius: "10px",
              p: 2,
              display: openNotification ? "flex" : "none",
              flexDirection: "column",
            }}
          >
            <Box sx={{ py: 2, borderBottom: "1px solid", cursor: "pointer" }}>
              ສາຂາ ໂພນທັນ
            </Box>
            <Box sx={{ py: 2, borderBottom: "1px solid", cursor: "pointer" }}>
              ສາຂາ ສາຍລົມ
            </Box>
          </Box>
        </Box>

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
        <DialogTitle
          sx={{
            fontFamily: "Noto Sans Lao",
            textAlign: "center",
            fontSize: 25,
          }}
        >
          {"ອອກຈາກລະບົບ"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 20 }}
          >
            ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ບໍ່ ??
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleLogout}
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 18 }}
            color="success"
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={handleClose}
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 18 }}
            color="error"
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;
