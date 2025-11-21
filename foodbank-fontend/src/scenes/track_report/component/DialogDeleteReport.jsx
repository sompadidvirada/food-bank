import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";

const DialogDeleteReport = ({
  openDeleteReport,
  setOpenDeleteReport,
  setSelectItemDelete,
  handleDeleteReport
}) => {
  const handleClose = () => {
    setOpenDeleteReport(false);
    setSelectItemDelete("");
  };
  
  return (
    <Dialog open={openDeleteReport} onClose={handleClose}>
      <DialogTitle sx={{ fontFamily: "Noto Sans Lao" }}>
        ຕ້ອງການລົບລາຍງານນີ້ແມ້ບໍ່?
      </DialogTitle>
      <DialogActions>
        <Button
          sx={{ fontFamily: "Noto Sans Lao" }}
          variant="contained"
          color="success"
          onClick={handleDeleteReport}
        >
          ຢືນຢັນ
        </Button>
        <Button
          sx={{ fontFamily: "Noto Sans Lao" }}
          variant="outlined"
          color="error"
          onClick={handleClose}
        >
          ກັບຄຶນ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDeleteReport;
