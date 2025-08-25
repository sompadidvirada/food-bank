import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { removeRawMaterial } from "../../../api/rawMaterial";
import { toast } from "react-toastify";
import useFoodBankStorage from "../../../zustand/foodbank-storage";

const DeleteRawMaterial = ({ row, fecthAllRawMaterial }) => {
  const [open, setOpen] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const token = useFoodBankStorage((state)=>state.token)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setOpenBackdrop(true)
    try{
        const ress = await removeRawMaterial(row?.id,token)
        fecthAllRawMaterial()
        setOpenBackdrop(false)
        handleClose()
        toast.success(`ລົບລາຍການ ${row?.name} ສຳເລັດ`)
    }catch(err) {
        setOpenBackdrop(false)
        console.log(err)
        toast.error(`error.`)
    }
  }
  return (
    <Box>
      <IconButton color="error" onClick={handleClickOpen}>
        <Tooltip
          title="ລົບລາຍການວັດຖຸດິບ"
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
          <DeleteIcon />
        </Tooltip>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontFamily:"Noto Sans Lao", fontSize:18}}>
          {`ຕ້ອງການລົບລາຍການ ${row?.name} ແທ້ບໍ່ ?`}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            autoFocus
            variant="contained"
            color="success"
            sx={{ fontFamily: "Noto Sans Lao" }}
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
        {openBackdrop && (
          <Backdrop
            open
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: (theme) => theme.zIndex.modal + 1, // ensure above dialog
            }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Dialog>
    </Box>
  );
};

export default DeleteRawMaterial;
