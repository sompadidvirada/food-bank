import React, { forwardRef, useEffect, useRef, useState } from "react";

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import ImageModal from "../../component/ImageModal";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import MonthSelectBaristar from "./component/MonthSelectBaristar";
import { getBaristarProfile } from "../../api/baristar";
import dayjs from "dayjs";
import Editprofile from "../global/component/Editprofile";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const URL =
  "https://treekoff-store-staff-image.s3.ap-southeast-2.amazonaws.com";

const BaristarProfile = () => {
  const navigate = useNavigate();
  const user = useFoodBankStorage((s) => s.user);
  const [openLogout, setOpenLogout] = useState(false);
  const [open, setOpen] = useState(false);
  const token = useFoodBankStorage((s) => s.token);
  const imageModalRef = useRef();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(dayjs().month());
  const [year, setYear] = useState(dayjs().year());

  useEffect(() => {
    const handleTouchMove = (event) => {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    };

    const handleWheel = (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleSearch = async () => {
    const selectedDate = dayjs(new Date(year, month, 1));
    const startDate = selectedDate.startOf("month").format("YYYY-MM-DD");
    const endDate = selectedDate.endOf("month").format("YYYY-MM-DD");

    setLoading(true);
    try {
      const ress = await getBaristarProfile(
        { startDate, endDate, branchId: user.userBranch },
        token
      );
      setData(ress.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [token]);

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  const handleClickOpen = () => {
    setOpenLogout(true);
  };

  const handleClose = () => {
    setOpenLogout(false);
  };

  const handleLogout = () => {
    navigate("/");
    setOpen(false);
    useFoodBankStorage.setState({ user: null, token: null });
    useFoodBankStorage.persist.clearStorage();
  };

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress
            size={60}
            thickness={5}
            sx={{
              color: "#00b0ff", // bright cyan blue, visible in dark
            }}
          />
        </Box>
      ) : (
        <>
          <Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                m: 3,
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar
                  src={
                    user?.image
                      ? `${URL}/${user?.image}`
                      : `/Alexander the Great.jpeg`
                  }
                  onClick={() =>
                    handleImageClick(
                      user?.image
                        ? `${URL}/${user?.image}`
                        : "/Alexander the Great.jpeg"
                    )
                  }
                  alt={user?.firtname}
                  sx={{ width: 120, height: 120 }}
                />
                <Box mt={6} display={"flex"} gap={1} flexDirection={"column"}>
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans Lao",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {`${user?.firstname} ${user?.lastname}`}
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{
                        fontFamily: "Noto Sans Lao",
                        fontSize: 15,
                        opacity: 0.4,
                      }}
                    >
                      {user?.role === `admin` && `ຕຳແໜ່ງ: ບາລີສຕ້າ`}
                    </Typography>
                    {<Editprofile />}
                  </Box>
                </Box>
              </Box>

              <Box display={"flex"} flexDirection={"column"} gap={1}>
                <Box display={"flex"} gap={1}>
                  <LocalPhoneIcon sx={{ fontSize: 17 }} />
                  <Typography
                    fontFamily={"Noto Sans Lao"}
                    sx={{ fontSize: 14 }}
                  >{`ເບີໂທ: ${user.phonenumber}`}</Typography>
                </Box>
                <Box display={"flex"} gap={1}>
                  <PermContactCalendarIcon sx={{ fontSize: 17 }} />
                  <Typography
                    fontFamily={"Noto Sans Lao"}
                    sx={{ fontSize: 14 }}
                  >{`ປະຈຳສາຂາ: ${
                    user.branchName ? user?.branchName : "ບໍ່ມິສາຂາ"
                  }`}</Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              {/* ✅ use your MonthDropdown */}
              <MonthSelectBaristar
                month={month}
                year={year}
                onMonthChange={setMonth}
                onYearChange={setYear}
                onSearch={handleSearch}
              />
            </Box>
            <Box width={"100%"} display={"flex"}>
              <Box
                sx={{
                  width: "50%",
                  height: "100%",
                  p: 2,
                  gap: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans Lao",
                      fontSize: 20,
                      color: "rgba(0, 153, 255, 0.84)",
                    }}
                  >
                    {`${
                      data?.totalSend
                        ? `${data?.totalSend.toLocaleString()} ກີບ`
                        : `0 ກີບ`
                    }`}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans Lao",
                      fontSize: 15,
                      opacity: 0.5,
                    }}
                  >
                    ມູນຄ່າທີ່ຮັບເຂົ້າທັງຫມົດໃນເດືອນ
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "50%",
                  height: "100%",
                  p: 2,
                  borderLeft: "1px solid #ccc",
                  gap: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans Lao",
                      fontSize: 20,
                      color: "rgba(255, 32, 32, 0.84)",
                    }}
                  >
                    {`${
                      data?.totalExp
                        ? `${data?.totalExp.toLocaleString()} ກີບ`
                        : `0 ກີບ`
                    }`}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans Lao",
                      fontSize: 15,
                      opacity: 0.5,
                    }}
                  >
                    ມູນຄ່າໝົດອາຍຸທັງຫມົດພາຍໃນເດືອນ
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ my: 4 }}>
              <Box
                sx={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography sx={{ fontFamily: "Noto Sans Lao", fontSize: 30 }}>
                  {`${
                    data?.percent
                      ? `${data?.percent.toLocaleString()} %`
                      : `0 %`
                  }`}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontFamily: "Noto Sans Lao",
                    fontSize: 15,
                    opacity: 0.5,
                  }}
                >
                  ເປີເຊັນສູນເສຍປະຈຳເດືອນ
                </Typography>
              </Box>
            </Box>
            <Box sx={{ my: 6 }}>
              <List
                sx={{ width: "100%", maxWidth: 360 }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <ListItemButton disabled={true}>
                  <ListItemIcon>
                    <SendIcon sx={{ fontSize: 30 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="..."
                    primaryTypographyProps={{
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  />
                </ListItemButton>
                <ListItemButton onClick={handleClickOpen}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ fontSize: 30 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="ອອກຈາກລະບົບ"
                    primaryTypographyProps={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      fontFamily: "Noto Sans Lao",
                    }}
                  />
                </ListItemButton>
              </List>
            </Box>

            <Dialog
              open={openLogout}
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
                  fontSize: 20,
                }}
              >
                {"ອອກຈາກລະບົບ"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  id="alert-dialog-slide-description"
                  sx={{ fontFamily: "Noto Sans Lao", fontSize: 16 }}
                >
                  ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ບໍ່ ??
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  onClick={handleClose}
                  sx={{ fontFamily: "Noto Sans Lao" }}
                  color="success"
                  variant="contained"
                >
                  ຢືນຢັນ
                </Button>
                <Button
                  onClick={handleClose}
                  sx={{ fontFamily: "Noto Sans Lao" }}
                  color="error"
                  variant="outlined"
                >
                  ຍົກເລີກ
                </Button>
              </DialogActions>
            </Dialog>
            {/** image modal */}
            <ImageModal ref={imageModalRef} />
          </Box>
        </>
      )}

      <Dialog
        open={openLogout}
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
            fontSize: 20,
          }}
        >
          {"ອອກຈາກລະບົບ"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 16 }}
          >
            ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ບໍ່ ??
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleLogout}
            sx={{ fontFamily: "Noto Sans Lao" }}
            color="success"
            variant="contained"
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={handleClose}
            sx={{ fontFamily: "Noto Sans Lao" }}
            color="error"
            variant="outlined"
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BaristarProfile;
