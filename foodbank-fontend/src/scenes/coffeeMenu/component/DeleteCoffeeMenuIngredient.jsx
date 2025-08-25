import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { deleteMenuIngredient } from "../../../api/coffeeMenu";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteCoffeeMenuIngredient = ({ row, setSelectitem }) => {
  const token = useFoodBankStorage((state) => state.token);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const ress = await deleteMenuIngredient(row.id, token);
      toast.success(`ລົບລາຍການ`);
      setSelectitem((prev) => prev.filter((item) => item.id !== ress.data.id));
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error(`ລອງໃຫ່ມພາຍຫຼັງ`)
    }
  };

  return (
    <Box>
      <IconButton onClick={handleClickOpen}>
        <Tooltip
          title="ລົບລາຍການການນີ້"
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
          <RemoveCircleOutlineIcon />
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
        <DialogTitle
          sx={{ fontFamily: "Noto Sans Lao" }}
        >{`ຕ້ອງການລົບ "${row?.rawMaterialName}"  ອອກຈາກເມນູນີ້ແທ້ບໍ່?`}</DialogTitle>
        <DialogActions>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="success"
            sx={{ fontFamily: "Noto sans Lao" }}
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteCoffeeMenuIngredient;
