import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { tokens } from "../../../theme";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { updateTrackExp, updateTrackSell } from "../../../api/tracking";
import { toast } from "react-toastify";

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
      expCount: editCount.expCount,
    };

    try {
      await updateTrackExp(updatedForm, token);
      fetchDateBrachCheck(); // Refresh the data
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
          ແກ້ໄຂຈຳນວນໝົດອາຍຸ
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Noto Sans Lao" }}>
            ແກ້ໄຂຈຳນວນທີ່ໝົດອາຍຸ " ເບີ່ງໃຫ້ດີກ່ອນກົດ "
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="expCount"
            name="expCount"
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

export default DialogEditExp;
