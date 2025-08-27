import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";

const FilterReportDialog = ({ reportCoffeeUse, setFilteredReport, colors }) => {
  const [open, setOpen] = useState(false);

  // local selection of materialVariantIds
  const [localSelected, setLocalSelected] = useState(
    reportCoffeeUse.map((item) => item.materialVariantId)
  );

  const allIds = reportCoffeeUse.map((item) => item.materialVariantId);
  const allSelected = localSelected.length === allIds.length;
  const partiallySelected =
    localSelected.length > 0 && localSelected.length < allIds.length;

  // toggle individual item
  const handleToggle = (id) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // toggle select all
  const handleToggleAll = () => {
    if (allSelected) {
      setLocalSelected([]); // unselect all
    } else {
      setLocalSelected(allIds); // select all
    }
  };

  const handleAgree = () => {
    const filtered = reportCoffeeUse.filter((item) =>
      localSelected.includes(item.materialVariantId)
    );
    setFilteredReport(filtered);
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  // reset localSelected if reportCoffeeUse changes
  useEffect(() => {
    setLocalSelected(reportCoffeeUse.map((item) => item.materialVariantId));
  }, [reportCoffeeUse]);

  return (
    <Box sx={{ justifySelf:"center"}}>
      <Button
        variant="contained"
        color="success"
        onClick={() => setOpen(true)}
        sx={{
          color: colors.grey[900],
          fontWeight: "bold",
          fontFamily: "Noto Sans Lao",
        }}
      >
        ເລືອກວັດຖຸດິບທີ່ຈະສະແດງ
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontFamily: "Noto Sans Lao" }}>
          ເລືອກວັດຖຸດິບທີ່ຈະສະແດງ
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            {/* ✅ Select All / Unselect All */}
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={allSelected}
                  indeterminate={partiallySelected}
                  onChange={handleToggleAll}
                />
              }
              label={
                <Typography
                  sx={{ fontFamily: "Noto Sans Lao", fontWeight: "bold" }}
                >
                  {allSelected ? "ຍົກເລີກທັງໝົດ" : "ເລືອກທັງໝົດ"}
                </Typography>
              }
            />

            {/* ✅ Individual checkboxes */}
            {reportCoffeeUse.map((item) => (
              <FormControlLabel
                key={item.materialVariantId}
                control={
                  <Checkbox
                    color="secondary"
                    checked={localSelected.includes(item.materialVariantId)}
                    onChange={() => handleToggle(item.materialVariantId)}
                  />
                }
                label={
                  <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
                    {item.rawMaterialName}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAgree}
            autoFocus
            color="success"
            sx={{ fontFamily: "Noto Sans Lao" }}
            variant="contained"
          >
            ຍືນຢັນ
          </Button>
          <Button
            onClick={handleClose}
            color="error"
            sx={{ fontFamily: "Noto Sans Lao" }}
            variant="contained"
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FilterReportDialog;
