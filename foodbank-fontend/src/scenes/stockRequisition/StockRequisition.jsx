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
import useFoodBankStorage from "../../zustand/foodbank-storage";
import { useState } from "react";
import CalendarSendMaterial from "./component/CalendarSendMaterial";
import CloseIcon from "@mui/icons-material/Close";
import SelecBranch from "./component/SelecBranch";
import { toast } from "react-toastify";
import {
  deleteAllStockrequisitionByDate,
  getAllRawMaterial,
  getRawMaterialVariantToInsert,
  getStockRequisitionByDate,
  insertStockRequisition,
} from "../../api/rawMaterial";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import SelectMaterialVariantToInsert from "./component/SelectMaterialVariantToInsert";
import DialogEdit from "./component/DialogEdit";
import UploadFile from "./component/UploadFile";
import ImageModal from "../../component/ImageModal";
import PrintStockRequisition from "./component/PrintStockRequisition";
const URL =
  "https://treekoff-storage-rawmaterials.s3.ap-southeast-2.amazonaws.com";

const StockRequisition = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [rawMaterialVariants, setRawMaterialVariants] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectFormtracksend, setSelectFormtracksend] = useState({
    materialVariantId: "",
    quantityRequisition: "",
    unitPriceKip: "",
    unitSellPriceKip: "",
    totalPriceKip: "",
    unitPriceBath: "",
    unitSellPriceBath: "",
    totalPriceBath: "",
    requisitionDate: "",
    branchId: "",
  });
  const [selectDateBrachCheck, setSelectDateBrachCheck] = useState({
    requisitionDate: "",
    branchId: "",
  });

  console.log(rawMaterialVariants);

  const totals = checked?.reduce(
    (acc, item) => {
      acc.totalKip += item.totalPriceKip;
      acc.totalBath += item.totalPriceBath;
      return acc;
    },
    { totalKip: 0, totalBath: 0 }
  );
  const imageModalRef = useRef();

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  const fecthRawMaterial = async () => {
    try {
      const ress = await getRawMaterialVariantToInsert(token);
      setRawMaterial(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fecthStockRequisition = async () => {
    try {
      const ress = await getStockRequisitionByDate(selectDateBrachCheck, token);
      setChecked(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSetSendCount = async (materialVariantId, countOrForm = null) => {
    let countToUse = 0;

    // Case 1: called from UploadFile (count passed directly)
    if (typeof countOrForm === "number") {
      countToUse = countOrForm;
    }
    // Case 2: called from input form (form element passed)
    else if (countOrForm instanceof HTMLFormElement) {
      const formData = new FormData(countOrForm);
      const rawValue = formData.get(`sendCount-${materialVariantId}`);
      countToUse = rawValue ? parseInt(rawValue, 10) : 0;
    }

    if (!countToUse) return toast.error(`ກະລຸນາເພີ່ມຈຳນວນກ່ອນ.`);

    if (
      selectFormtracksend.requisitionDate === "" ||
      selectFormtracksend.branchId === ""
    ) {
      return;
    }

    // 🔎 Find material variant inside rawMaterial
    let materialVariant = null;
    let parentMaterial = null;

    for (const rm of rawMaterial) {
      materialVariant = rm.materialVariant.find(
        (v) => v.id === materialVariantId
      );
      if (materialVariant) {
        parentMaterial = rm;
        break;
      }
    }

    if (!materialVariant) {
      console.warn(`⚠️ Material variant ${materialVariantId} not found`);
      return;
    }

    const updatedForm = {
      ...selectFormtracksend,
      materialVariantId,
      // pricing info comes from the found variant
      unitPriceKip: materialVariant.costPriceKip,
      unitSellPriceKip: materialVariant.sellPriceKip,
      totalPriceKip: materialVariant.sellPriceKip * countToUse,
      unitPriceBath: materialVariant.costPriceBath,
      unitSellPriceBath: materialVariant.sellPriceBath,
      totalPriceBath: materialVariant.sellPriceBath * countToUse,
      quantityRequisition: countToUse,

      // optional: include parent raw material info if needed later
      rawMaterialId: parentMaterial?.id,
      rawMaterialName: parentMaterial?.name,
    };

    try {
      const ress = await insertStockRequisition(updatedForm, token);
      setChecked((prevChecked) => [...prevChecked, ress.data]);

      // reset if input form was used
      if (countOrForm instanceof HTMLFormElement) {
        countOrForm.reset();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteAllStockRequisitionByDate = async () => {
    if (
      !selectDateBrachCheck?.requisitionDate &&
      !selectDateBrachCheck?.branchId
    ) {
      return toast.error(`ລອງໃຫ່ມພາຍຫຼັງ`);
    }
    try {
      const ress = await deleteAllStockrequisitionByDate(
        selectDateBrachCheck,
        token
      );
      setChecked([]);
      toast.success(`ລົບລາຍການວັນທີນີ້ສຳເລັດ`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (
      selectDateBrachCheck?.requisitionDate &&
      selectDateBrachCheck.branchId
    ) {
      fecthStockRequisition();
    }
  }, [token, selectDateBrachCheck]);

  useEffect(() => {
    fecthRawMaterial();
  }, [token]);

  //column for DataGrid

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
      field: "selecMaterialVariant",
      headerName: "ເລືອກບັນຈຸພັນຈັດສົ່ງ",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ width: "100%", height: "100%" }}>
          <SelectMaterialVariantToInsert
            materialVariant={params.row.materialVariant}
            rawMaterialId={params.row.id}
            categoryMeterailId={params.row.categoryMeterailId}
            categoryMeterailName={params.row.categoryMeterail.name}
            setRawMaterialVariants={setRawMaterialVariants}
          />
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "ຊື່ສິນຄ້າ",
      type: "text",
      headerAlign: "left",
      align: "left",
      width: 180,
      renderCell: (params) => {
        const variant = rawMaterialVariants?.find(
          (v) => v.rawMaterialId === params.row.id
        );

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
              {/* product name */}
              {params.value}
              {/* show variant name if exists */}
              {variant ? ` (${variant.variantName})` : ""}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "barcode",
      headerName: "ບາໂຄດບັນຈຸພັນ",
      type: "text",
      headerAlign: "left",
      align: "left",
      width: 130,
      renderCell: (params) => {
        const variant = rawMaterialVariants?.find(
          (v) => v.rawMaterialId === params.row.id
        );

        return (
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            justifyContent="left"
            height="100%"
            sx={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <Typography
              fontSize={12}
              color={colors.grey[100]}
              sx={{
                fontFamily: "Noto Sans Lao",
                whiteSpace: "normal",
                wordBreak: "break-word", // breaks long words too
              }}
            >
              {/* show variant name if exists */}
              {variant ? variant.barcode : ""}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "manage",
      headerName: "ຈຳນວນທີເບີກ",
      flex: 0.5,
      renderCell: (params) => {
        const materialVariantId = rawMaterialVariants.find(
          (item) => item.rawMaterialId === params.row.id
        )?.materialVariantId;

        const tracked = checked?.find(
          (item) => item?.materialVariantId === materialVariantId
        );

        if (tracked) {
          return (
            <Box
              display="flex-row"
              sx={{ height: "100%", width: "100%", justifyItems: "center" }}
            >
              <span
                style={{
                  color: colors.greenAccent[200],
                  fontWeight: "bold",
                  fontFamily: "Noto Sans Lao",
                }}
              >
                ຍອດທີ່ບັນທືກ. ({tracked.quantityRequisition})
              </span>
              <DialogEdit trackedProduct={tracked} setChecked={setChecked} />
            </Box>
          );
        }

        // input mode
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSetSendCount(materialVariantId, e.currentTarget);
            }}
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <input
              type="number"
              name={`sendCount-${materialVariantId}`}
              min="0"
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown")
                  e.preventDefault();
              }}
              onWheel={(e) => e.target.blur()}
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
        );
      },
    },
    {
      field: "categoryMeterail",
      headerName: "ໝວດໝູ່",
      type: "text",
      headerAlign: "left",
      flex: 0.28,
      align: "left",
      renderCell: (params) => {
        return params?.row?.categoryMeterail ? (
          <Typography
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 12 }}
            color={colors.grey[100]}
          >
            {params.row.categoryMeterail.name}
          </Typography>
        ) : (
          "No Category"
        );
      },
    },
    {
      field: "costPriceVarinatKip",
      type: "number",
      headerName: "ລາຄາຕົ້ນທືນກີບ",
      flex: 0.3,
      renderCell: (params) => {
        const variant = rawMaterialVariants?.find(
          (v) => v.rawMaterialId === params.row.id
        );

        return (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            width="100%"
            height="100%"
            sx={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <Typography
              fontWeight="bold"
              fontSize={12}
              color={colors.blueAccent[300]}
              sx={{
                fontFamily: "Noto Sans Lao",
                whiteSpace: "normal",
                wordBreak: "break-word", // breaks long words too
              }}
            >
              {/* show variant name if exists */}
              {variant ? variant.costPriceKip?.toLocaleString("en-US") : ""} ກີບ
            </Typography>
            <Typography
              fontWeight="bold"
              fontSize={12}
              color={colors.greenAccent[300]}
              sx={{
                fontFamily: "Noto Sans Lao",
                whiteSpace: "normal",
                wordBreak: "break-word", // breaks long words too
              }}
            >
              {variant ? variant.sellPriceKip?.toLocaleString("en-US") : ""} ກີບ
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "costPriceBath",
      type: "number",
      headerName: "ລາຄາຕົ້ນທືນບາດ",
      flex: 0.3,
      renderCell: (params) => {
        const variant = rawMaterialVariants?.find(
          (v) => v.rawMaterialId === params.row.id
        );

        return (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            width="100%"
            height="100%"
            sx={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <Typography
              fontWeight="bold"
              fontSize={12}
              color={colors.blueAccent[300]}
              sx={{
                fontFamily: "Noto Sans Lao",
                whiteSpace: "normal",
                wordBreak: "break-word", // breaks long words too
              }}
            >
              {/* show variant name if exists */}
              {variant
                ? variant.costPriceBath?.toLocaleString("en-US")
                : ""}{" "}
              ບາດ
            </Typography>
            <Typography
              fontWeight="bold"
              fontSize={12}
              color={colors.greenAccent[300]}
              sx={{
                fontFamily: "Noto Sans Lao",
                whiteSpace: "normal",
                wordBreak: "break-word", // breaks long words too
              }}
            >
              {variant ? variant.sellPriceBath?.toLocaleString("en-US") : ""}{" "}
              ບາດ
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="ຄີຍອດຈັດສົ່ງວັດຖຸດີບແຕ່ລະສາຂາ" />
      <Box
        mt="30px"
        display="grid"
        gridTemplateColumns="repeat(1, 20fr)"
        gridAutoRows="60px"
        gap="20px"
      >
        {" "}
        <Box gridColumn="span 1" backgroundColor={colors.primary[400]}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="20px"
          >
            <Box>
              <CalendarSendMaterial
                selectFormtracksend={selectFormtracksend}
                setSelectFormtracksend={setSelectFormtracksend}
                setSelectDateBrachCheck={setSelectDateBrachCheck}
              />
            </Box>

            <Box>
              <SelecBranch
                setSelectFormtracksend={setSelectFormtracksend}
                setSelectDateBrachCheck={setSelectDateBrachCheck}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteAllStockRequisitionByDate}
                disabled={
                  selectDateBrachCheck?.requisitionDate &&
                  selectDateBrachCheck?.branchId &&
                  checked.length > 0
                    ? false
                    : true
                }
              >
                <Typography variant="laoText">ລ້າງຂໍມູນທີ່ຄີມື້ນິ້</Typography>
              </Button>
            </Box>
            <Box>
              <UploadFile
                handleSetSendCount={handleSetSendCount}
                selectDateBrachCheck={selectDateBrachCheck}
                rawMaterial={rawMaterial}
              />
            </Box>
            <Box>
              <PrintStockRequisition
                branchName={selectFormtracksend?.branchName}
                queryForm={selectDateBrachCheck}
                totals={totals}
                rawMaterialVariants={rawMaterialVariants}
                rawMaterial={rawMaterial}
                stockRequisitionData={checked}
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
          {selectFormtracksend.requisitionDate &&
          selectFormtracksend.branchId ? (
            <Box>
              <DataGrid
                rows={rawMaterial}
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
      <ImageModal ref={imageModalRef} />
    </Box>
  );
};

export default StockRequisition;
