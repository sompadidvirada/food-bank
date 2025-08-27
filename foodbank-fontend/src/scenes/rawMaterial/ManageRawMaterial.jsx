import React, { useRef } from "react";
import {
  Typography,
  Box,
  useTheme,
  InputBase,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import Header from "../component/Header";
import AddCategoryMaterial from "./component/AddCategoryMaterial";
import AddRawMaterial from "./component/AddRawMaterial";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from "../../theme";
import DeleteCategoryRawMaterial from "./component/DeleteCategoryRawMaterial";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import {
  getAllRawMaterial,
  getCategoryRawMaterial,
  getMaterialVariantFromId,
} from "../../api/rawMaterial";
import { DataGrid } from "@mui/x-data-grid";
import DetailDialog from "./component/DetailDialog";
import DialogEditRawMaterial from "./component/DialogEditRawMaterial";
import DeleteRawMaterial from "./component/DeleteRawMaterial";
import AddMaterialVariant from "./component/AddMaterialVariant";
import ImageModal from "../../component/ImageModal";
const URL =
  "https://treekoff-storage-rawmaterials.s3.ap-southeast-2.amazonaws.com";

const ManageRawMaterial = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token);
  const [categoryRawMaterial, setCategoryRawMaterial] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectItem, setSelectitem] = useState(null);
  const [parentData, setParentData] = useState(null);
  const imageModalRef = useRef();

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  const [search, setSearch] = useState("");

  // 🔎 filter rows by search term
  const filteredRows = rawMaterials?.filter((row) =>
    row.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleClickOpen = (row) => {
    fecthMaterialVariant(row.id);
    setParentData(row);
    setOpenDetail(true);
  };

  const fecthMaterialVariant = async (id) => {
    try {
      const ress = await getMaterialVariantFromId(id, token);
      setSelectitem(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fecthCategoryRawMaterial = async () => {
    try {
      const ress = await getCategoryRawMaterial(token);
      setCategoryRawMaterial(ress.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fecthAllRawMaterial = async () => {
    try {
      const ress = await getAllRawMaterial(token);
      setRawMaterials(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { field: "id", headerName: "ໄອດີ", width: 50 },
    {
      field: "image",
      headerName: "ຮູບພາບ",
      width: 80,
      sortable: false,
      renderCell: (params) => {
        const imageUrl = params.row.image
          ? `${URL}/${params.row.image}`
          : `${URL}/coffee-default.png`;
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            loading="lazy"
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
      headerName: "ຊື່ວັດຖຸດິບ",
      headerAlign: "center",
      align: "center",
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <Tooltip
            title="ເບີ່ງລາຍລະອຽດວັດຖຸດິບ"
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
            <Typography
              onClick={() => handleClickOpen(row)}
              sx={{
                fontFamily: "Noto Sans Lao",
                textDecoration: "underline",
                cursor: "pointer",
                "&:hover": { color: colors.greenAccent[400] },
              }}
            >
              {row.name} {row.materialVariantName}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "categoryMeterail",
      headerName: "ໝວດໝູ່",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
            {row.categoryMeterail}
          </Typography>
        </Box>
      ),
    },
    {
      field: "costPriceKip",
      headerName: "ຕົ້ນທືນກີບ",
      type: "number",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Typography fontFamily="Noto Sans Lao">
              {row.costPriceKip?.toLocaleString("en-US")}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "sellPriceKip",
      headerName: "ລາຄາຂາຍກີບ",
      type: "number",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Typography fontFamily="Noto Sans Lao">
              {row.sellPriceKip?.toLocaleString("en-US")}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "costPriceBath",
      headerName: "ຕົ້ນທືນບາດ",
      type: "number",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Typography fontFamily="Noto Sans Lao">
              {row.costPriceBath?.toLocaleString("en-US")}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "sellPriceBath",
      headerName: "ລາຄາຂາຍບາດ",
      type: "number",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Typography fontFamily="Noto Sans Lao">
              {row.sellPriceBath?.toLocaleString("en-US")}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "barcode",
      headerName: "ບາໂຄດ",
      headerAlign: "center",
      sortable: false,
      align: "center",
      renderCell: ({ row }) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Typography fontFamily="Noto Sans Lao">{row.barcode}</Typography>
          </Box>
        );
      },
    },
    {
      field: "mangement",
      headerName: "ຈັດການ",
      headerAlign: "center",
      sortable: false,
      align: "center",
      width: 180,
      renderCell: ({ row }) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            gap={1}
          >
            <DialogEditRawMaterial
              row={row}
              categoryRawMaterial={categoryRawMaterial}
              fecthAllRawMaterial={fecthAllRawMaterial}
            />
            <DeleteRawMaterial
              row={row}
              fecthAllRawMaterial={fecthAllRawMaterial}
            />
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    fecthCategoryRawMaterial();
    fecthAllRawMaterial();
  }, [token]);

  return (
    <Box m="20px">
      <Header title="ຈັດການວັດຖຸດິບ" />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display={"flex"} gap={2} alignItems={"center"}>
          <AddCategoryMaterial
            fecthCategoryRawMaterial={fecthCategoryRawMaterial}
          />
          <DeleteCategoryRawMaterial
            categoryRawMaterial={categoryRawMaterial}
            fecthCategoryRawMaterial={fecthCategoryRawMaterial}
          />
          <AddRawMaterial
            categoryRawMaterial={categoryRawMaterial}
            fecthAllRawMaterial={fecthAllRawMaterial}
          />
        </Box>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          sx={{ width: "20%", justifySelf: "flex-end" }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1, fontFamily: "Noto Sans Lao" }}
            placeholder="ຄົ້ນຫາວັດຖຸດິບ.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Box sx={{ p: 1 }}>
            <SearchIcon />
          </Box>
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
        <DataGrid
          rows={filteredRows}
          columns={columns}
          hideFooter
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontFamily: "Noto Sans Lao",
              fontWeight: "bold", // optional
              fontSize: "16px", // optional
            },
          }}
        />
      </Box>
      {/** image modal */}
      <ImageModal ref={imageModalRef} />

      <DetailDialog
        openDetail={openDetail}
        selectItem={selectItem}
        setSelectitem={setSelectitem}
        setOpenDetail={setOpenDetail}
        parentData={parentData}
        setParentData={setParentData}
        fecthAllRawMaterial={fecthAllRawMaterial}
      />
    </Box>
  );
};

export default ManageRawMaterial;
