import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { tokens } from "../../theme";
import Header from "../component/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import Paper from "@mui/material/Paper";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import AddLinkIcon from "@mui/icons-material/AddLink";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import UnpublishedRoundedIcon from "@mui/icons-material/UnpublishedRounded";
import CalendarOrderUser from "./component/CalendarOrderUser";
import {
  chanheStatusOrder,
  checkConfirmOrderAll,
  getAllOrderTrack,
} from "../../api/preorder";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { changePhonenumber } from "../../api/branch";
import { toast } from "react-toastify";
import PrintCompo from "./component/PrintCompo";
import { format, isValid, parseISO } from "date-fns";
import { useSocket } from "../../../socket-io-provider/SocketProvider";
import SelectSupplyer from "./component/SelectSupplyer";
import { getAllSupplyer } from "../../api/suppler";

const URLCUSTOMER = "https://treekoff.store/customerorder";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const branchs = useFoodBankStorage((state) => state.branchs);
  const getBrnachs = useFoodBankStorage((state) => state.getBrnachs);
  const token = useFoodBankStorage((state) => state.token);
  const [status, setStatus] = useState([]);
  const [open, setOpen] = useState(false);
  const [idBranch, setIdbranch] = useState("");
  const [orderTrack, setOrderTrack] = useState([]);
  const [value, setValue] = useState("");
  const [selectDateBrachCheck, setSelectDateBrachCheck] = useState({
    supplyerId: "",
  });
  const [supplyers, setSupplyer] = useState([]);

  const fecthAllSupllyer = async () => {
    try {
      const ress = await getAllSupplyer(token);
      setSupplyer(ress.data);
    } catch (err) {
      console.log(err);
    }
  };
  const socket = useSocket();
  const dateConfirmOrder = useFoodBankStorage(
    (state) => state.dateConfirmOrder,
  );
  const orderWantFilter = Object.values(
    orderTrack?.reduce((acc, item) => {
      if (!acc[item.branchId]) {
        acc[item.branchId] = {
          branchId: item.branchId,
          branch: item.branch,
          totalOrderWant: 0,
        };
      }
      if (item.orderWant > 0 && item.orderWant !== item.orderCount) {
        acc[item.branchId].totalOrderWant += 1;
      }
      return acc;
    }, {}),
  );

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    setIdbranch("");
    setValue("");
  };

  const filterBranchs = branchs?.filter(
    (item) => item.province === "ນະຄອນຫຼວງວຽງຈັນ",
  );

  const fecthconfirmOrder = async () => {
    if (!dateConfirmOrder) return;
    try {
      const ress = await checkConfirmOrderAll(dateConfirmOrder, token);
      setStatus(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeStatus = async (id, status) => {
    try {
      const ress = await chanheStatusOrder(id, { status: status }, token);
      setStatus((prev) =>
        prev.map((item) =>
          item.id === ress.data.id ? { ...item, ...ress.data } : item,
        ),
      );
    } catch (err) {
      console.log(err);
    }
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
        token,
      );
      getBrnachs(true);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  const handleFecthOrderTrack = async () => {
    try {
      const ress = await getAllOrderTrack(dateConfirmOrder, token);
      setOrderTrack(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (dateConfirmOrder.orderDate) {
      fecthconfirmOrder();
      handleFecthOrderTrack();
    }
    getBrnachs(true);
  }, [dateConfirmOrder]);

  useEffect(() => {
    fecthAllSupllyer();
  }, []);

  useEffect(() => {
    const updateHandler = (data) => {
      setStatus((prevStatus) =>
        prevStatus.map((item) =>
          item.id === data.id ? { ...item, ...data } : item,
        ),
      );
    };

    const responseHandler = (data) => {
      const confirmDate = new Date(data?.confirmDate);
      const orderDate = new Date(dateConfirmOrder?.orderDate);

      // Compare only YYYY-MM-DD
      const confirmDateStr = confirmDate.toISOString().split("T")[0];
      const orderDateStr = orderDate.toISOString().split("T")[0];

      if (confirmDateStr !== orderDateStr) {
        return console.log(
          "block this confirm order cause it's not the date",
          confirmDateStr,
          orderDateStr,
        );
      }
      setStatus((prev) => {
        const exists = prev.some((item) => item.id === data.id);
        if (exists) {
          return prev.map((item) =>
            item.id === data.id ? { ...item, ...data } : item,
          );
        } else {
          return [...prev, data];
        }
      });
    };

    socket.on("updateConfirmStatusOrder", updateHandler);
    socket.on("responeConfirmOrderCustomer", responseHandler);

    return () => {
      socket.off("updateConfirmStatusOrder", updateHandler);
      socket.off("responeConfirmOrderCustomer", responseHandler);
    };
  }, [socket, dateConfirmOrder]);

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
        <PrintCompo supplyerId={selectDateBrachCheck?.supplyerId}/>
        <SelectSupplyer setSelectDateBrachCheck={setSelectDateBrachCheck} supplyers={supplyers}/>
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography variant="Laotext" sx={{ fontSize: 20 }}>
          ລາຍລະອຽດອໍເດີປະຈຳວັນທີ{" "}
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
                  <TableCell align="right" sx={{ fontFamily: "Noto Sans Lao" }}>
                    ຈຳນວນລາຍການທີ່ແກ້ໄຂ
                  </TableCell>
                  <TableCell align="right" sx={{ fontFamily: "Noto Sans Lao" }}>
                    ສະຖານະ
                  </TableCell>

                  <TableCell align="right" sx={{ fontFamily: "Noto Sans Lao" }}>
                    ຈັດການ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterBranchs?.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontFamily: "Noto Sans Lao" }}
                    >
                      {row.branchname}
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const checkOrderWant = orderWantFilter.find(
                          (item) => item.branchId === row.id,
                        );
                        if (
                          !checkOrderWant ||
                          checkOrderWant.totalOrderWant === 0
                        ) {
                          return (
                            <Box>
                              <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
                                ບໍ່ມີການແກ້ໄຂ
                              </Typography>
                            </Box>
                          );
                        } else {
                          return (
                            <Box>
                              <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
                                {checkOrderWant.totalOrderWant}
                              </Typography>
                            </Box>
                          );
                        }
                      })()}
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const foundStatus = status.find(
                          (item) => item.branchId === row.id,
                        );
                        if (!foundStatus || foundStatus.status === false) {
                          return (
                            <Box>
                              <UnpublishedRoundedIcon
                                sx={{ color: colors.redAccent[300] }}
                              />
                            </Box>
                          );
                        } else {
                          return (
                            <Box>
                              {foundStatus.confirmStatus && (
                                <Tooltip
                                  title="ຢືນຢັນການແກ້ໄຂ"
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
                                  <AssignmentTurnedInIcon
                                    sx={{ color: colors.blueAccent[500] }}
                                  />
                                </Tooltip>
                              )}
                              <Tooltip
                                title="ສາຂາຢືນຢັນອໍເດີ"
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
                                <CheckCircleRoundedIcon
                                  sx={{ color: colors.greenAccent[300] }}
                                />
                              </Tooltip>
                            </Box>
                          );
                        }
                      })()}
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const foundStatus = status.find(
                          (item) => item.branchId === row.id,
                        );
                        if (!foundStatus || foundStatus.status === false) {
                          return <Box>-</Box>;
                        } else {
                          return (
                            <Box>
                              <Tooltip
                                title="ແກ້ໄຂສະຖານະກັບຄືນ"
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
                                <IconButton
                                  onClick={() =>
                                    handleChangeStatus(foundStatus?.id, false)
                                  }
                                  disabled={
                                    foundStatus?.confirmStatus ? true : false
                                  }
                                >
                                  <ChangeCircleIcon
                                    sx={{
                                      color: foundStatus?.confirmStatus
                                        ? "none"
                                        : colors.blueAccent[200],
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          );
                        }
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
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
    </Box>
  );
};

export default OrderUser;
