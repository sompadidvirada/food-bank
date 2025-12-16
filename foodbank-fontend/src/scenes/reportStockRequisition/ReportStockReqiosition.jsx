import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Header from "../component/Header";
import { tokens } from "../../theme";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import CalendarForReportStock from "./component/CalendarForReportStock";
import CloseIcon from "@mui/icons-material/Close";
import SelectBranchForStock from "./component/SelectBranchForStock";
import { DataGrid } from "@mui/x-data-grid";
import {
  getAllStockrequisition,
  getRawMaterialVariantToInsert,
} from "../../api/rawMaterial";
import SelectMaterialVariantForStock from "./component/SelectMaterialVariantForStock";
import PrintReportStockRequisition from "./component/PrintReportStockRequisition";
import ImageModal from "../../component/ImageModal";
const URL =
  "https://treekoff-storage-rawmaterials.s3.ap-southeast-2.amazonaws.com";

const ReportStockReqiosition = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token);
  const [rawMaterialVariants, setRawMaterialVariants] = useState([]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [queryForm, setQueryFormState] = useState({
    startDate: "",
    endDate: "",
    branchId: "",
  });
  const [stockRequisitionData, setStockRequisitionData] = useState([]);
  const [branchName, setBranchName] = useState();

  const { startDate, endDate } = queryForm;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // difference in ms
  const diffTime = end - start;

  const totals = stockRequisitionData?.reduce(
    (acc, item) => {
      const first = item.Allstockrequisition[0]; // only first
      if (first) {
        acc.totalKip += first.totalPriceKip || 0;
        acc.totalBath += first.totalPriceBath || 0;
      }
      return acc;
    },
    { totalKip: 0, totalBath: 0 }
  );

  // difference in days (rounded up or down depending what you need)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const fecthStockRequisition = async () => {
    try {
      const ress = await getAllStockrequisition(queryForm, token);
      setStockRequisitionData(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fecthRawMaterial = async () => {
    try {
      const ress = await getRawMaterialVariantToInsert(token);
      setRawMaterial(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (queryForm?.startDate && queryForm?.endDate && queryForm?.branchId) {
      fecthStockRequisition();
    }
  }, [token, queryForm]);
  useEffect(() => {
    fecthRawMaterial();
  }, [token]);

  const imageModalRef = useRef();

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  // coumn for datagrid

  const columns = [
    { field: "id", headerName: "ໄອດີ", flex: 0.1 },
    {
      field: "image",
      headerName: "ຮູບພາບ",
      flex: 0.155,
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
      width: 100,
      renderCell: (params) => (
        <Box sx={{ width: "100%", height: "100%" }}>
          <SelectMaterialVariantForStock
            setRawMaterialVariants={setRawMaterialVariants}
            materialVariant={params.row.materialVariant}
            rawMaterialId={params.row.id}
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
      field: "categoryMeterail",
      headerName: "ໝວດໝູ່",
      type: "text",
      headerAlign: "left",
      flex: 0.28,
      align: "left",
      renderCell: (params) => {
        return params?.row?.categoryMeterail ? (
          <Box sx={{ height: "100%", width: "100%", alignContent: "center" }}>
            <Typography
              sx={{ fontFamily: "Noto Sans Lao", fontSize: 12 }}
              color={colors.grey[100]}
            >
              {params.row.categoryMeterail.name}
            </Typography>
          </Box>
        ) : (
          "No Category"
        );
      },
    },
    {
      field: "quantityRequisition",
      headerName: "ຈຳນວນທີ່ເບີກ",
      type: "number",
      headerAlign: "right",
      flex: 0.2,
      align: "right",
      renderCell: (params) => {
        const selectedVariant = rawMaterialVariants.find(
          (v) => v.rawMaterialId === params.row.id
        );

        const stockReq = stockRequisitionData
          ?.find((v) => v.id === params.row.id)
          ?.Allstockrequisition.find(
            (r) => r.id === selectedVariant?.materialVariantId
          );

        return (
          <Box sx={{ height: "100%", width: "100%", alignContent: "center" }}>
            <Typography
              sx={{ fontFamily: "Noto Sans Lao", fontSize: 13 }}
              color={colors.grey[100]}
            >
              {stockReq?.quantityRequition != null
                ? Number.isInteger(stockReq.quantityRequition)
                  ? `${stockReq.quantityRequition} (${selectedVariant?.variantName})`
                  : `${stockReq.quantityRequition.toFixed(3)} (${
                      selectedVariant?.variantName
                    })`
                : "-"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "averageRequisition",
      headerName: "ຈຳນວນເບີກສະເລ່ຍ",
      type: "number",
      headerAlign: "right",
      flex: 0.35,
      align: "right",
      renderCell: (params) => {
        const selectedVariant = rawMaterialVariants.find(
          (v) => v.rawMaterialId === params.row.id
        );

        const stockReq = stockRequisitionData
          ?.find((v) => v.id === params.row.id)
          ?.Allstockrequisition.find(
            (r) => r.id === selectedVariant?.materialVariantId
          );
        const avarageReq = stockReq?.quantityRequition / diffDays;

        return (
          <Box sx={{ height: "100%", width: "100%", alignContent: "center" }}>
            <Typography
              sx={{ fontFamily: "Noto Sans Lao", fontSize: 13 }}
              color={colors.blueAccent[300]}
            >
              {stockReq?.quantityRequition != null
                ? Number.isInteger(avarageReq)
                  ? `${avarageReq} (${selectedVariant?.variantName}) / ມື້`
                  : `${avarageReq.toFixed(3)} (${
                      selectedVariant?.variantName
                    }) / ມື້`
                : "-"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "averageRequisitiomonth",
      headerName: "ໃຊ້ສະເລ່ຍຕໍ່ເດືອນ",
      type: "number",
      headerAlign: "right",
      flex: 0.35,
      align: "right",
      renderCell: (params) => {
        const selectedVariant = rawMaterialVariants.find(
          (v) => v.rawMaterialId === params.row.id
        );

        const stockReq = stockRequisitionData
          ?.find((v) => v.id === params.row.id)
          ?.Allstockrequisition.find(
            (r) => r.id === selectedVariant?.materialVariantId
          );
        const avarageReq = stockReq?.quantityRequition / diffDays;

        return (
          <Box sx={{ height: "100%", width: "100%", alignContent: "center" }}>
            <Typography
              sx={{ fontFamily: "Noto Sans Lao", fontSize: 13 }}
              color={colors.greenAccent[300]}
            >
              {stockReq?.quantityRequition != null
                ? Number.isInteger(avarageReq)
                  ? `${avarageReq * 30} (${selectedVariant?.variantName}) / ເດືອນ`
                  : `${(avarageReq * 30).toFixed(2)} (${
                      selectedVariant?.variantName
                    }) / ເດືອນ`
                : "-"}
            </Typography>
          </Box>
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
    {
      field: "totalKip",
      type: "number",
      headerName: "ມູນຄ່າການຈັດສົ່ງກີບທັງໝົດ",
      flex: 0.3,
      renderCell: (params) => {
        const selectedVariant = rawMaterialVariants.find(
          (v) => v.rawMaterialId === params.row.id
        );
        const stockReq = stockRequisitionData
          ?.find((v) => v.id === params.row.id)
          ?.Allstockrequisition.find(
            (r) => r.id === selectedVariant?.materialVariantId
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
              color={colors.greenAccent[300]}
              sx={{
                fontFamily: "Noto Sans Lao",
                whiteSpace: "normal",
                wordBreak: "break-word", // breaks long words too
              }}
            >
              {/* show variant name if exists */}
              {stockReq
                ? stockReq.totalPriceKip?.toLocaleString("en-US")
                : ""}{" "}
              ກີບ
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "totalBath",
      type: "number",
      headerName: "ມູນຄ່າການຈັດສົ່ງບາດທັງໝົດ",
      flex: 0.3,
      renderCell: (params) => {
        const selectedVariant = rawMaterialVariants.find(
          (v) => v.rawMaterialId === params.row.id
        );
        const stockReq = stockRequisitionData
          ?.find((v) => v.id === params.row.id)
          ?.Allstockrequisition.find(
            (r) => r.id === selectedVariant?.materialVariantId
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
              color={colors.greenAccent[300]}
              sx={{
                fontFamily: "Noto Sans Lao",
                whiteSpace: "normal",
                wordBreak: "break-word", // breaks long words too
              }}
            >
              {/* show variant name if exists */}
              {stockReq
                ? stockReq.totalPriceBath?.toLocaleString("en-US")
                : ""}{" "}
              ບາດ
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="ລາຍງານການເບີກວັດຖຸດິບ"
        subtitle="ລາຍງານລາຍລະອຽດຂອງການເບີກວັດຖຸດິບໃຫ້ກັບແຕ່ລະສາຂາ"
      />
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
              <CalendarForReportStock
                setQueryFormState={setQueryFormState}
                queryForm={queryForm}
              />
            </Box>
            <Box>
              <SelectBranchForStock
                setQueryFormState={setQueryFormState}
                setBranchName={setBranchName}
              />
            </Box>
            <Box>
              <PrintReportStockRequisition
                branchName={branchName}
                queryForm={queryForm}
                totals={totals}
                rawMaterialVariants={rawMaterialVariants}
                rawMaterial={rawMaterial}
                stockRequisitionData={stockRequisitionData}
              />
            </Box>
          </Box>
        </Box>
        <Box gridColumn="span 1" backgroundColor={colors.primary[400]}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="20px"
            p={2}
          >
            <Box>
              <Typography sx={{ fontFamily: "Noto Sans Lao", fontSize: 20 }}>
                ເປັນຈຳນວນມື້ທັງໝົດ {diffDays ? diffDays : "0"} ມື້
              </Typography>
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
          {queryForm.startDate && queryForm.endDate && queryForm.branchId ? (
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
                    fontSize: "12px", // optional
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
                "ເລືອກວັນທີ່ ແລະ ສາຂາທີ່ຕ້ອງເບີ່ງຂໍ້ມູນ"
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

export default ReportStockReqiosition;
