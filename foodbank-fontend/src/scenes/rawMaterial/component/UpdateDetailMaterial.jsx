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
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { tokens } from "../../../theme";
import {
  updateMaterialVariant,
} from "../../../api/rawMaterial";
import { toast } from "react-toastify";
import EditNoteIcon from "@mui/icons-material/EditNote";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateDetailMaterial = ({
  row,
  handleCloseParent,
  selectItem,
  parentData,
  fecthAllRawMaterial
}) => {
  const [open, setOpen] = useState(false);
  const token = useFoodBankStorage((state) => state.token);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [formData, setFormData] = useState({
    variantName: "",
    costPriceKip: row?.costPriceKip,
    sellPriceKip: row?.sellPriceKip,
    costPriceBath: row?.costPriceBath,
    sellPriceBath: row?.sellPriceBath,
    barcode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickOpen = () => {
    setFormData({
      variantName: row?.variantName,
      costPriceKip: row?.costPriceKip,
      sellPriceKip: row?.sellPriceKip,
      costPriceBath: row?.costPriceBath,
      sellPriceBath: row?.sellPriceBath,
      barcode: row?.barcode,
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
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ress = await updateMaterialVariant(row?.id, formData, token);
      fecthAllRawMaterial()
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

  return (
    <Box>
      <IconButton color="info" onClick={handleClickOpen}>
        <Tooltip
          title="ແກ້ໄຂລາຍລະອຽດຂອງບັນຈຸພັນນິ້"
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
          <EditNoteIcon />
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
          {`ແກ້ໄຂລາຍການບັນຈຸພັນ ${parentData?.name} ${row?.variantName}`}
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

            <Box display={"flex"} gap={2}>
              <TextField
                label="ລາຄາຕົ້ນທືນກິບ"
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

export default UpdateDetailMaterial;
