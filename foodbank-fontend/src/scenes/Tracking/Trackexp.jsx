import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import { tokens } from "../../theme";
import CalendarExp from "./component/CalendarExp";
import SelectBranch from "./component/SelectBranch";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { toast, ToastContainer } from "react-toastify";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import {
  checkTrackExp,
  checkTrackSell,
  checkTrackSend,
  deleteTrackExp,
  deleteTrackSell,
  deleteTrackSend,
  insertTrackExp,
  insertTracksell,
  insertTracksend,
} from "../../api/tracking";
import DialogEditSend from "./component/DialogEditSend";
import DialogEditExp from "./component/DialogEditExp";
const URL =
  "https://treekoff-store-product-image.s3.ap-southeast-2.amazonaws.com";

const Trackexp = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useFoodBankStorage((state) => state.user);
  const token = useFoodBankStorage((state) => state.token);
  const products = useFoodBankStorage((state) => state.products);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [checked, setChecked] = useState(null);
  const [selectFormtracksell, setSelectFormtracksell] = useState({
    expCount: "",
    expAt: "",
    userId: user.id,
    productId: "",
    brachId: "",
  });
  const [selectDateBrachCheck, setSelectDateBrachCheck] = useState({
    expDate: "",
    brachId: "",
  });
  const [expCounts, setSellCounts] = useState({});

  {
    /** column for DataGrid  */
  }

  const columns = [
    { field: "id", headerName: "ໄອດີ", flex: 0.2 },
    {
      field: "image",
      headerName: "ຮູບພາບ",
      flex: 0.2,
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
      type: "text",
      headerAlign: "left",
      align: "left",
      cellClassName: "name-column--cell",
      flex: 0.5,
      renderCell: (params) => (
        <Typography
          variant="laoText"
          fontWeight="bold"
          color={colors.grey[100]}
        >
          {params?.value}
        </Typography>
      ),
    },
    {
      field: "manage",
      headerName: "ຈຳນວນທີ່ໄດ້ໝົດອາຍຸ",
      flex: 0.5,
      renderCell: (params) => {
        const productId = params.row.id;

        // Find the tracked product in `checked`
        const trackedProduct = checked?.find(
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
                ຍອດທີ່ບັນທຶກ. ({trackedProduct.expCount})
              </span>
              <DialogEditExp
                trackedProduct={trackedProduct}
                selectFormtracksell={selectFormtracksell}
                setSelectFormtracksell={setSelectFormtracksell}
                fetchDateBrachCheck={fetchDateBrachCheck}
              />
            </Box>
          );
        } else {
          return (
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <input
                type="number"
                min="0"
                value={expCounts[productId] || ""}
                onChange={(e) =>
                  handleChange(productId, Math.max(0, e.target.value))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSetExpCount(productId);
                  if (e.key === "ArrowUp" || e.key === "ArrowDown")
                    e.preventDefault(); // Prevent up/down arrows
                }}
                onWheel={(e) => e.target.blur()} // Prevent scroll
                style={{
                  width: "60px",
                  padding: "5px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  textAlign: "center",
                  appearance: "textfield", // Hides arrows in most browsers
                  MozAppearance: "textfield", // Hides arrows in Firefox
                  WebkitAppearance: "none", // Hides arrows in WebKit browsers (Chrome, Safari)
                }}
              />
              <button
                onClick={() => handleSetExpCount(productId)}
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
      },
    },
    {
      field: "category",
      headerName: "ໝວດໝູ່",
      type: "text",
      headerAlign: "left",
      flex: 0.5,
      align: "left",
      renderCell: (params) => {
        return params.row.category ? (
          <Typography
            variant="laoText"
            fontWeight="bold"
            color={colors.grey[100]}
          >
            {params.row.category.name}
          </Typography>
        ) : (
          "No Category"
        );
      },
    },
    {
      field: "price",
      type: "number",
      headerName: "ລາຄາຕົ້ນທືນ",
      flex: 0.5,
    },
    {
      field: "sellprice",
      type: "number",
      headerName: "ລາຄາຂາຍ",
      flex: 0.5,
    },
  ];

  {
    /** function insert tracking to database */
  }

  const handleSetExpCount = async (productId) => {
    if (!expCounts[productId]) return; // Prevent empty values

    if (
      selectFormtracksell.expAt === "" ||
      selectFormtracksell.brachId === ""
    ) {
      return;
    }

    const updatedForm = {
      ...selectFormtracksell,
      productId,
      expCount: expCounts[productId],
    };

    setSelectFormtracksell(updatedForm);
    try {
      const ress = await insertTrackExp(updatedForm, token);

      // **Update checked state with new entry**
      setChecked((prevChecked) => [
        ...prevChecked,
        { productsId: productId, expCount: expCounts[productId] },
      ]);

      // Reset input field after submission
      setSellCounts((prev) => ({ ...prev, [productId]: "" }));
    } catch (err) {
      console.log(err);
    }
  };

  {
    /**function delete all the tracking from the date user selected */
  }

  const handeDeleteAll = async () => {
    try {
      const ress = await deleteTrackExp(selectDateBrachCheck, token);
      fetchDateBrachCheck();
    } catch (err) {
      console.log(err);
      toast.error("error");
    }
  };

  {
    /** function open modal image  */
  }
  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpenImageModal(true);
  };
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl(null);
  };

  {
    /** fucntion fecth the tracking from the database */
  }
  const fetchDateBrachCheck = async () => {
    // Ensure that both branch ID and sell date are available
    if (selectDateBrachCheck.brachId && selectDateBrachCheck.expDate) {
      try {
        const res = await checkTrackExp(selectDateBrachCheck, token);
        setChecked(res.data);
      } catch (error) {
        console.error("Error fetching branch check:", error);
      }
    }
  };

  {
    /**running the function event to fecth the tracking data from database */
  }

  useEffect(() => {
    fetchDateBrachCheck();
  }, [selectDateBrachCheck.brachId, selectDateBrachCheck.expDate]);

  {
    /** function handlechange for input insert tracking*/
  }

  const handleChange = (productId, value) => {
    setSellCounts((prev) => ({ ...prev, [productId]: value }));
  };

  return (
    <Box m="20px">
      <Header title="ຄີຍອດໝົດອາຍຸແຕ່ລະສາຂາ" />
      <Box
        mt="30px"
        display="grid"
        gridTemplateColumns="repeat(1, 20fr)"
        gridAutoRows="60px"
        gap="20px"
      >
        {/** Section 1  select calendar and select branches. */}

        <Box gridColumn="span 1" backgroundColor={colors.primary[400]}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="20px"
          >
            <Box>
              <CalendarExp
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
              />
            </Box>
            <Box>
              <Button variant="contained" onClick={handeDeleteAll} color="error">
                <Typography variant="laoText"> ລ້າງຂໍມູນທີ່ຄີມື້ນິ້</Typography>
              </Button>
            </Box>
          </Box>
        </Box>

        {/**Section 2 insert data */}

        <Box
          sx={{
            height: "100vh",
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
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          {selectFormtracksell.expAt && selectFormtracksell.brachId ? (
            <DataGrid
              rows={products?.filter((product) =>
                product.available?.some(
                  (item) =>
                    item.aviableStatus === true &&
                    item.branchId === selectFormtracksell.brachId
                )
              )}
              columns={columns}
              autoHeight
              hideFooter
              sx={{
                width: "100%",
                "& .MuiDataGrid-columnHeaders": {
                  fontFamily: "Noto Sans Lao",
                  fontWeight: "bold", // optional
                  fontSize: "16px", // optional
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
      </Box>
      {/** image modal */}
      <Dialog
        open={openImageModal}
        onClose={handleCloseImageModal}
        maxWidth="md"
      >
        <DialogContent sx={{ position: "relative", padding: "0" }}>
          <IconButton
            onClick={handleCloseImageModal}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "white",
              "&:hover": { backgroundColor: "gray" },
            }}
          >
            <CloseIcon sx={{ color: "black" }} />
          </IconButton>
          {selectedImageUrl && (
            <img
              src={selectedImageUrl}
              alt="Large Preview"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* Snackbar for success message */}

      <ToastContainer position="top-center" />
    </Box>
  );
};

export default Trackexp;
