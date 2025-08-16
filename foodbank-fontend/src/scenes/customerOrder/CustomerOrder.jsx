import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import { getAllProduct } from "../../api/product";
import {
  checkConfirmOrderBranch,
  confirmOrderBranch,
  getOrderTrack,
  updateOrderNeed,
} from "../../api/preorder";
import { useSearchParams } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import DialogEditCustomerOrder from "./component/DialogEditCustomerOrder";
import { useSocket } from "../../../socket-io-provider/SocketProvider";
const URL =
  "https://treekoff-store-product-image.s3.ap-southeast-2.amazonaws.com";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const CustomerOrder = () => {
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const orderDate = searchParams.get("orderDate");
  const brachId = Number(searchParams.get("branchId"));
  const branchName = searchParams.get("branchName");
  const [products, setProducts] = React.useState([]);
  const [cheked, setChecked] = React.useState([]);
  const [orderCount, setOrderCount] = React.useState({});
  const [status, setStatus] = React.useState([]);
  const socket = useSocket();

  function formatDate(date) {
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  }
  const order = new Date(orderDate);
  const delivery = new Date(order); // copy the date
  const dayOfWeek = order.getDay(); // 0=Sun, 1=Mon, ..., 3=Wed, 6=Sat
  if (dayOfWeek === 6) {
    // Saturday
    delivery.setDate(order.getDate() + 4);
  } else if (dayOfWeek === 3) {
    // Wednesday
    delivery.setDate(order.getDate() + 3);
  } else {
    // Default
    delivery.setDate(order.getDate() + 3);
  }
  const readableOrderDate = formatDate(order);
  const readableDeliveryDate = formatDate(delivery);

  const filterProducts = products?.filter((product) => {
    const hasValidCategory = product.category?.name !== "ເຄື່ອງດື່ມ ແອວກໍຮໍ";

    const isAvailable =
      Array.isArray(product.available) &&
      product.available.some(
        (item) => item.aviableStatus === true && item.branchId === 1
      );

    return hasValidCategory && isAvailable;
  });

  const fecthProducts = async () => {
    try {
      const ress = await getAllProduct();
      setProducts(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fecthOrderTrack = async () => {
    try {
      const ress = await getOrderTrack({ orderDate, brachId });
      setChecked(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const checkConfirmOr = async () => {
    if (!orderDate || !brachId) return;

    try {
      const ress = await checkConfirmOrderBranch({ orderDate, brachId });
      setStatus(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSetOrderNeed = async (id) => {
    try {
      const prudctId = cheked?.find((item) => item.productsId === id);

      const ress = await updateOrderNeed(prudctId.id, {
        orderWant: orderCount[id],
      });
      setChecked((prev) =>
        prev.map((item) =>
          item.productsId === id ? { ...item, orderWant: orderCount[id] } : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (productId, value) => {
    setOrderCount((prev) => ({ ...prev, [productId]: value }));
  };

  const handleComfirmOrder = async () => {
    try {
      socket.emit("confirmOrderCustomer", {
        orderDate: orderDate,
        brachId: brachId,
      });
      //const ress = await confirmOrderBranch({ orderDate, brachId })
      //setStatus(ress.data)
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    fecthProducts();
    fecthOrderTrack();
    checkConfirmOr();
  }, []);

  React.useEffect(() => {
    const updateHandlers = (data) => {
      const confirmDate = new Date(data.confirmDate);
      const orderDate = new Date(order);

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box>
        <Box>
          <img
            src="/TK.png"
            alt="Logo"
            style={{
              height: 80,
              display: "block",
              margin: "5px auto",
            }}
          />
        </Box>
        <Box
          sx={{
            mx: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <Button
              endIcon={<CheckIcon />}
              variant="contained"
              type="submit"
              onClick={handleComfirmOrder}
              disabled={status?.status || cheked.length === 0 ? true : false}
              color="success"
              sx={{ fontFamily: "Noto Sans Lao", fontSize: 15 }}
            >
              ຢືນຢັນຈຳນວນ
            </Button>
          </Box>
          <Typography
            sx={{
              fontFamily: "Noto Sans Lao",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            ສາຂາ {branchName}
          </Typography>
          <Typography sx={{ fontFamily: "Noto Sans Lao", textAlign: "center" }}>
            ອໍເດີສັ່ງຮອບວັນທີ {readableOrderDate} ຮອບຈັດສົ່ງວັນທີ່
            {readableDeliveryDate}
          </Typography>
        </Box>
      </Box>
      {status?.status ? (
        <Box sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="LaoText">ຢືນຢັນຈຳນວນເບເກີລີ້ສຳເລັດ.</Typography>
        </Box>
      ) : (
        <Box sx={{ m: 1 }}>
          {/* 🟩 Responsive wrapper */}
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
                  {filterProducts.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">
                        {
                          <img
                            src={`${URL}/${row?.image}`}
                            alt={row.name}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
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
                        {cheked.find((item) => item.productsId === row.id)
                          ?.orderCount ?? "-"}
                      </TableCell>
                      <TableCell align="right">
                        {(() => {
                          const checkTrackOrder = cheked.find(
                            (item) => item.productsId === row.id
                          );

                          const productId = row.id;

                          // 👉 If no matching productId found, return nothing
                          if (!checkTrackOrder) return null;

                          if (checkTrackOrder.orderWant > 0) {
                            return (
                              <Box display="flex-row">
                                <span
                                  style={{
                                    color: colors.greenAccent[200],
                                    fontWeight: "bold",
                                    fontFamily: "Noto Sans Lao",
                                  }}
                                >
                                  ຈຳນວນ. ({checkTrackOrder.orderWant})
                                </span>
                                <DialogEditCustomerOrder
                                  orderTrackId={checkTrackOrder.id}
                                  fecthOrderTrack={fecthOrderTrack}
                                />
                              </Box>
                            );
                          } else {
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
                                  value={orderCount[productId] || ""}
                                  onChange={(e) =>
                                    handleChange(
                                      productId,
                                      Math.max(0, e.target.value)
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      handleSetOrderNeed(productId);
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
                                  onClick={() => handleSetOrderNeed(productId)}
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
  );
};

export default CustomerOrder;
