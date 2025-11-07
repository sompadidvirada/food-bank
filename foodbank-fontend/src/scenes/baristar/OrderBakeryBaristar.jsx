import React, { useEffect, useState } from "react";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import emptyGif from "/public/Order Update lodding.gif";
import { getOrderBaristar } from "../../api/baristar";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { tokens } from "../../theme";
import CheckIcon from "@mui/icons-material/Check";
import { useRef } from "react";
import ImageModal from "../../component/ImageModal";
import {
  checkConfirmOrderBranch,
  getOrderTrack,
  updateOrderNeed,
} from "../../api/preorder";
import DialogEditCustomerOrder from "../customerOrder/component/DialogEditCustomerOrder";
import CalendarOrderBaristar from "./component/CalendarOrderBaristar";
import CircularProgress from "@mui/material/CircularProgress";
import { useSocket } from "../../../socket-io-provider/SocketProvider";
const URL =
  "https://treekoff-store-product-image.s3.ap-southeast-2.amazonaws.com";

const URLSTAFF =
  "https://treekoff-store-staff-image.s3.ap-southeast-2.amazonaws.com";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

const OrderBakeryBaristar = () => {
  const user = useFoodBankStorage((s) => s.user);
  const token = useFoodBankStorage((s) => s.token);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [order, setOrder] = useState([]);
  const filteredOrders = order.filter((product) => {
    // Find the matching availability record for this user's branch
    const branchAvail = product.products.available?.find(
      (a) => a.branchId === user.userBranch
    );

    // Only keep if available and true
    return branchAvail?.aviableStatus === true;
  });
  const [orderCount, setOrderCount] = useState({});
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const [dateToGet, setDateToGet] = useState(
    dayjs().tz().startOf("day").toDate()
  );
  const imageModalRef = useRef();

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  function formatDate(date) {
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  }

  const delivery = new Date(dateToGet); // copy the date
  const dayOfWeek = dateToGet.getDay(); // 0=Sun, 1=Mon, ..., 3=Wed, 6=Sat
  if (dayOfWeek === 6) {
    // Saturday
    delivery.setDate(dateToGet.getDate() + 4);
  } else if (dayOfWeek === 3) {
    // Wednesday
    delivery.setDate(dateToGet.getDate() + 3);
  } else {
    // Default
    delivery.setDate(dateToGet.getDate() + 3);
  }
  const readableOrderDate = formatDate(dateToGet);
  const readableDeliveryDate = formatDate(delivery);

  const fecthOrder = async () => {
    setLoading(true);
    try {
      const ress = await getOrderBaristar(
        { orderDate: dateToGet, branchId: user.userBranch },
        token
      );
      setOrder(ress.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  console.log(filteredOrders);

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

  const checkConfirmOr = async () => {
    if (!dateToGet || !user?.userBranch) return;

    try {
      const ress = await checkConfirmOrderBranch({
        orderDate: dateToGet,
        brachId: user.userBranch,
      });
      setStatus(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComfirmOrder = async () => {
    try {
      socket.emit("confirmOrderCustomer", {
        orderDate: dateToGet,
        brachId: user.userBranch,
      });
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    const updateHandlers = (data) => {
      const confirmDate = new Date(data.confirmDate);
      const orderDate = new Date(dateToGet);

      // Compare only YYYY-MM-DD
      const confirmDateStr = confirmDate.toISOString().split("T")[0];
      const orderDateStr = orderDate.toISOString().split("T")[0];
      if (confirmDateStr !== orderDateStr) {
        return console.log("block this confirm order cause it's not the date");
      }
      setStatus(data);
    };
    socket.on("responeConfirmOrderCustomer", updateHandlers);
    return () => {
      socket.off("responeConfirmOrderCustomer", updateHandlers);
    };
  }, []);

  const handleSetOrderNeed = async (id, productId) => {
    try {
      const ress = await updateOrderNeed(id, {
        orderWant: orderCount[productId],
      });

      setOrder((prev) =>
        prev.map((item) =>
          item.productsId === productId
            ? { ...item, orderWant: orderCount[productId] }
            : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (productId, value) => {
    setOrderCount((prev) => ({ ...prev, [productId]: value }));
  };

  useEffect(() => {
    fecthOrder();
    checkConfirmOr();
  }, [token, dateToGet]);

  return (
    <>
      {/* User Avatar */}
      <Box
        sx={{
          top: 20,
          left: 20,
          display: "flex",
          alignItems: "center",
          gap: 1,
          zIndex: 1000,
        }}
      >
        <img
          src={`${URLSTAFF}/${user?.image}`}
          alt="User Avatar"
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
          <Typography
            sx={{
              fontFamily: "Noto Sans Lao",
              fontSize: 18,
              color: "#ffffffaf",
              fontWeight: 500,
            }}
          >
            {user?.branchName}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Noto Sans Lao",
              fontSize: 12,
              color: "#f7f7f7a1",
            }}
          >
            {user?.firstname} {user?.lastname}
          </Typography>
        </Box>
      </Box>{" "}
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
          {" "}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ my: 2 }}>
              <CalendarOrderBaristar
                setDateToGet={setDateToGet}
                dateToGet={dateToGet}
              />
            </Box>
            <Box>
              <Button
                endIcon={<CheckIcon />}
                variant="contained"
                type="submit"
                onClick={handleComfirmOrder}
                disabled={status?.status || order.length === 0 ? true : false}
                color="success"
                sx={{ fontFamily: "Noto Sans Lao", fontSize: 15 }}
              >
                ຢືນຢັນຈຳນວນ
              </Button>
            </Box>
            {filteredOrders?.length <= 0 ? (
              <Box sx={{ my: 8, display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontFamily: "Noto Sans Lao", fontSize: 25 }}>
                  ຍັງບໍ່ມີອໍເດີເບເກີລີ..
                </Typography>
                <img
                  src={emptyGif}
                  alt="No deliveries"
                  style={{ width: 250 }}
                />
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    sx={{ fontFamily: "Noto Sans Lao", textAlign: "center" }}
                  >
                    ອໍເດີສັ່ງຮອບວັນທີ {readableOrderDate} ຮອບຈັດສົ່ງວັນທີ່
                    {readableDeliveryDate}
                  </Typography>
                </Box>
                <Box sx={{ overflowX: "auto" }}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 200 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontFamily: "Noto Sans Lao" }}>
                            ຊື່ລາຍການ
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontFamily: "Noto Sans Lao" }}
                          >
                            ຮູບ
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontFamily: "Noto Sans Lao" }}
                          >
                            ສັ່ງລົງ
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontFamily: "Noto Sans Lao" }}
                          >
                            ຕ້ອງການ
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredOrders?.map((row) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row?.products?.name}
                            </TableCell>
                            <TableCell align="right">
                              {
                                <img
                                  src={`${URL}/${row?.products?.image}`}
                                  alt={row.name}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleImageClick(
                                      `${URL}/${row?.products.image}`
                                    )
                                  }
                                />
                              }
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                width: 120,
                                fontFamily: "Noto Sans Lao",
                                fontSize: 20,
                                color: colors.greenAccent[400],
                              }}
                            >
                              {row?.orderCount ? row.orderCount : "-"}
                            </TableCell>
                            <TableCell align="right">
                              {(() => {
                                // 👉 If no matching productId found, return nothing
                                if (row?.orderCount <= 0) return null;

                                if (row?.orderWant > 0) {
                                  return (
                                    <Box display="flex-row">
                                      <span
                                        style={{
                                          color: colors.greenAccent[200],
                                          fontWeight: "bold",
                                          fontFamily: "Noto Sans Lao",
                                        }}
                                      >
                                        ຈຳນວນ. ({row?.orderWant})
                                      </span>
                                      {status?.status !== true && (
                                        <DialogEditCustomerOrder
                                          orderTrackId={row.id}
                                          fecthOrderTrack={fecthOrder}
                                        />
                                      )}
                                    </Box>
                                  );
                                } else if (status?.status !== true) {
                                  return (
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        justifyContent: "end",
                                      }}
                                    >
                                      <input
                                        type="number"
                                        min="0"
                                        value={
                                          orderCount[row?.productsId] || ""
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            row?.productsId,
                                            Math.max(0, e.target.value)
                                          )
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter")
                                            handleSetOrderNeed(
                                              row.id,
                                              row.productsId
                                            );
                                          if (
                                            e.key === "ArrowUp" ||
                                            e.key === "ArrowDown"
                                          )
                                            e.preventDefault(); // Prevent up/down arrows
                                        }}
                                        onWheel={(e) => e.target.blur()} // Prevent scroll
                                        style={{
                                          width: "40px",
                                          padding: "5px",
                                          borderRadius: "4px",
                                          border: "1px solid #ccc",
                                          textAlign: "center",
                                          appearance: "textfield",
                                          MozAppearance: "textfield",
                                          WebkitAppearance: "none",
                                          fontSize: "16px",
                                        }}
                                      />
                                      <button
                                        onClick={() =>
                                          handleSetOrderNeed(
                                            row.id,
                                            row.productsId
                                          )
                                        }
                                        style={{
                                          background: "#4CAF50",
                                          color: "white",
                                          border: "none",
                                          padding: "5px 10px",
                                          cursor: "pointer",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        ✔
                                      </button>
                                    </div>
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
              </Box>
            )}
          </Box>
        </>
      )}
      {/** image modal */}
      <ImageModal ref={imageModalRef} />
    </>
  );
};

export default OrderBakeryBaristar;
