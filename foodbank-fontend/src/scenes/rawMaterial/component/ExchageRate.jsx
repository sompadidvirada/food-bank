import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  TextField,
} from "@mui/material";
import React, { useRef } from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { useState } from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { exchangeRateCalcurate } from "../../../api/rawMaterial";
import { toast } from "react-toastify";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ExchageRate = ({ fecthAllRawMaterial }) => {
  const token = useFoodBankStorage((state) => state.token);
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (formRef.current) {
    formRef.current.reset();
  }
  };

  const handleExchangeRate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    const exchangeRate = formData.get("exchangeRate");
    if (!exchangeRate) {
      return;
    }
    try {
      const ress = await exchangeRateCalcurate(
        { exchangeRate: exchangeRate },
        token
      );
      console.log(ress);
      fecthAllRawMaterial();
      toast.success(`ອັປເດດເລດເງີນ ${exchangeRate} ສຳເລັດ`);
      handleClose();
      form.reset();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box>
      <Button
        color="secondary"
        variant="contained"
        sx={{ fontFamily: "Noto Sans Lao" }}
        startIcon={<AttachMoneyIcon />}
        onClick={handleClickOpen}
      >
        ປ່ຽນເລດເງີນ
      </Button>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={handleExchangeRate} ref={formRef}>
          <DialogContent>
            <TextField
              name="exchangeRate"
              helperText="ໃສ່ເລດເງີນທີ່ຕ້ອງການປ່ຽນລາຄາສິນຄ້າ..."
              id="demo-helper-text-misaligned"
              type="number"
              onWheel={(e) => e.target.blur()}
              inputProps={{
                min: 1,
              }}
              FormHelperTextProps={{
                sx: {
                  fontFamily: "Noto Sans Lao",
                  fontSize: "14px",
                },
              }}
              sx={{
                "& .MuiInputBase-input": { fontFamily: "Noto Sans Lao" }, // 👈 input text
                "& .MuiInputLabel-root": { fontFamily: "Noto Sans Lao" }, // 👈 label text
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              sx={{ fontFamily: "Noto Sans Lao" }}
              variant="contained"
              color="success"
            >
              ສົ່ງຟອມ
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
        </form>
      </Dialog>
    </Box>
  );
};

export default ExchageRate;
