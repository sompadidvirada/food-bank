import { Box, Button, TextField } from "@mui/material";
import React from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { useState } from "react";
import { createCategoryRawMaterial } from "../../../api/rawMaterial";
import { toast } from "react-toastify";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddCategoryMaterial = ({fecthCategoryRawMaterial}) => {
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
    const category = formData.get("categoryMaterialName");
    if (!category) {
      return;
    }
    try {
      const ress = await createCategoryRawMaterial(
        { categoryMaterialName: category },
        token
      );
      fecthCategoryRawMaterial()
      toast.success(`ເພີ່ມໝວດໝູ່ ${category} ສຳເລັດ`)
      form.reset(); // 👈 reset all fields
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="info"
        onClick={handleClickOpen}
        sx={{ fontFamily: "Noto Sans Lao" }}
      >
        ເພີ່ມໝວດໝູ່ວັດຖຸດິບ
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
        <form onSubmit={handleCreateCategoryRawMaterial}>
          <DialogContent>
            <TextField
              name="categoryMaterialName"
              helperText="ກະລຸນາເພີ່ມຊື່ຂອງໝວດໝູ່ວັດຖຸດິບ..."
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

export default AddCategoryMaterial;
