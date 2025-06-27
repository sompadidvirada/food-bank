import React from "react";
import { Box, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { tokens } from "../../../theme";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { updateTrackSell } from "../../../api/tracking";

const DialogEditExp = ({
  trackedProduct,
  selectFormtracksell,
  fetchDateBrachCheck,
}) => {
  const [open, setOpen] = React.useState(false);
  const [editCount, setEditCount] = React.useState("");
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
    setEditCount((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = {
      ...selectFormtracksell,
      productId: trackedProduct.productsId,
      sellCount: editCount.sellCount,
    };

    try {
      await updateTrackSell(updatedForm, token);
      fetchDateBrachCheck(); // Refresh the data
      handleClose();
    } catch (err) {
      console.error("Update Error:", err);
    }
  };
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{
          color: colors.blueAccent[200],
          backgroundColor: colors.blueAccent[700],
          ml: "10px",
        }}
      >
        Edit
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
        <DialogTitle>EDIT SELL COUNT</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ແກ້ໄຂຈຳນວນທີ່ໄດ້ຂາຍ " ເບີ່ງໃຫ້ດີກ່ອນກົດ "
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="sellCount"
            name="sellCount"
            label="Sell Count"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ bgcolor: colors.grey[100] }}>
            Cancel
          </Button>
          <Button type="submit" sx={{ bgcolor: colors.grey[100] }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DialogEditExp;
