import { tokens } from "../../../theme";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { forwardRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { DataGrid } from "@mui/x-data-grid";
import EditIngredientCoffeeMenu from "./EditIngredientCoffeeMenu";
import DeleteCoffeeMenuIngredient from "./DeleteCoffeeMenuIngredient";
import DialogAddIngredientCofeeMenu from "./DialogAddIngredientCofeeMenu";
const URL =
  "https://treekoff-storage-coffee-menu.s3.ap-southeast-2.amazonaws.com";

const URLMATERIAL =
  "https://treekoff-storage-rawmaterials.s3.ap-southeast-2.amazonaws.com";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogDetailCoffeeMenu = ({
  setOpenDetail,
  openDetail,
  selectItem,
  parentData,
  setSelectitem,
  materialVariantChildOnly,
  fecthCoffeeMenuIngredientByMenuId,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClose = () => {
    setOpenDetail(false);
    setSelectitem([]);
  };

  const totalAllUse = selectItem?.reduce(
    (sum, item) => sum + item.totalUseKip,
    0
  );

  const percentage =
    totalAllUse > 0 ? (totalAllUse / parentData.sellPrice ) * 100 : 0;

  const columns = [
    { field: "id", headerName: "ໄອດີ", width: 60, sortable: false },
    {
      field: "image",
      headerName: "ຮູບພາບ",
      width: 80,
      sortable: false,
      renderCell: (params) => {
        const imageUrl = params.row.image
          ? `${URLMATERIAL}/${params.row.image}`
          : `${URLMATERIAL}/coffee-default.png`;
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
            }}
          />
        ) : (
          <span>No Image</span>
        );
      },
    },
    {
      field: "rawMaterialName",
      headerName: "ຊື່ວັດຖຸດິບ",
      width: 180,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: ({ row }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
            {row?.rawMaterialName} ({row?.unit})
          </Typography>
        </Box>
      ),
    },
    {
      field: "quantity",
      headerName: "ບໍລິມາດ",
      width: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: ({ row }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
            {row?.quantity} ({row?.unit})
          </Typography>
        </Box>
      ),
    },
    {
      field: "totalUseKip",
      headerName: "ເປັນມູນຄ່າ",
      width: 180,
      headerAlign: "right",
      sortable: false,
      renderCell: ({ row }) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="right"
          width="100%"
          height="100%"
        >
          <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
            {row?.totalUseKip !== undefined
              ? new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: row.totalUseKip % 1 !== 0 ? 2 : 0, // 👈 if float, show 2 decimals
                  maximumFractionDigits: 2,
                }).format(row.totalUseKip)
              : ""}{" "}
            ກີບ
          </Typography>
        </Box>
      ),
    },
    {
      field: "manage",
      headerName: "ຈັດການ",
      flex: 1,
      headerAlign: "center",
      sortable: false,
      renderCell: ({ row }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <EditIngredientCoffeeMenu row={row} setSelectitem={setSelectitem} />
          <DeleteCoffeeMenuIngredient row={row} setSelectitem={setSelectitem} />
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Dialog
        open={openDetail}
        slots={{
          transition: Transition,
        }}
        PaperProps={{
          sx: {
            width: "800px",
            height: "800px",
            borderRadius: 3,
          },
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth={false}
        fullWidth={false}
      >
        <DialogTitle>
          <Box display={"flex"} gap={2}>
            <Avatar
              src={`${URL}/${
                parentData?.image ? parentData?.image : "coffee-default.png"
              }`}
              sx={{ width: 80, height: 80 }}
            />
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"end"}
            >
              <Typography
                sx={{
                  fontFamily: "Noto sans Lao",
                  alignSelf: "end",
                  fontSize: 20,
                }}
              >
                {" "}
                ລາຍລະອຽດວັດຖຸດິບຂອງເມນູ : {parentData?.name}
              </Typography>

              <DialogAddIngredientCofeeMenu
                selectItem={selectItem}
                parentData={parentData}
                materialVariantChildOnly={materialVariantChildOnly}
                setSelectitem={setSelectitem}
                fecthCoffeeMenuIngredientByMenuId={
                  fecthCoffeeMenuIngredientByMenuId
                }
              />
              <Box>
                <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
                  ລາຄາຂາຍປະຈຸບັນ: {parentData?.sellPrice.toLocaleString()} ກີບ
                </Typography>
                <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
                  ລາຄາຕົ້ນທືນທັງໝົດຂອງວັດຖຸດິບ:{" "}
                  {Number(totalAllUse?.toFixed(3)).toLocaleString()} ກີບ
                </Typography>
                <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
                  ແຍກອອກເປັນເປີເຊັນ: {percentage.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DataGrid
            rows={Array.isArray(selectItem) ? selectItem : []}
            columns={columns}
            hideFooter
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                fontFamily: "Noto Sans Lao",
                fontWeight: "bold", // optional
                fontSize: "14px", // optional
              },
            }}
          />
        </DialogContent>
      </Dialog>{" "}
    </Box>
  );
};

export default DialogDetailCoffeeMenu;
