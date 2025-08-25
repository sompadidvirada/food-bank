import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { updateIngredientCoffeeMenu } from "../../../api/coffeeMenu";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditIngredientCoffeeMenu = ({ row, setSelectitem }) => {
  const token = useFoodBankStorage((state) => state.token);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateCategoryRawMaterial = async (event) => {
    event.preventDefault();
    const form = event.currentTarget; // 👈 reference the form
    const formData = new FormData(event.currentTarget);
    const quantity = formData.get("quantity");
    if (!quantity) {
      return;
    }
    try {
      const ress = await updateIngredientCoffeeMenu(
        row.id,
        { quantity: quantity },
        token
      );
      setSelectitem((prev) =>
        prev.map((item) => (item.id === ress.data.id ? ress.data : item))
      );
      toast.success(`ແກ້ໄຂບໍລິມາດສຳເລັດ`);
      form.reset(); // 👈 reset all fields
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <IconButton onClick={handleClickOpen}>
        <Tooltip
          title="ແກ້ໄຂບໍລິມາດວັດຖຸດິບ"
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
          <ChangeCircleIcon />
        </Tooltip>{" "}
      </IconButton>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={handleCreateCategoryRawMaterial}>
          <DialogContent>
            <TextField
              name="quantity"
              helperText="ກະລຸນາໃສ່ຈຳນວນບໍລິມາດທີ່ຕ້ອງການແກ້ໄຂ"
              id="demo-helper-text-misaligned"
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

export default EditIngredientCoffeeMenu;
