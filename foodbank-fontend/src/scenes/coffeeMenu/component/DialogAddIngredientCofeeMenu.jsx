import {
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import InputAdornment from "@mui/material/InputAdornment";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { tokens } from "../../../theme";
import { addIngredientCoffeeMenu } from "../../../api/coffeeMenu";
import { toast } from "react-toastify";
const URLMATERIAL =
  "https://treekoff-storage-rawmaterials.s3.ap-southeast-2.amazonaws.com";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogAddIngredientCofeeMenu = ({
  parentData,
  materialVariantChildOnly,
  setSelectitem,
  selectItem,
  fecthCoffeeMenuIngredientByMenuId
}) => {
  const [open, setOpen] = React.useState(false);
  const token = useFoodBankStorage((state) => state.token);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = React.useState({
    quantity: "",
    unit: "",
    coffeeMenuId: "",
    materialVariantId: "",
  }); // ✅ selected state

  const selectedOption = materialVariantChildOnly.find(
    (opt) => opt.materialVariantLastChildId === selected.materialVariantId
  );


  const handleAddIngredientCoffeeMenu = async () => {
    try {
      const ress = await addIngredientCoffeeMenu(selected, token);
      fecthCoffeeMenuIngredientByMenuId(parentData.id)
      toast.success(`ເພີມວັດຖຸດິບສຳເລັດ`);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (parentData?.id) {
      setSelected((prev) => ({
        ...prev,
        coffeeMenuId: parentData.id,
      }));
    }
  }, [parentData,selectedOption]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected({
      quantity: "",
      unit: "",
      materialVariantId: "",
    });
  };
  return (
    <Box>
      <IconButton color="success" onClick={handleClickOpen}>
        <Tooltip
          title="ເພີ່ມວັດຖຸດິບໃໝ່ເຂົ້າເມນູນີ້"
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
          <AddCircleOutlineIcon />
        </Tooltip>
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
        >{`ເລືອກເມນູທີ່ຈະເພີ່ມເຂົ້າເມນູ ${parentData?.name}`}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column", // stack vertically
              gap: 2,
            }}
          >
            <Select
              value={selected.materialVariantId}
              onChange={(e) => {
                const selectedId = e.target.value;
                const option = materialVariantChildOnly.find(
                  (opt) => opt.materialVariantLastChildId === selectedId
                );
                setSelected((prev) => ({
                  ...prev,
                  materialVariantId: selectedId,
                  unit: option?.sizeUnit || "", // now it’s correct
                }));
              }}
              displayEmpty
              fullWidth
              renderValue={(selected) => {
                if (!selected)
                  return (
                    <em style={{ fontFamily: "Noto Sans Lao" }}>
                      ເລືອກວັດຖຸດິບ
                    </em>
                  );
                return (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      src={selectedOption?.image ? `${URLMATERIAL}/${selectedOption?.image}` : `${URLMATERIAL}/coffee-default.png`}
                      alt={selectedOption?.name}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography fontFamily={"Noto Sans Lao"}>
                      {selectedOption?.name}
                    </Typography>
                  </Box>
                );
              }}
            >
              {materialVariantChildOnly.map((opt) => (
                <MenuItem key={opt.id} value={opt.materialVariantLastChildId}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      src={opt.image ? `${URLMATERIAL}/${opt.image}` : `${URLMATERIAL}/coffee-default.png`}
                      alt={opt.name}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography fontFamily={"Noto Sans Lao"}>
                      {opt.name}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="ປະລິມານທີ່ໃຊ້"
              id="outlined-start-adornment"
              type="number"
              value={selected?.quantity}
              onWheel={(e) => e.target.blur()}
              onChange={(e) => {
                setSelected((prev) => ({
                  ...prev,
                  quantity: e.target.value, // keep it as string
                }));
              }}
              sx={{
                m: 1,
                width: "25ch",
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
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      {selectedOption?.sizeUnit ? selectedOption?.sizeUnit : ""}
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddIngredientCoffeeMenu}
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
      </Dialog>
    </Box>
  );
};

export default DialogAddIngredientCofeeMenu;
