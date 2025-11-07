import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useMemo } from "react";
import { tokens } from "../../theme";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import CalendarOrderUser from "../orderUser/component/CalendarOrderUser";
import { useState } from "react";
import Header from "../component/Header";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { format, isValid, parseISO } from "date-fns";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Slide from "@mui/material/Slide";
import { toast } from "react-toastify";
import { changePhonenumber } from "../../api/branch";
import { getImageAllBranch } from "../../api/trackingImage";
import { useEffect } from "react";
import { useRef } from "react";
import ImageModal from "../../component/ImageModal";

const URL =
  "https://treekoff-storage-track-image.s3.ap-southeast-2.amazonaws.com";

const URLCUSTOMER = "https://treekoff.store";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TrackUploadImage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const branchs = useFoodBankStorage((state) => state.branchs);
  const getBrnachs = useFoodBankStorage((state) => state.getBrnachs);
  const token = useFoodBankStorage((state) => state.token);
  const dateConfirmOrder = useFoodBankStorage(
    (state) => state.dateConfirmOrder
  );
  const [open, setOpen] = useState(false);
  const [idBranch, setIdbranch] = useState("");
  const [value, setValue] = useState("");
  const [imageAllBranch, setImageAllBranch] = useState([]);
  const imageModalRef = useRef();

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  const handleClickOpen = (id) => {
    setOpen(true);
    setIdbranch(id);
  };
  const handleClose = () => {
    setOpen(false);
    setIdbranch("");
    setValue("");
  };

  const fecthImages = async () => {
    try {
      const ress = await getImageAllBranch(
        { checkDate: dateConfirmOrder?.orderDate },
        token
      );
      setImageAllBranch(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fecthImages();
  }, [token, dateConfirmOrder]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangePhonenumber = async () => {
    if (isNaN(value) || value.trim() === "") {
      toast.error("ເບີໂທຕ້ອງເປັນໂຕເລກ");
      return;
    }
    if (value.length !== 8) {
      toast.error("ເບີໂທບໍ່ຖືກຕ້ອງ..");
      return;
    }
    try {
      const ress = await changePhonenumber(
        { branchId: idBranch.id, phonenumber: value },
        token
      );
      getBrnachs(true);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateLink = (phone) => {
    const phoneNumber = `85620${phone}`;

    // Keep URL as-is (encoded), no decodeURIComponent here
    const message = `ສະບາຍດີ ແຈ້ງຈາກພະແນກຈັດຊື້ TREEKOFF ຮູບພາບຕູ້ເບເກີລີ້ຂອງສາຂາຍັງບໍ່ມີການອັປໂຫລດ ກະລຸນາອັປໂຫລດຕາມລີ້ງ ${URLCUSTOMER}`;

    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const imageByBranch = useMemo(() => {
    const map = {};
    imageAllBranch.forEach((img) => {
      if (!map[img.branchId]) map[img.branchId] = [];
      map[img.branchId].push(img);
    });
    return map;
  }, [imageAllBranch]);

  const renderPhoneCell = (branch) => {
    if (branch.phonenumber)
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <Typography>{branch?.phonenumber}</Typography>
          <Tooltip
            title="ແກ້ໄຂເບີໂທ"
            arrow
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: "14px",
                  fontFamily: "Noto Sans Lao", // or any font you prefer
                  color: "#fff",
                  backgroundColor: "#333", // optional
                },
              },
            }}
          >
            <IconButton onClick={() => handleClickOpen(branch)}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      );
    return (
      <Box>
        <Button
          variant="contained"
          color="info"
          sx={{ fontFamily: "Noto Sans Lao" }}
          onClick={() => handleClickOpen(branch)}
        >
          ເພີ່ມເບີຕິດຕໍ່
        </Button>
      </Box>
    );
  };

  const renderConteck = (branch) => {
    if (branch.phonenumber)
      return (
        <Box>
          <Button
            onClick={() => handleCreateLink(branch.phonenumber)}
            variant="contained"
            sx={{ fontFamily: "Noto Sans Lao" }}
            startIcon={<AddLinkIcon />}
          >
            ແຈ້ງຫາສາຂາ
          </Button>
        </Box>
      );
    return <Typography>-</Typography>;
  };

  return (
    <Box m="20px">
      <Header title="ຈັດການການສັ່ງຊຶ້ເບເກີລີ້" />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="20px"
      >
        <CalendarOrderUser />
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography variant="Laotext" sx={{ fontSize: 20 }}>
          ລາຍລະອຽດຮູບຕູ້ເບເກີລີ້ແຕ່ລະສາຂາຂອງວັນທີ{" "}
          {dateConfirmOrder?.orderDate
            ? (() => {
                const dateValue =
                  typeof dateConfirmOrder.orderDate === "string"
                    ? parseISO(dateConfirmOrder.orderDate)
                    : new Date(dateConfirmOrder.orderDate);

                return isValid(dateValue)
                  ? format(dateValue, "dd/MM/yyyy")
                  : "Invalid date";
              })()
            : "—"}
        </Typography>
      </Box>
      {dateConfirmOrder?.orderDate ? (
        <Box m={2}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: "Noto Sans Lao" }}>
                    ສາຂາ{" "}
                  </TableCell>
                  <TableCell align="left" sx={{ fontFamily: "Noto Sans Lao" }}>
                    ຮູບເບເກີລີ້
                  </TableCell>
                  <TableCell align="right" sx={{ fontFamily: "Noto Sans Lao" }}>
                    ເບີຕີດຕໍ່ສາຂາ
                  </TableCell>
                  <TableCell align="right" sx={{ fontFamily: "Noto Sans Lao" }}>
                    ຕິດຕໍ່ຫາສາຂາ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchs.map((branch) => {
                  // find all images for this branch
                  const branchImages = imageByBranch[branch.id] || [];

                  return (
                    <TableRow
                      key={branch.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontFamily: "Noto Sans Lao" }}
                      >
                        {branch.branchname}
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" gap={1}>
                          {branchImages.length > 0 ? (
                            branchImages.map((img) => (
                              <img
                                key={img.id}
                                src={`${URL}/${img.imageName}`}
                                alt={branch.branchname}
                                loading="lazy"
                                onClick={() =>
                                  handleImageClick(`${URL}/${img.imageName}`)
                                }
                                style={{
                                  width: 60,
                                  height: 60,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                  cursor: "pointer",
                                }}
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No images
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        {renderPhoneCell(branch)}
                      </TableCell>

                      <TableCell align="right">
                       {renderConteck(branch)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <Typography variant="Laotext">ກະລຸນາເລືອກວັນທີ່...</Typography>
        </Box>
      )}
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
          fontFamily={"Noto Sans Lao"}
        >{`ເພີ່ມເບີຕິດຕໍ່ສາຂາ ${idBranch.branchname}`}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Noto Sans Lao", py: 2 }}>
            ຕົວຢ່າງເບີໂທ "55152451" ໃຫ້ໃສ່ສະເພາະເບີໂທ..
          </DialogContentText>
          <TextField
            id="outlined-basic"
            variant="outlined"
            value={value}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleChangePhonenumber();
              }
            }}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleChangePhonenumber}
            variant="contained"
            color="success"
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>
      {/** image modal */}
      <ImageModal ref={imageModalRef} />
    </Box>
  );
};

export default TrackUploadImage;
