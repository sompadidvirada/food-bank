import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { deleteMaterialVariant } from "../../../api/rawMaterial";
import { toast } from "react-toastify";
import { useMemo } from "react";

const DeleteDetailDialog = ({ row,handleCloseParent,selectItem  }) => {
  const [open, setOpen] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const token = useFoodBankStorage((state) => state.token);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setOpenBackdrop(true);
    try {
      const ress = await deleteMaterialVariant(row?.id, token);
      setOpenBackdrop(false);
      handleClose();
      handleCloseParent()
      toast.success(`ລົບລາຍການ ${row?.variantName} ສຳເລັດ`);
    } catch (err) {
      setOpenBackdrop(false);
      console.log(err);
      toast.error(`error.`);
    }
  };

   const isDisabled = useMemo(() => {
      if (!selectItem) return false;
      // Case 1: row.id is already a parentVariantId
      const isParentUsed = selectItem.some(
        (item) => item.parentVariantId === row?.id
      );
      return isParentUsed ;
    }, [selectItem, row]);
  return (
    <Box>
      <IconButton color="error" onClick={handleClickOpen} disabled={isDisabled}>
        <Tooltip
          title="ລົບລາຍການບັນຈຸພັນນິ້"
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
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontFamily: "Noto Sans Lao", fontSize: 18 }}
        >
          {`ຕ້ອງການລົບລາຍການ ${row?.variantName} ແທ້ບໍ່ ?`}
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

export default DeleteDetailDialog;
