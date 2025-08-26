import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { tokens } from "../../theme";
import SearchIcon from "@mui/icons-material/Search";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import Header from "../component/Header";
import {
  getCoffeeMenu,
  getCoffeeMenuIngredientByMenuId,
  getMateriantVariantChildOnly,
} from "../../api/coffeeMenu";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCoffeeMenu from "./component/AddCoffeeMenu";
import DeleteCoffeeMenu from "./component/DeleteCoffeeMenu";
import UpdateCoffeeMenu from "./component/UpdateCoffeeMenu";
import DialogDetailCoffeeMenu from "./component/DialogDetailCoffeeMenu";
const URL =
  "https://treekoff-storage-coffee-menu.s3.ap-southeast-2.amazonaws.com";

const CoffeeMenu = () => {
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token);
  const [coffeeMenu, setCoffeeMenu] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [parentData, setParentData] = useState(null);
  const [selectItem, setSelectitem] = useState(null);
  const [materialVariantChildOnly, setMaterialVariantChildOnly] = useState([]);

  const [search, setSearch] = useState("");

  // 🔎 filter rows by search term
  const filteredRows = coffeeMenu?.filter((row) =>
    row.name?.toLowerCase().includes(search.toLowerCase())
  );

  //function

  const handleClickOpen = (row) => {
    fecthCoffeeMenuIngredientByMenuId(row.id);
    setParentData(row);
    setOpenDetail(true);
  };

  const fecthCoffeeMenuIngredientByMenuId = async (id) => {
    try {
      const ress = await getCoffeeMenuIngredientByMenuId(id, token);
      setSelectitem(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fecthCoffeeMenu = async () => {
    try {
      const ress = await getCoffeeMenu(token);
      setCoffeeMenu(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fecthMaterialVarinatChild = async () => {
    try {
      const ress = await getMateriantVariantChildOnly(token);
      setMaterialVariantChildOnly(ress.data);
    } catch (err) {
      console.log(err);
      return;
    }
  };

  useEffect(() => {
    fecthCoffeeMenu();
    fecthMaterialVarinatChild();
  }, [token]);

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpenImageModal(true);
  };
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl(null);
  };

  // column for DataGrid

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
          : `${URL}/cappucino.jpg`;
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
      headerName: "ຊື່ເມນູ",
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
          <Typography
            sx={{
              fontFamily: "Noto Sans Lao",
            }}
          >
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "size",
      headerName: "ຂະໜາດຈອກ",
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
          <Typography
            sx={{
              fontFamily: "Noto Sans Lao",
            }}
          >
            {row.size}
          </Typography>
        </Box>
      ),
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
            <UpdateCoffeeMenu row={row} fecthCoffeeMenu={fecthCoffeeMenu} />
            <Box>
              <IconButton onClick={() => handleClickOpen(row)}>
                <Tooltip
                  title="ເພີ່ມສູດວັດຖຸດິບ"
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
                  <SettingsIcon />
                </Tooltip>
              </IconButton>
            </Box>
            <DeleteCoffeeMenu row={row} setCoffeeMenu={setCoffeeMenu} />
          </Box>
        );
      },
    },
  ];


  return (
    <Box>
      {/** image modal */}
      <Box m="20px">
        <Header
          title="ຈັດການເມນູ TREEKOFF"
          subtitle="ເພີ່ມເມນູ ແລະ ວັດຖຸດິບຂອງແຕ່ລະເມນູ"
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display={"flex"} gap={2} alignItems={"center"}>
            {/**add menu */}
            <AddCoffeeMenu fecthCoffeeMenu={fecthCoffeeMenu} />
            {/** */}
          </Box>
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            sx={{ width: "20%", justifySelf: "flex-end" }}
          >
            <InputBase
              sx={{ ml: 2, flex: 1, fontFamily: "Noto Sans Lao" }}
              placeholder="ຄົ້ນຫາເມນູ.."
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
      </Box>
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
      
      <DialogDetailCoffeeMenu
        openDetail={openDetail}
        setOpenDetail={setOpenDetail}
        selectItem={selectItem}
        parentData={parentData}
        setSelectitem={setSelectitem}
        materialVariantChildOnly={materialVariantChildOnly}
        fecthCoffeeMenuIngredientByMenuId={fecthCoffeeMenuIngredientByMenuId}
      />
    </Box>
  );
};

export default CoffeeMenu;
