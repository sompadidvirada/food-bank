import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { forwardRef, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import AddMaterialVariant from "./AddMaterialVariant";
import DeleteDetailDialog from "./DeleteDetailDialog";
import UpdateDetailMaterial from "./UpdateDetailMaterial";
const URL =
  "https://treekoff-storage-rawmaterials.s3.ap-southeast-2.amazonaws.com";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DetailDialog = ({
  openDetail,
  selectItem,
  setSelectitem,
  setOpenDetail,
  parentData,
  setParentData,
  fecthAllRawMaterial,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleClose = () => {
    setOpenDetail(false);
    setSelectitem([]);
    setParentData([]);
  };

  const withChildCounts = selectItem?.map((item) => {
    // find the first child where this item is parent
    const child = selectItem?.find((c) => c.parentVariantId === item.id);

    return {
      ...item,
      countVariantChild: child ? child.quantityInParent : 1,
      variantChildName: child ? child.variantName : 1,
    };
  });


  const columns = [
    { field: "id", headerName: "ໄອດີ", width: 90 },
    {
      field: "variantName",
      headerName: "ຊື່ລາຍລະອຽດວັດຖຸດິບ",
      width: 200,
      renderCell: ({ row }) => (
        <Box
          sx={{
            whiteSpace: "normal", // allow wrapping
            wordBreak: "break-word", // break long text
            lineHeight: "1.4",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{ fontFamily: "Noto Sans Lao", whiteSpace: "inherit" }}
          >
            {parentData?.name} {row.variantName}
          </Typography>
        </Box>
      ),
    },
    {
      field: "countVariantChild",
      headerName: "ຈຳນວນທັງໝົດຂອງບັນຈຸພັນ",
      width: 200,
      type: "number",
      renderCell: ({ row }) => (
        <Box sx={{ width: "100%", height: "100%", alignContent: "center" }}>
          {row?.variantChildName !== 1 && row?.variantChildName !== 1 ? (
            <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
              {`1 x`} {row?.countVariantChild}
              {row?.variantChildName}
            </Typography>
          ) : (
            <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
              {`1 x 1`}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "barcode",
      headerName: "ບາໂຄດ",
      width: 150,
      type: "number",
      renderCell: ({ row }) => (
        <Box sx={{ width: "100%", height: "100%", alignContent: "center" }}>
          <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
            {row.barcode}
          </Typography>
        </Box>
      ),
    },
    {
      field: "costPriceKip",
      headerName: "ຕົ້ນທຶນ ລາຄາຂາຍ ກີບ",
      type: "number",
      width: 160,
      renderCell: ({ row }) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {" "}
          <Tooltip
            title="ລາຄາຕົ້ນທຶນກີບ"
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
              sx={{
                fontFamily: "Noto Sans Lao",
                color: colors.grey[100],
                cursor: "pointer",
              }}
            >
              {row.costPriceKip?.toLocaleString("en-US")} {"ກີບ"}
            </Typography>
          </Tooltip>
          <Tooltip
            title="ລາຄາຂາຍທຶນກີບ"
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
              sx={{
                fontFamily: "Noto Sans Lao",
                color: colors.greenAccent[400],
                cursor: "pointer",
              }}
            >
              {row.sellPriceKip?.toLocaleString("en-US")} {"ກີບ"}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "costPriceBath",
      headerName: "ຕົ້ນທຶນ ລາຄາຂາຍ ບາດ",
      sortable: false,
      type: "number",
      width: 160,
      renderCell: ({ row }) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Tooltip
            title="ລາຄາຕົ້ນທຶນກີບ"
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
              sx={{
                fontFamily: "Noto Sans Lao",
                color: colors.grey[100],
                cursor: "pointer",
              }}
            >
              {row.costPriceBath?.toLocaleString("en-US")} {"ບາດ"}
            </Typography>
          </Tooltip>
          <Tooltip
            title="ລາຄາຂາຍທຶນກີບ"
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
              sx={{
                fontFamily: "Noto Sans Lao",
                color: colors.greenAccent[400],
                cursor: "pointer",
              }}
            >
              {row.sellPriceBath?.toLocaleString("en-US")} {"ບາດ"}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "manage",
      headerName: "ຈັດການ",
      width: 150,
      renderCell: ({ row }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
          gap={1}
        >
          <AddMaterialVariant
            row={row}
            handleCloseParent={handleClose}
            selectItem={selectItem}
            parentData={parentData}
          />
          <UpdateDetailMaterial
            row={row}
            handleCloseParent={handleClose}
            selectItem={selectItem}
            parentData={parentData}
            fecthAllRawMaterial={fecthAllRawMaterial}
          />

          <DeleteDetailDialog
            row={row}
            handleCloseParent={handleClose}
            selectItem={selectItem}
          />
        </Box>
      ),
    },
  ];

  return (
    <Dialog
      open={openDetail}
      slots={{
        transition: Transition,
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
          <Typography
            sx={{ fontFamily: "Noto sans Lao", alignSelf: "end", fontSize: 20 }}
          >
            {" "}
            ລາຍລະອຽດວັດຖຸດິບແຕ່ລະຂະໜາດ : {parentData?.name}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DataGrid
          rows={Array.isArray(withChildCounts) ? withChildCounts : []}
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
    </Dialog>
  );
};

export default DetailDialog;
