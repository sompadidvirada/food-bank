import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { getReportById, updateReadReport } from "../../api/baristar";
import DialogDetailAdmin from "../track_report/component/DialogDetailAdmin";
const URL =
  "https://treekoff-storage-track-image.s3.ap-southeast-2.amazonaws.com";

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
  const token = useFoodBankStorage((s) => s.token);
  const [unReadReports, setUnReadReports] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const fecthUnReadReport = async () => {
    try {
      const ress = await getReportById(user.id, token);
      setUnReadReports(ress.data);
    } catch (err) {
      console.log(err);
    }
  };
  const countTotalUnread = unReadReports?.length;

  useEffect(() => {
    const handleNewReport = (data) => {
      setUnReadReports((prev) => [data, ...prev]);
    };

    socket.on("new-report-baristar", handleNewReport);

    return () => {
      socket.off("new-report-baristar", handleNewReport); // 🔥 CLEANUP FIXES DUPLICATES
    };
  }, []);

  const handleUpdateReadReport = async (id) => {
    try {
      const ress = await updateReadReport({ id: id, staffId: user.id }, token);

      setUnReadReports((prev) =>
        prev.filter((item) => item.id !== ress.data.data.commentId)
      );
    } catch (err) {
      console.log(err);
    }
  };

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

  useEffect(() => {
    fecthUnReadReport();
  }, [token]);

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
            <CartBadge
              badgeContent={countTotalUnread}
              color="error"
              overlap="circular"
            />
          </IconButton>
          <Box
            sx={{
              position: "absolute",
              width: 400,
              minHeight: 100,
              bgcolor: colors.primary[900],
              right: -20,
              zIndex: 999,
              borderRadius: "10px",
              p: 2,
              display: openNotification ? "flex" : "none",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 800,
                overflow: "auto",
              }}
            >
              {!unReadReports || unReadReports.length === 0 ? (
                <Typography
                  sx={{
                    fontFamily: "Noto Sans Lao",
                    color: "rgba(255,255,255,0.8)",
                    textAlign: "center",
                    mt: 4,
                  }}
                >
                  ຍັງບໍ່ທັນມີລາຍງານຈາກສາຂາ
                </Typography>
              ) : (
                unReadReports.map((item, index) => (
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedReport(item);
                      setImageIndex(0);
                      setOpenDialog(true);
                      handleUpdateReadReport(item.id);
                    }}
                    key={`report-${index}`}
                  >
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={`${URL}/${item?.imageReportBaristar[0]?.image}`}
                        />
                      </ListItemAvatar>

                      <ListItemText
                        sx={{ fontFamily: "Noto Sans Lao" }}
                        primary={item.branch.branchname}
                        primaryTypographyProps={{
                          fontFamily: "Noto Sans Lao",
                        }}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                color: "rgba(255, 255, 255, 0.88)",
                                display: "inline",
                                fontFamily: "Noto Sans Lao",
                              }}
                            >
                              {item.title}
                            </Typography>

                            <Typography
                              sx={{
                                fontFamily: "Noto Sans Lao",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.description}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </List>
                ))
              )}
            </Box>
          </Box>
        </Box>

        <IconButton onClick={handleClickOpen}>
          <LogoutIcon />
        </IconButton>
      </Box>

      {/** DIALOG DETAIL REPORT UNREAD */}

      <DialogDetailAdmin
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedReport={selectedReport}
        setImageIndex={setImageIndex}
        imageIndex={imageIndex}
      />

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
