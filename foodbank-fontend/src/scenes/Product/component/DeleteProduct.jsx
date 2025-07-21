import {
  Box,
  IconButton,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../../theme";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { deleteProduct } from "../../../api/product";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const DeleteProduct = ({ productRow }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token);
  const getProduct = useFoodBankStorage((state) => state.getProduct);
  const [isUploading, setIsUploading] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleDelete = async () => {
    setIsUploading(true); // Show backdrop first

    setTimeout(() => {
      setOpenConfirm(false); // Close the dialog after deletion
    }, 50); // 50ms is usually enough

    try {
      await deleteProduct(productRow.id, token);
    } catch (err) {
      console.log(err);
    } finally {
      getProduct();
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Tooltip
        title="ລົບສິນຄ້າ"
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
        <IconButton onClick={() => setOpenConfirm(true)}>
          <DeleteIcon
            sx={{
              cursor: "pointer",
              color: colors.redAccent[500],
              "&:hover": {
                color: colors.redAccent[700],
              },
            }}
          />
        </IconButton>
      </Tooltip>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle fontFamily={"Noto Sans Lao"} fontSize={23}>
          ລົບລາຍການ
        </DialogTitle>
        <DialogContent>
          <Typography variant="laoText">
            ຕ້ອງການລົບລາຍການ <strong>{productRow.name}</strong> ແທ້ບໍ່ ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirm(false)}
            color="success"
            variant="contained"
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ຍົກເລີກ
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ຢືນຢັນ
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isUploading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default DeleteProduct;
