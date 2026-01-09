import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useRef } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";
import {
  checkCoffeeSell,
  deleteAllCoffeeSell,
  insertCoffeeSell,
} from "../../api/coffeeSell";
import EditCoffeeSell from "./component/EditCoffeeSell";
import UploadFile from "./component/UploadFile";
import ImageModal from "../../component/ImageModal";
import PrintCoffeeSell from "./component/PrintCoffeeSell";
const URL =
  "https://treekoff-storage-coffee-menu.s3.ap-southeast-2.amazonaws.com";

const CoffeeSell = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token);
  const [coffeeMenu, setCoffeeMenu] = useState([]);
  const [checked, setChecked] = useState([]);
  const [sendCounts, setSendCounts] = useState({});
  const [loading, setLoading] = useState(false);
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
  const imageModalRef = useRef();

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
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
    countOrForm = null,
    productOverride = null
  ) => {
    let countToUse = 0;

    // Case 1: called from UploadPdf (count passed directly)
    if (typeof countOrForm === "number") {
      countToUse = countOrForm;
    }
    // Case 2: called from form submit (form element passed)
    else if (countOrForm instanceof HTMLFormElement) {
      const formData = new FormData(countOrForm);
      const rawValue = formData.get(`sellCount-${menuId}`);
      countToUse = rawValue ? parseInt(rawValue, 10) : 0;
    }

    if (!countToUse) return toast.error(`ກະລຸນາເພີ່ມຈຳນວນກ່ອນ.`);

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
      if (countOrForm instanceof HTMLFormElement) {
        countOrForm.reset();
      }
    } catch (err) {
      console.log(err);
    }
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
    { field: "id", headerName: "ໄອດີ", width: 60 },
    {
      field: "image",
      headerName: "ຮູບພາບ",
      width: 80,
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
      width: 250,
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
      width: 100,
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
      field: "type",
      headerName: "ໝວດໝູ່",
      type: "text",
      headerAlign: "left",
      align: "left",
      width: 100,
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
      field: "type_2",
      headerName: "ປະເພດ",
      type: "text",
      headerAlign: "left",
      align: "left",
      width: 100,
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
      field: "sellPrice",
      headerName: "ລາຄາຂາຍ",
      type: "text",
      headerAlign: "left",
      align: "left",
      width: 100,
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
              {params.value?.toLocaleString()} ກີບ
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "manage",
      headerName: "ຈຳນວນທີ່ໄດ້ຂາຍ",
      flex: 0.5,
      headerAlign: "left",
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
                justifyContent: "left",
                height: "100%",
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSetSell(menuId, e.currentTarget);
                }}
                style={{ display: "flex", gap: "5px", alignItems: "center" }}
              >
                <input
                  type="number"
                  min="0"
                  name={`sellCount-${menuId}`} // important for FormData
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
  ];

const getDetailedCheckedSales = (checked, coffeeMenu) => {
    // 1. Create Menu Map for O(1) lookup
    const menuMap = new Map();
    for (const menu of coffeeMenu) {
      menuMap.set(menu.id, menu);
    }

    // 2. Merge Data (Your existing logic)
    const detailedSales = checked.map((sale) => {
      const menuDetails = menuMap.get(sale.coffeeMenuId);

      if (menuDetails) {
        return {
          ...sale,
          menuDetails: menuDetails,
          productName: menuDetails.name,
          productSize: menuDetails.size,
          productSellPrice: menuDetails.sellPrice,
          productImage: menuDetails.image,
          // Include type_2 directly for easier sorting/grouping
          productType2: menuDetails.type_2, 
        };
      } else {
        console.warn(
          `Menu item with ID ${sale.coffeeMenuId} not found for sale ID ${sale.id}`
        );
        return { 
            ...sale, 
            menuDetails: { name: "Product Not Found" }, 
            productType2: "Z_UNSORTED" // Use a key that sorts to the end
        };
      }
    });

    // 3. Sort the Detailed Sales Data by productType2
    detailedSales.sort((a, b) => {
        // Use the productType2 field for sorting
        const typeA = a.productType2 || ""; // Handle undefined/null safely
        const typeB = b.productType2 || ""; 
        
        // Sorts alphabetically (e.g., COFFEE, ICED, SMOOTIE)
        return typeA.localeCompare(typeB);
    });

    return detailedSales;
};

  const detailedSalesData = getDetailedCheckedSales(checked, coffeeMenu);
  
  const aggregateSalesByObject = (checked, coffeeMenu) => {
    // 1. Map Menu for Quick Lookup (O(1) efficiency)
    const menuMap = new Map();
    for (const menu of coffeeMenu) {
      menuMap.set(menu.id, menu);
    }

    // 2. Aggregate into a single object
    const type2Totals = {
      ICED: 0,
      HOT: 0,
      SMOOTIE: 0,
      EXTRA:0,
      PROMOTION:0
    };

    for (const sale of checked) {
      const menuDetails = menuMap.get(sale.coffeeMenuId);

      if (menuDetails && menuDetails.type_2) {
        const category = menuDetails.type_2;
        const count = parseInt(sale.sellCount, 10) || 0;

        if (type2Totals.hasOwnProperty(category)) {
          type2Totals[category] += count;
        } else {
          // If you encounter a category not listed (e.g., 'COLD' not 'ICED')
          type2Totals.OTHER += count;
        }
      }
    }

    return type2Totals;
  };
  const calculateGrandTotalUnits = (checked) => {
    if (!checked || checked.length === 0) {
      return 0;
    }

    // Use the reduce method to sum the 'sellCount' property of every sale object
    const total = checked.reduce((accumulator, sale) => {
      // Ensure sellCount is treated as a number
      const count = parseInt(sale.sellCount, 10);
      // Add the current sale count to the accumulator
      return accumulator + (isNaN(count) ? 0 : count);
    }, 0); // Start with an initial value of 0

    return total;
  };

  const grandTotalUnitsSold = React.useMemo(() => {
    return calculateGrandTotalUnits(checked);
  }, [checked]); // Recalculate whenever the sales data changes
  const aggregatedCounts = aggregateSalesByObject(checked, coffeeMenu);

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
            <PrintCoffeeSell
              detailedSalesData={detailedSalesData}
              aggregatedCounts={aggregatedCounts}
              grandTotalUnitsSold={grandTotalUnitsSold}
              selectDateBrachCheck={selectDateBrachCheck}
            />
            <Box>
              <UploadFile
                handleSetSell={handleSetSell}
                selectDateBrachCheck={selectDateBrachCheck}
                coffeeMenu={coffeeMenu}
                setLoading={setLoading}
              />
            </Box>
          </Box>
        </Box>

        {/**Section 2 insert data */}
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
        )}
      </Box>
      {/** image modal */}
      <ImageModal ref={imageModalRef} />
    </Box>
  );
};

export default CoffeeSell;
