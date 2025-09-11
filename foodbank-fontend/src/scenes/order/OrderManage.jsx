import React, { useEffect, useRef, useState } from "react";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../component/Header";
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import CheckIcon from "@mui/icons-material/Check";
import SelectBranch from "../Tracking/component/SelectBranch";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import CloseIcon from "@mui/icons-material/Close";
import AddLinkIcon from "@mui/icons-material/AddLink";
import CalendarOrder from "./component/CalendarOrder";
import {
  checkConfirmOrderBranch,
  checkTrackOrder,
  confirmOrderBranch,
  confirmOrderChange,
  deleteOrderTrack,
  getOrderTrack,
  getPreviousOrderTrack,
  insertOrder,
} from "../../api/preorder";
import { toast } from "react-toastify";
import DialogOrder from "./component/DialogOrder";
import { useSocket } from "../../../socket-io-provider/SocketProvider";
import ImageModal from "../../component/ImageModal";
const URL =
  "https://treekoff-store-product-image.s3.ap-southeast-2.amazonaws.com";

const URLCUSTOMER = "https://treekoff.store/customerorder";

const OrderManage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const products = useFoodBankStorage((state) => state.products);
  const socket = useSocket();
  const user = useFoodBankStorage((state) => state.user);
  const token = useFoodBankStorage((state) => state.token);
  const [checked, setChecked] = useState(null);
  const [checkedOrder, setCheckedOrder] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [status, setStatus] = useState(null);
  const [previousOrderTrack, setPreviousOrderTrack] = useState([]);
  const [selectFormtracksell, setSelectFormtracksell] = useState({
    orderCount: "",
    orderDate: "",
    userId: user.id,
    productId: "",
    brachId: "",
  });
  const [allowedd, setAllowedd] = useState(false);
  const [selectDateBrachCheck, setSelectDateBrachCheck] = useState({
    orderDate: "",
    brachId: "",
  });
  const result = checked?.map((item) => ({
    ...item,
    totalSend: item.week1Send + item.week2Send + item.week3Send,
    totalSell: item.week1Sell + item.week2Sell + item.week3Sell,
    totalExp: item.week1Exp + item.week2Exp + item.week3Exp,
  }));

  const fecthPreviousOrderTrack = async () => {
    try {
      const ress = await getPreviousOrderTrack(selectDateBrachCheck, token);
      setPreviousOrderTrack(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const date = new Date(selectDateBrachCheck?.orderDate);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

  const imageModalRef = useRef();

  console.log(previousOrderTrack);

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };
  const columns = [
    { field: "id", headerName: "ໄອດີ", width: 90 },
    {
      field: "image",
      headerName: "ຮູບພາບ",
      width: 72,
      renderCell: (params) => {
        const imageUrl = params.row.image
          ? `${URL}/${params.row?.image}`
          : null;
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => handleImageClick(imageUrl)}
          />
        ) : (
          <span>No Image</span>
        );
      },
    },
    {
      field: "name",
      headerName: "ຊື່ສິນຄ້າ",
      width: 180,
      renderCell: ({ row }) => (
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          height="100%"
          sx={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <Typography
            fontSize={12}
            fontFamily="Noto Sans Lao"
            color={colors.grey[100]}
            sx={{
              whiteSpace: "normal",
              wordBreak: "break-word", // breaks long words too
            }}
          >
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "orderWant",
      headerName: "ຍອດສັ່ງ",
      type: "number",
      sortable: false,
      width: 150,
      renderCell: (params) => {
        const productId = params.row.id;
        // Find the tracked product in `checkedOrder`
        const trackedProduct = checkedOrder?.find(
          (item) => item?.productsId === productId
        );
        if (trackedProduct) {
          return (
            <Box display="flex-row">
              <span
                style={{
                  color: colors.greenAccent[200],
                  fontWeight: "bold",
                  fontFamily: "Noto Sans Lao",
                }}
              >
                ຈຳນວນ. ({trackedProduct?.orderCount})
              </span>
              <DialogOrder
                trackedProduct={trackedProduct}
                selectFormtracksell={selectFormtracksell}
                setSelectFormtracksell={setSelectFormtracksell}
                fetchDateBrachCheck={fetchDateBrachCheck}
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
                justifyContent: "center",
                height: "100%",
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSetOrder(productId, e.currentTarget);
                }}
                style={{ display: "flex", gap: "5px", alignItems: "center" }}
              >
                <input
                  type="number"
                  min="0"
                  name={`orderSet-${productId}`} // important for FormData
                  defaultValue=""
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown")
                      e.preventDefault();
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  style={{
                    width: "60px",
                    padding: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    textAlign: "center",
                  }}
                />
                <button
                  type="submit"
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
              </form>
            </div>
          );
        }
      },
    },
    {
      field: "orderNeed",
      headerName: "ຍອດຕ້ອງການ",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = checkedOrder?.find(
          (item) => item?.productsId === productId
        );
        if (
          trackedProduct &&
          trackedProduct.orderWant !== 0 &&
          trackedProduct.orderWant !== trackedProduct.orderCount
        ) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.blueAccent[300]}
              textAlign={"center"}
            >
              {trackedProduct?.orderWant}
            </Typography>
          );
        } else {
          return <Box textAlign={"center"}>.</Box>;
        }
      },
    },
    {
      field: "previousOrder",
      headerName: "ຍອດທີ່ສັ່ງກ່ອນໜ້າ",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = previousOrderTrack?.find(
          (item) => item?.productsId === productId
        );
        if (trackedProduct) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.blueAccent[200]}
              textAlign={"center"}
            >
              {trackedProduct?.orderCount}
            </Typography>
          );
        } else {
          return <Box textAlign={"center"}>.</Box>;
        }
      },
    },
    {
      field: "orderwant12",
      sortable: false,
      renderHeader: () => (
        <span
          style={{
            color: colors.redAccent[200],
          }}
        >
          ຈຳນວນທີ່ຄວນສັ່ງ
        </span>
      ),
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = result?.find(
          (item) => item?.productId === productId
        );

        if (!trackedProduct) return <Box>No Data</Box>;

        let value;
        let highlight = false; // Track if +3 was applied

        if (dayName === "Saturday") {
          value = (trackedProduct.totalSell / 10) * 3;
        } else if (dayName === "Wednesday") {
          value = (trackedProduct.totalSell / 11) * 4;
        } else {
          return <Box>No Data</Box>;
        }

        // Add 3 if totalSell >= totalSend
        if (trackedProduct.totalSell > trackedProduct.totalSend) {
          value += 2;
          highlight = true; // Mark this case
        }

        return (
          <Typography
            fontFamily={"Noto Sans Lao"}
            color={highlight ? colors.redAccent[400] : colors.greenAccent[400]} // change color if +3
          >
            {highlight ? `${value.toFixed(2)} (+2)` : value.toFixed(2)}
          </Typography>
        );
      },
    },
    {
      field: "w1send",
      renderHeader: () => (
        <span
          style={{
            color: colors.blueAccent[400],
          }}
        >
          ຍອດສັ່ງ W1
        </span>
      ),
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = checked?.find(
          (item) => item?.productId === productId
        );
        if (trackedProduct) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.blueAccent[400]}
            >
              {trackedProduct?.week1Send}
            </Typography>
          );
        } else {
          return <Box>No Data</Box>;
        }
      },
    },
    {
      field: "w1sell",
      renderHeader: (params) => (
        <span
          style={{
            color: colors.greenAccent[400],
          }}
        >
          ຍອດຂາຍ W1
        </span>
      ),
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = checked?.find(
          (item) => item?.productId === productId
        );
        if (trackedProduct) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.greenAccent[400]}
            >
              {trackedProduct?.week1Sell}
            </Typography>
          );
        } else {
          return <Box>No Data</Box>;
        }
      },
    },
    {
      field: "w1exp",
      renderHeader: () => (
        <span
          style={{
            color: colors.redAccent[400],
          }}
        >
          ຍອດໝົດອາຍຸ W1
        </span>
      ),
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = checked?.find(
          (item) => item?.productId === productId
        );
        if (trackedProduct) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.redAccent[400]}
            >
              {trackedProduct?.week1Exp}
            </Typography>
          );
        } else {
          return <Box>No Data</Box>;
        }
      },
    },
    {
      field: "w2Send",
      renderHeader: () => (
        <span
          style={{
            color: colors.blueAccent[400],
          }}
        >
          ຍອດສັ່ງ W2
        </span>
      ),
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = checked?.find(
          (item) => item?.productId === productId
        );
        if (trackedProduct) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.blueAccent[400]}
            >
              {trackedProduct?.week2Send}
            </Typography>
          );
        } else {
          return <Box>No Data</Box>;
        }
      },
    },
    {
      field: "w2Sell",
      renderHeader: () => (
        <span
          style={{
            color: colors.greenAccent[400],
          }}
        >
          ຍອດຂາຍ W2
        </span>
      ),
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = checked?.find(
          (item) => item?.productId === productId
        );
        if (trackedProduct) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.greenAccent[400]}
            >
              {trackedProduct?.week2Sell}
            </Typography>
          );
        } else {
          return <Box>No Data</Box>;
        }
      },
    },
    {
      field: "w2exp",
      renderHeader: () => (
        <span
          style={{
            color: colors.redAccent[400],
          }}
        >
          ຍອດໝົດອາຍຸ W2
        </span>
      ),
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = checked?.find(
          (item) => item?.productId === productId
        );
        if (trackedProduct) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.redAccent[400]}
            >
              {trackedProduct?.week2Exp}
            </Typography>
          );
        } else {
          return <Box>No Data</Box>;
        }
      },
    },
    {
      field: "w3Send",
      renderHeader: () => (
        <span
          style={{
            color: colors.blueAccent[400],
          }}
        >
          ຍອດສັ່ງ W3
        </span>
      ),
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = checked?.find(
          (item) => item?.productId === productId
        );
        if (trackedProduct) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.blueAccent[400]}
            >
              {trackedProduct?.week3Send}
            </Typography>
          );
        } else {
          return <Box>No Data</Box>;
        }
      },
    },
    {
      field: "w3Sell",
      renderHeader: () => (
        <span
          style={{
            color: colors.greenAccent[400],
          }}
        >
          ຍອດຂາຍ W3
        </span>
      ),
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = checked?.find(
          (item) => item?.productId === productId
        );
        if (trackedProduct) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.greenAccent[400]}
            >
              {trackedProduct?.week3Sell}
            </Typography>
          );
        } else {
          return <Box>No Data</Box>;
        }
      },
    },
    {
      field: "w3exp",
      renderHeader: () => (
        <span
          style={{
            color: colors.redAccent[400],
          }}
        >
          ຍອດໝົດອາຍຸ W3
        </span>
      ),
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const productId = params.row.id;
        const trackedProduct = checked?.find(
          (item) => item?.productId === productId
        );
        if (trackedProduct) {
          return (
            <Typography
              fontFamily={"Noto Sans Lao"}
              color={colors.redAccent[400]}
            >
              {trackedProduct?.week3Exp}
            </Typography>
          );
        } else {
          return <Box>No Data</Box>;
        }
      },
    },
  ];

  const handeDeleteAll = async () => {
    try {
      const ress = await deleteOrderTrack(selectDateBrachCheck, token);
      toast.success("ລ້າງຂໍມູນອໍເດີສຳເລັດ.");
      fetchDateBrachCheck();
    } catch (err) {
      console.log(err);
    }
  };
  const fecthconfirmOrder = async () => {
    if (!selectDateBrachCheck.orderDate) return;
    try {
      const ress = await checkConfirmOrderBranch(selectDateBrachCheck);
      setStatus(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDateBrachCheck = async () => {
    if (selectDateBrachCheck.brachId && selectDateBrachCheck.orderDate) {
      try {
        const res = await checkTrackOrder(selectDateBrachCheck, token);
        setChecked(res.data);

        const ress = await getOrderTrack(selectDateBrachCheck);
        setCheckedOrder(ress.data);

        // ✅ Set false only when no error occurs
        setAllowedd(false);
      } catch (error) {
        console.error("Error fetching branch check:", error);

        const isWedSatError =
          error?.response?.data?.message ===
          "Only Wednesday or Saturday allowed.";

        if (isWedSatError) {
          setAllowedd(true); // ✅ set true if specific error
        } else {
          setAllowedd(false); // ✅ optional: reset to false if other errors
        }

        toast.error("ສ້າງຍອດສັ່ງໄດ້ສະເພາະວັນ ພຸດ - ເສົາ");
      }
    }
  };

  useEffect(() => {
    if (selectDateBrachCheck.brachId && selectDateBrachCheck.orderDate) {
      fetchDateBrachCheck();
      fecthconfirmOrder();
      fecthPreviousOrderTrack();
    }
  }, [selectDateBrachCheck.brachId, selectDateBrachCheck.orderDate]);

  const handleSetOrder = async (productId, countOrForm) => {
    const formData = new FormData(countOrForm);
    const rawValue = formData.get(`orderSet-${productId}`);

    const countToUse = rawValue ? parseInt(rawValue, 10) : 0;

    if (!countToUse) return toast.error(`ກະລຸນາເພີ່ມຈຳນວນກ່ອນ.`);
    if (
      selectFormtracksell.orderDate === "" ||
      selectFormtracksell.brachId === ""
    ) {
      toast.error("ລອງໃຫ່ມພາຍຫຼັງ");
      return;
    }
    try {
      const updatedForm = {
        ...selectFormtracksell,
        productId,
        orderCount: countToUse,
      };
      const ress = await insertOrder(updatedForm, token);

      setCheckedOrder((prevCheckedOrder) => [...prevCheckedOrder, ress.data]);
      countOrForm.reset();
    } catch (err) {
      console.log(err);
    }
  };

  function generateOrderUrl(baseUrl, orderDate, branchId, branchName) {
    const params = new URLSearchParams({
      orderDate, // should be in YYYY-MM-DD format
      branchId,
      branchName,
    });
    return `${baseUrl}?${params.toString()}`;
  }
  const handleCreateLink = () => {
    const url = generateOrderUrl(
      URLCUSTOMER,
      selectDateBrachCheck?.orderDate,
      selectDateBrachCheck?.brachId,
      branchName
    );

    // Copy to clipboard
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success(`ກ໋ອປປີ້ລີ້ງສຳເລັດ.`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  const handleConfirmOrderChange = async (statuss) => {
    try {
      socket.emit("confirmOrderByAdmin", {
        id: status.id,
        status: statuss,
      });
      //const ress = await confirmOrderChange(
      //status.id,
      //{ status: statuss },
      //token
      //);
      //setStatus(ress.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const updateHandler = (data) => {
      setStatus(data);
    };

    socket.on("updateConfirmStatusOrder", (data) => {
      setStatus(data);
    });
    socket.on("responeConfirmOrderCustomer", updateHandler);

    return () => {
      socket.off("updateConfirmStatusOrder");
      socket.off("updateConfirmStatusOrder", updateHandler);
    };
  }, []);

  return (
    <Box m="20px">
      <Header title="ຈັດການການສັ່ງຊຶ້ເບເກີລີ້" />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="20px"
      >
        <Box>
          <CalendarOrder
            selectFormtracksell={selectFormtracksell}
            setSelectFormtracksell={setSelectFormtracksell}
            setSelectDateBrachCheck={setSelectDateBrachCheck}
          />
        </Box>
        <Box>
          <SelectBranch
            selectFormtracksell={selectFormtracksell}
            setSelectFormtracksell={setSelectFormtracksell}
            setSelectDateBrachCheck={setSelectDateBrachCheck}
            setBranchName={setBranchName}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={handeDeleteAll}
            color="error"
            disabled={
              selectFormtracksell?.orderDate &&
              selectFormtracksell?.brachId &&
              checkedOrder.length !== 0 &&
              status.confirmStatus !== true
                ? false
                : true
            }
          >
            <Typography variant="laoText">ລ້າງຂໍມູນທີ່ຄີມື້ນິ້</Typography>
          </Button>
        </Box>
        <Box>
          {status?.confirmStatus ? (
            <Button
              variant="contained"
              color="error"
              startIcon={<NewReleasesIcon />}
              sx={{ fontFamily: "Noto Sans Lao" }}
              onClick={() => handleConfirmOrderChange(false)}
            >
              ຍົກເລີກສະຖານະ
            </Button>
          ) : (
            <Button
              variant="contained"
              color="info"
              startIcon={<CheckIcon />}
              sx={{ fontFamily: "Noto Sans Lao" }}
              disabled={status?.status ? false : true}
              onClick={() => handleConfirmOrderChange(true)}
            >
              ຢືນຢັນອໍເດີສາຂາ
            </Button>
          )}
        </Box>
        <Box>
          <Button
            variant="contained"
            color="info"
            startIcon={<AddLinkIcon />}
            disabled={
              selectFormtracksell?.orderDate && selectFormtracksell?.brachId
                ? false
                : true
            }
            onClick={handleCreateLink}
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 15 }}
          >
            ກ໋ອປປີ້ລີ້ງຍອດສັ່ງສາຂາ
          </Button>
        </Box>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        {selectFormtracksell?.orderDate &&
        selectFormtracksell?.brachId &&
        !allowedd ? (
          <DataGrid
            rows={products?.filter((product) => {
              const hasValidCategory =
                product.category?.name !== "ເຄື່ອງດື່ມ ແອວກໍຮໍ";

              const isAvailable =
                Array.isArray(product.available) &&
                product.available.some(
                  (item) => item.aviableStatus === true && item.branchId === 1
                );

              return hasValidCategory && isAvailable;
            })}
            columns={columns}
            hideFooter
            autoHeight
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                fontFamily: "Noto Sans Lao",
                fontWeight: "bold", // optional
                fontSize: "12px", // optional
              },
            }}
          />
        ) : (
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Typography
              variant="laoText"
              fontWeight="bold"
              color={colors.grey[100]}
            >
              "ເລືອກວັນທີ່ ແລະ ສາຂາທີ່ຕ້ອງການເພີ່ມຂໍ້ມູນ"
            </Typography>
          </Box>
        )}
      </Box>
      {/** image modal */}
      <ImageModal ref={imageModalRef} />
    </Box>
  );
};

export default OrderManage;
