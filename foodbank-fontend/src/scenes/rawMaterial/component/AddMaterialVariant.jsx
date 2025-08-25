import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import React from "react";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { tokens } from "../../../theme";
import { createMaterialVariant } from "../../../api/rawMaterial";
import { toast } from "react-toastify";
import { useMemo } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddMaterialVariant = ({ row, handleCloseParent, selectItem,parentData }) => {
  const [open, setOpen] = useState(false);
  const token = useFoodBankStorage((state) => state.token);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [formData, setFormData] = useState({
    variantName: "",
    quantityInParent: "",
    costPriceKip: row?.costPriceKip,
    sellPriceKip: row?.sellPriceKip,
    costPriceBath: row?.costPriceBath,
    sellPriceBath: row?.sellPriceBath,
    barcode: "",
    rawMaterialId: row?.rawMaterialId,
    parentVariantId: row?.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "quantityInParent") {
        if (!value) {
          // Reset to original pack prices
          updated.costPriceKip = row?.costPriceKip || "";
          updated.sellPriceKip = row?.sellPriceKip || "";
          updated.costPriceBath = row?.costPriceBath || "";
          updated.sellPriceBath = row?.sellPriceBath || "";
        } else {
          const qty = parseFloat(value) || 1;

          updated.costPriceKip = row?.costPriceKip
            ? (parseFloat(row.costPriceKip) / qty).toFixed(6)
            : "";

          updated.sellPriceKip = row?.sellPriceKip
            ? (parseFloat(row.sellPriceKip) / qty).toFixed(6)
            : "";

          updated.costPriceBath = row?.costPriceBath
            ? (parseFloat(row.costPriceBath) / qty).toFixed(6)
            : "";

          updated.sellPriceBath = row?.sellPriceBath
            ? (parseFloat(row.sellPriceBath) / qty).toFixed(6)
            : "";
        }
      }

      return updated;
    });
  };


  const handleClickOpen = () => {
    setFormData({
    variantName: "",
    quantityInParent: "",
    costPriceKip: row?.costPriceKip,
    sellPriceKip: row?.sellPriceKip,
    costPriceBath: row?.costPriceBath,
    sellPriceBath: row?.sellPriceBath,
    barcode: "",
    rawMaterialId: row?.rawMaterialId,
    parentVariantId: row?.id,
  });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFormData({
      variantName: "",
      quantityInParent: "",
      costPriceKip: "",
      sellPriceKip: "",
      costPriceBath: "",
      sellPriceBath: "",
      barcode: "",
      rawMaterialId: "",
      quantityInParent: "",
    });
  };

  const handleSubmit = async (e) => {
    setOpenBackdrop(true);
    e.preventDefault();
    try {
      const ress = await createMaterialVariant(formData, token);
      toast.success(`ສ້າງບັນຈຸພັນສຳເລັດ`);
      handleClose();
      handleCloseParent();
      setOpenBackdrop(false);
    } catch (err) {
      console.log(err);
      setOpenBackdrop(false);
      toast.error(`error`);
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
      <IconButton color="success" onClick={handleClickOpen} disabled={isDisabled}>
        <Tooltip
          title="ເພີ່ມບັນຈຸພັນວັດຖຸດິບ"
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
          <PublishedWithChangesIcon />
        </Tooltip>
      </IconButton>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle fontFamily={"Noto Sans Lao"}>
          {`ເພີ່ມລາຍການວັດຖຸດິບບັນຈຸພັນສຳລັບ ${parentData?.name} ${row?.variantName}`}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Text Input */}
            <TextField
              label="ຊື່ບັນຈຸພັນ"
              helperText='ຍົກຕົວຢ່າງເຊັ່ນ ຖ້າເປັນຄີມທຽມບັນຈຸພັນແກັດ ໃຫ້ໃສ່ວ່າ "1 ແກັດ"'
              FormHelperTextProps={{
                sx: {
                  fontFamily: "Noto Sans Lao",
                  fontSize: "14px",
                },
              }}
              required
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Noto Sans Lao",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Noto Sans Lao",
                  color: colors.grey[100],
                  opacity: 0.5,
                },
                "& .MuiInputLabel-shrink": {
                  // 👇 fix label cut when shrink
                  transform: "translate(14px, -9px) scale(0.75)",
                  fontFamily: "Noto Sans Lao",
                },
                mt: 1,
              }}
              name="variantName"
              value={formData.variantName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="ບາໂຄດ"
              required
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Noto Sans Lao",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Noto Sans Lao",
                  color: colors.grey[100],
                  opacity: 0.5,
                },
                "& .MuiInputLabel-shrink": {
                  // 👇 fix label cut when shrink
                  transform: "translate(14px, -9px) scale(0.75)",
                  fontFamily: "Noto Sans Lao",
                },
                mt: 1,
              }}
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="ຈຳນວນຂອງບັນຈຸພັນ"
              type="number"
              required
              helperText='ຍົກຕົວຢ່າງເຊັ່ນ ຄີມທຽມ 1 ແກັດມີ 12 ຖົງ ໃຫ້ໃສ່ "12"'
              FormHelperTextProps={{
                sx: {
                  fontFamily: "Noto Sans Lao",
                  fontSize: "14px",
                },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Noto Sans Lao",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Noto Sans Lao",
                  color: colors.grey[100],
                  opacity: 0.5,
                },
                "& .MuiInputLabel-shrink": {
                  // 👇 fix label cut when shrink
                  transform: "translate(14px, -9px) scale(0.75)",
                  fontFamily: "Noto Sans Lao",
                },
                mt: 1,
              }}
              name="quantityInParent"
              value={formData.quantityInParent}
              onChange={handleChange}
              fullWidth
            />
            <Box display={"flex"} gap={2}>
              <TextField
                label="ລາຄາຕົ້ນທືນກິບ"
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Noto Sans Lao",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Noto Sans Lao",
                    color: colors.grey[100],
                    opacity: 0.5,
                  },
                  "& .MuiInputLabel-shrink": {
                    // 👇 fix label cut when shrink
                    transform: "translate(14px, -9px) scale(0.75)",
                    fontFamily: "Noto Sans Lao",
                  },
                }}
                name="costPriceKip"
                type="number"
                value={formData.costPriceKip}
                onWheel={(e) => e.target.blur()} // 👈 prevent scroll changing value
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="ລາຄາຂາຍເງີນກີບ"
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Noto Sans Lao",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Noto Sans Lao",
                    color: colors.grey[100],
                    opacity: 0.5,
                  },
                  "& .MuiInputLabel-shrink": {
                    // 👇 fix label cut when shrink
                    transform: "translate(14px, -9px) scale(0.75)",
                    fontFamily: "Noto Sans Lao",
                  },
                }}
                name="sellPriceKip"
                type="number"
                value={formData.sellPriceKip}
                onWheel={(e) => e.target.blur()} // 👈 prevent scroll changing value
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <Box display={"flex"} gap={2}>
              <TextField
                label="ລາຄາຕົ້ນທືນບາດ"
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Noto Sans Lao",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Noto Sans Lao",
                    color: colors.grey[100],
                    opacity: 0.5,
                  },
                  "& .MuiInputLabel-shrink": {
                    // 👇 fix label cut when shrink
                    transform: "translate(14px, -9px) scale(0.75)",
                    fontFamily: "Noto Sans Lao",
                  },
                }}
                name="costPriceBath"
                type="number"
                value={formData.costPriceBath}
                onWheel={(e) => e.target.blur()} // 👈 prevent scroll changing value
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="ລາຄາຂາຍເງີນບາດ"
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Noto Sans Lao",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Noto Sans Lao",
                    color: colors.grey[100],
                    opacity: 0.5,
                  },
                  "& .MuiInputLabel-shrink": {
                    // 👇 fix label cut when shrink
                    transform: "translate(14px, -9px) scale(0.75)",
                    fontFamily: "Noto Sans Lao",
                  },
                }}
                name="sellPriceBath"
                type="number"
                value={formData.sellPriceBath}
                onWheel={(e) => e.target.blur()} // 👈 prevent scroll changing value
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <DialogActions>
              <Button
                sx={{ fontFamily: "Noto Sans Lao" }}
                variant="contained"
                type="submit"
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
          </Box>
        </DialogContent>
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

export default AddMaterialVariant;
