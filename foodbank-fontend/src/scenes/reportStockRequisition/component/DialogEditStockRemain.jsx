import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { tokens } from "../../../theme";
import { editStockRemain } from "../../../api/stockRemain";

const DialogEditStockRemain = ({ stock, variant, fecthStockRemain }) => {
  const [open, setOpen] = React.useState(false);
  const [editCount, setEditCount] = React.useState({
    id: "",
    count: "",
    materialVariantId: "",
  });
  const token = useFoodBankStorage((state) => state.token);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleEditStock = async (id, count) => {
    try {
      const ress = await editStockRemain(id, count, token);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setEditCount({
      id: variant?.rawMaterialId,
      count: stock?.calculatedStock,
      materialVariantId: variant?.materialVariantId,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditCount({
      id: "",
      count: "",
      materialtVariantId: "",
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setEditCount((prev) => ({
      ...prev,
      [name]: name === "count" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleEditStock(
        editCount?.id,
        {
          editCount: editCount?.count,
          materialVariantId: editCount?.materialVariantId,
        },
        token
      );
      fecthStockRemain();
      handleClose();
    } catch (err) {
      console.error("Update Error:", err);
      toast.error(err.response.data.message);
    }
  };
  return (
    <React.Fragment>
      <Typography
        sx={{
          fontFamily: "Noto Sans Lao",
          fontSize: 13,
          whiteSpace: "normal",
          wordBreak: "break-word",
          cursor: "pointer",
          "&:hover": {
            color: colors.greenAccent[500], // Replace with your desired hover color
          },
        }}
        onClick={handleClickOpen}
        color={colors.greenAccent[200]}
      >
        {stock?.calculatedStock
          ? `${stock.calculatedStock.toLocaleString()} (${
              variant?.variantName
            }) `
          : `0`}
      </Typography>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: handleSubmit,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Noto Sans Lao" }}>
          ແກ້ໄຂຈຳນວນຍອດຂາຍ
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Noto Sans Lao" }}>
            ແກ້ໄຂຈຳນວນສະຕ໋ອກຄົງເຫລືອ " ເບີ່ງໃຫ້ດີກ່ອນກົດ "
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="count"
            name="count"
            value={editCount?.count}
            label={<Typography variant="laoText">ຈຳນວນແກ້ໄຂ</Typography>}
            type="number"
            fullWidth
            variant="standard"
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            sx={{ fontFamily: "Noto Sans Lao" }}
            variant="contained"
            color="success"
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={handleClose}
            sx={{ fontFamily: "Noto Sans Lao" }}
            variant="contained"
            color="error"
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DialogEditStockRemain;
