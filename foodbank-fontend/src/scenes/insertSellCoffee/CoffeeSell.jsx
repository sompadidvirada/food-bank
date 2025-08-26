import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import Header from "../component/Header";
import { tokens } from "../../theme";
import { toast } from "react-toastify";
import { useState } from "react";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import CloseIcon from "@mui/icons-material/Close";
import { getCoffeeMenu } from "../../api/coffeeMenu";
import { useEffect } from "react";
import CalendarCoffeeSell from "./component/CalendarCoffeeSell";
import SelectBracnhCoffeeSell from "./component/SelectBracnhCoffeeSell";
import { DataGrid } from "@mui/x-data-grid";
import {
  checkCoffeeSell,
  deleteAllCoffeeSell,
  insertCoffeeSell,
} from "../../api/coffeeSell";
import EditCoffeeSell from "./component/EditCoffeeSell";
import UploadFile from "./component/UploadFile";
const URL =
  "https://treekoff-storage-coffee-menu.s3.ap-southeast-2.amazonaws.com";

const CoffeeSell = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [coffeeMenu, setCoffeeMenu] = useState([]);
  const [checked, setChecked] = useState([]);
  const [sendCounts, setSendCounts] = useState({});
  const [selectFormtracksend, setSelectFormtracksend] = useState({
    coffeeMenuId: "",
    sellCount: "",
    sellDate: "",
    brachId: "",
  });
  const [selectDateBrachCheck, setSelectDateBrachCheck] = useState({
    sellDate: "",
    brachId: "",
  });

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpenImageModal(true);
  };
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl(null);
  };

  const fecthCoffeeMenu = async () => {
    try {
      const ress = await getCoffeeMenu(token);
      setCoffeeMenu(ress.data);
    } catch (err) {
      console.log(err);
      toast.error(`erorr.`);
    }
  };

  const fecthCoffeeSell = async () => {
    try {
      const ress = await checkCoffeeSell(selectDateBrachCheck, token);
      setChecked(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSetSell = async (
    menuId,
    count = null,
    productOverride = null
  ) => {
    const countToUse = count !== null ? count : sendCounts[menuId];

    if (
      selectFormtracksend.sellDate === "" ||
      selectFormtracksend.brachId === ""
    ) {
      return;
    }

    // get product (either from override or lookup)
    const menu = productOverride || coffeeMenu.find((p) => p.id === menuId);

    if (!menu) {
      console.warn(`⚠️ Product with ID ${menuId} not found`);
      return;
    }

    const updatedForm = {
      ...selectFormtracksend,
      coffeeMenuId: menu.id,
      sellCount: countToUse,
    };
    try {
      const ress = await insertCoffeeSell(updatedForm, token);
      setChecked((prev) => [...prev, ress.data]);
      setSendCounts((prev) => ({ ...prev, [menuId]: "" }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (menuId, value) => {
    setSendCounts((prev) => ({ ...prev, [menuId]: value }));
  };

  useEffect(() => {
    if (selectDateBrachCheck.sellDate && selectDateBrachCheck.brachId) {
      fecthCoffeeSell();
    }
    fecthCoffeeMenu();
  }, [token, selectDateBrachCheck]);

  const handleDeleteAll = async () => {
    try {
      const ress = await deleteAllCoffeeSell(selectDateBrachCheck, token);
      setChecked([]);
      toast.success(`ລ້າງຂໍ້ມູນສຳເລັດ.`);
    } catch (err) {
      console.log(err);
      toast.error(`ລອງໃຫ່ມພາຍຫຼັງ.`);
    }
  };

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
      width: 180,
      renderCell: (params) => {
        return (
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
              fontSize={14}
              color={colors.grey[100]}
              sx={{
                fontFamily: "Noto Sans Lao",
                whiteSpace: "normal",
                wordBreak: "break-word", // breaks long words too
              }}
            >
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "size",
      headerName: "ຂະໜາດຈອກ",
      type: "text",
      headerAlign: "left",
      align: "left",
      width: 180,
      renderCell: (params) => {
        return (
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
              fontSize={14}
              color={colors.grey[100]}
              sx={{
                fontFamily: "Noto Sans Lao",
                whiteSpace: "normal",
                wordBreak: "break-word", // breaks long words too
              }}
            >
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "manage",
      headerName: "ຈຳນວນທີ່ໄດ້ຂາຍ",
      flex: 0.5,
      renderCell: (params) => {
        const menuId = params.row.id;

        // Find the tracked menu ID in `checked`
        const trackedProduct = checked?.find(
          (item) => item?.coffeeMenuId === menuId
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
                ຍອດທີ່ບັນທືກ. ({trackedProduct.sellCount})
              </span>
              <EditCoffeeSell
                trackedProduct={trackedProduct}
                setChecked={setChecked}
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
              <input
                type="number"
                min="0"
                value={sendCounts[menuId] || ""}
                onChange={(e) =>
                  handleChange(menuId, Math.max(0, e.target.value))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSetSell(menuId);
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
                onClick={() => handleSetSell(menuId)}
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
  ];

  return (
    <Box m="20px">
      <Header title="ຄີຍອດຂາຍ TREEKOFF ແຕ່ລະສາຂາ" />
      <Box
        mt="30px"
        display="grid"
        gridTemplateColumns="repeat(1, 20fr)"
        gridAutoRows="60px"
        gap="20px"
      >
        <Box gridColumn="span 1" backgroundColor={colors.primary[400]}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="20px"
          >
            <Box>
              <CalendarCoffeeSell
                setSelectFormtracksend={setSelectFormtracksend}
                setSelectDateBrachCheck={setSelectDateBrachCheck}
              />
            </Box>
            <Box>
              <SelectBracnhCoffeeSell
                setSelectFormtracksend={setSelectFormtracksend}
                setSelectDateBrachCheck={setSelectDateBrachCheck}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteAll}
                disabled={
                  selectDateBrachCheck.sellDate && selectDateBrachCheck.brachId
                    ? false
                    : true
                }
              >
                <Typography variant="laoText">ລ້າງຂໍມູນທີ່ຄີມື້ນິ້</Typography>
              </Button>
            </Box>
            <Box>
              <UploadFile
                handleSetSell={handleSetSell}
                selectDateBrachCheck={selectDateBrachCheck}
                coffeeMenu={coffeeMenu}
              />
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
          {/**DATAGRID */}
          {selectFormtracksend.sellDate && selectFormtracksend.brachId ? (
            <Box>
              <DataGrid
                rows={coffeeMenu}
                columns={columns}
                autoHeight
                hideFooter
                sx={{
                  width: "100%",
                  "& .MuiDataGrid-columnHeaders": {
                    fontFamily: "Noto Sans Lao",
                    fontWeight: "bold", // optional
                    fontSize: "14px", // optional
                  },
                }}
              />
            </Box>
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
    </Box>
  );
};

export default CoffeeSell;
