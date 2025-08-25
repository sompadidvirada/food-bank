import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { tokens } from "../../../theme";
import { updateStockRequisition } from "../../../api/rawMaterial";
import { toast } from "react-toastify";

const DialogEdit = ({ trackedProduct, setChecked }) => {
  const [open, setOpen] = useState(false);
  const [editCount, setEditCount] = useState("");
  const token = useFoodBankStorage((state) => state.token);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setEditCount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ress = await updateStockRequisition(
        trackedProduct.id,
        { quantityRequisition: editCount },
        token
      );
      setChecked((prev) =>
        prev.map(
          (item) => (item.id === ress.data.id ? ress.data : item) // leave others unchanged
        )
      );
      setEditCount("");
      handleClose();
    } catch (err) {
      console.error("Update Error:", err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        color="info"
        sx={{
          fontFamily: "Noto Sans Lao",
          ml: 2,
        }}
      >
        ແກ້ໄຂ
      </Button>
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
          ແກ້ໄຂຈຳນວນຍອດຈັດສົ່ງ
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Noto Sans Lao" }}>
            ແກ້ໄຂຈຳນວນທີ່ໄດ້ຈັດສົ່ງ " ເບີ່ງໃຫ້ດີກ່ອນກົດ "
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="quantityRequisition"
            name="quantityRequisition"
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

export default DialogEdit;
