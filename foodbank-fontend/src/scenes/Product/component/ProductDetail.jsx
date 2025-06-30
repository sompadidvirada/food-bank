import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import SelectStatus from "./SelectStatus";
import { updateStatusProduct } from "../../../api/product";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { tokens } from "../../../theme";
const URL = import.meta.env.VITE_API_URL;

const ProductDetail = ({
  setOpenDetailDialog,
  openDetailDialog,
  selectedProduct,
  setSelectedProduct,
}) => {
  const [formUpdateAviable, setFormUpdateAviable] = useState({});
  const token = useFoodBankStorage((state) => state.token);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedProduct(null);
  };

  const hadleUpdateAviable = async (row) => {
    try {
      const updatedStatus = await updateStatusProduct(
        row.productsId,
        formUpdateAviable,
        token
      );

      // Update local state to reflect the change
      setSelectedProduct((prev) => {
        const updatedAvailableProducts = prev.available.map((item) =>
          item.id === updatedStatus?.data?.id
            ? {
                ...item,
                aviableStatus: updatedStatus?.data?.aviableStatus,
                updateAt: updatedStatus?.data?.updateAt,
              }
            : item
        );
        return { ...prev, available: updatedAvailableProducts };
      });

      // Clear form
      setFormUpdateAviable({});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog
      open={openDetailDialog}
      onClose={handleCloseDetailDialog}
      PaperProps={{
        sx: {
          width: "80vw",
          height: "80vh",
          maxWidth: "none", // Prevent default maxWidth constraints
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifySelf={"center"} gap={5}>
          <img
            style={{ width: "60px", height: "60px", borderRadius: "5px" }}
            src={`${URL}/product_img/${selectedProduct?.image}`}
          />
          <Typography variant="h2" fontFamily={"Noto Sans Lao"}>
            {selectedProduct?.name}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleCloseDetailDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[100],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                fontFamily: "Noto Sans Lao",
                fontWeight: "bold", // optional
                fontSize: "16px", // optional
              },
            }}
            rows={selectedProduct?.available ?? []}
            columns={[
              {
                field: "branchId",
                headerName: "ໄອດີສາຂາ",
                flex: 0.4,
                headerAlign: "center",
                align: "center",
              },
              {
                field: "branchName",
                headerName: "ຊື່ສາຂາ",
                flex: 1,
                headerAlign: "center",
                align: "center",
                renderCell: (params) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
                      {params.value}
                    </Typography>
                  </Box>
                ),
              },
              {
                field: "aviableStatus",
                headerName: "ສະຖານະສິນຄ້າ",
                flex: 0.5,
                headerAlign: "center",
                align: "center",
                renderCell: (params) =>
                  params.value ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Typography
                        color={ colors.greenAccent[400]}
                        sx={{ fontFamily: "Noto Sans Lao" }}
                      >
                        ອະນຸມັດ
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Typography
                        color={colors.redAccent[400]}
                        sx={{ fontFamily: "Noto Sans Lao" }}
                      >
                        ບໍ່ອະນຸມັດ
                      </Typography>
                    </Box>
                  ),
              },
              {
                field: "updateAt",
                headerName: "ວັນທີ່ອັປເດດ",
                flex: 1,
                headerAlign: "center",
                align: "center",
                renderCell: (params) => {
                  const date = new Date(params.value);
                  return isNaN(date)
                    ? "Invalid date"
                    : date.toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      });
                },
              },
              {
                field: "manage",
                headerName: "ຈັດການ",
                headerAlign: "center",
                align: "center",
                flex: 1,
                renderCell: (params) => {
                  return (
                    <Box display={"flex"} justifyContent={"center"} gap={2}>
                      <SelectStatus
                        setFormUpdateAviable={setFormUpdateAviable}
                        row={params.row}
                        formUpdateAviable={formUpdateAviable}
                        sx={{ height: "80%", alignSelf: "center" }}
                      />
                      <Button
                        onClick={() => hadleUpdateAviable(params.row)}
                        disabled={
                          !formUpdateAviable ||
                          formUpdateAviable.branchId !== params.row.branchId ||
                          formUpdateAviable.status === undefined
                        }
                        variant="contained"
                        sx={{
                          height: "80%",
                          alignSelf: "center",
                          fontFamily: "Noto Sans Lao",
                        }}
                      >
                        ສົ່ງຟອມ
                      </Button>
                    </Box>
                  );
                },
              },
            ]}
            getRowId={(row) => row.id}
            pageSize={5}
            rowsPerPageOptions={[5]}
            hideFooter
            disableSelectionOnClick
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDetailDialog}
          variant="contained"
          color="error"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetail;
