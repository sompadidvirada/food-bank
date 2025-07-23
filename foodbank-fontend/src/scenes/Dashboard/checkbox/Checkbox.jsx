import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Typography, useTheme } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { tokens } from "../../../theme";

const Checkboxs = ({
  branch,
  selectedBranchIds = [],
  setSelectBranchs,
  selectBranchName,
  setSelectBranchName,
}) => {
  const [open, setOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClickOpen = () => {
    setLocalSelected(selectedBranchIds || []); // sync with parent
    setOpen(true);
  };

  const handleToggle = (id) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
    );
  };

  const handleAgree = () => {
    setSelectBranchs(localSelected); // Set the selected branch IDs

    // Find the full branch objects that match the selected IDs
    const selectedBranchObjects = branch.filter((b) =>
      localSelected.includes(b.id)
    );
    setSelectBranchName(selectedBranchObjects); // Set the full branch objects

    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="success"
        onClick={handleClickOpen}
        sx={{ color: colors.grey[900], fontWeight: "bold", fontFamily: "Noto Sans Lao" }}
      >
        ເລືອກສາຂາທີ່ບໍ່ຕ້ອງການລວມຍອດຂາຍ
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontFamily: "Noto Sans Lao" }}
        >
          {"ເລືອກສາຂາທີ່ບໍ່ຕ້ອງການໃຫ້ລວມຍອດຂາຍ"}
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            {branch?.map((item, index) => (
              <FormControlLabel
                key={`${item.id} + ${index}`}
                control={
                  <Checkbox
                    color="secondary"
                    checked={localSelected.includes(item.id)}
                    onChange={() => handleToggle(item.id)}
                  />
                }
                label={
                  <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
                    {item.branchname}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="error"
            sx={{ fontFamily: "Noto Sans Lao" }}
            variant="contained"
          >
            ຍົກເລີກ
          </Button>
          <Button
            onClick={handleAgree}
            autoFocus
            color="success"
            sx={{ fontFamily: "Noto Sans Lao" }}
            variant="contained"
          >
            ຍືນຢັນ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Checkboxs;
