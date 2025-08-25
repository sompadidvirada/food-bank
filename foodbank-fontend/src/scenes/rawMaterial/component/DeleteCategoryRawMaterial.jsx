import { Box, Button, TextField } from "@mui/material";
import React from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { useState } from "react";
import { toast } from "react-toastify";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { deleteCategoryRawMetarial } from "../../../api/rawMaterial";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteCategoryRawMaterial = ({
  categoryRawMaterial,
  fecthCategoryRawMaterial,
}) => {
  const [open, setOpen] = useState(false);
  const token = useFoodBankStorage((state) => state.token);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    // reset selection
    setPersonName([]);

    // then close dialog or drawer
    setOpen(false);
  };
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmimtDeleteCategory = async () => {
    try {
      const ress = await deleteCategoryRawMetarial({ ids: personName }, token);
      fecthCategoryRawMaterial();
      // find names of deleted categories
      const deletedNames = personName
        .map((id) => categoryRawMaterial.find((cat) => cat.id === id)?.name)
        .filter(Boolean); // remove undefined

      // show toast
      toast.success(`ລົບໝວດໝູ່: ${deletedNames.join(", ")}`);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="error"
        onClick={handleClickOpen}
        sx={{ fontFamily: "Noto Sans Lao" }}
      >
        ລົບໝວດໝູ່ວັດຖຸດິບ
      </Button>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: { width: 400, maxWidth: "90%" }, // 👈 fixed dialog width
        }}
      >
        <DialogContent sx={{ minWidth: 350 }}>
          <InputLabel
            id="demo-multiple-checkbox-label"
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ເລືອກໝວດໝູ່ທີ່ຕ້ອງການຈະລົບ
          </InputLabel>
          <Select
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((id) => {
                  const item = categoryRawMaterial.find((cat) => cat.id === id);
                  return (
                    <Box
                      key={id}
                      sx={{
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        fontSize: 14,
                        fontFamily: "Noto Sans Lao",
                      }}
                    >
                      {item?.name}
                    </Box>
                  );
                })}
              </Box>
            )}
            MenuProps={MenuProps}
            sx={{ width: "100%" }}
          >
            {categoryRawMaterial.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                <Checkbox checked={personName.includes(cat.id)} />
                <ListItemText
                  primary={cat.name}
                  primaryTypographyProps={{
                    sx: { fontFamily: "Noto Sans Lao", fontSize: 14 },
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ fontFamily: "Noto Sans Lao" }}
            variant="contained"
            color="success"
            onClick={handleSubmimtDeleteCategory}
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
      </Dialog>
    </Box>
  );
};

export default DeleteCategoryRawMaterial;
