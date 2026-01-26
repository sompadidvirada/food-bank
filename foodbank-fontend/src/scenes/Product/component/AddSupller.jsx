import React, { useState } from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { createSupplyer } from "../../../api/suppler";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddSupller = () => {
  const [open, setOpen] = useState(false);
  const token = useFoodBankStorage((state) => state.token);
  const [form, setForm] = useState({
    name: "",
    order_range_date: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm({
    name: "",
    order_range_date: "",
  })
  };

  const handLeSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data:", form);

    const payload = {
      name: form.name,
      order_range_date: Number(form.order_range_date),
    };

    try {
      const ress = await createSupplyer(payload, token);
      console.log(ress);
    } catch (err) {
      console.log(err);
    } finally {
        handleClose()
    }
  };
  return (
    <Box>
      <Button
        variant="contained"
        color="info"
        sx={{ fontWeight: "bold", fontFamily: "Noto Sans Lao" }}
        onClick={handleClickOpen}
      >
        ເພີ່ມບໍລິສັດຜູ້ສະໜອງ
      </Button>

      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ fontFamily: "Noto Sans Lao", alignSelf: "center" }}>
          {"ເພີ່ມບໍລິສັດຜູ້ສະໜອງ"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handLeSubmit}>
            <Box display="flex" flexDirection={"column"} gap={5}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ຊື່ບໍລິສັດ..."
                name="name"
                value={form.name}
                onChange={handleChange}
                InputLabelProps={{
                  sx: {
                    fontFamily: "Noto Sans Lao",
                    fontSize: "14px",
                  },
                }}
              />

              <FormControl sx={{ width: "200px" }}>
                <InputLabel
                  id="category-label"
                  sx={{ fontFamily: "Noto Sans Lao" }}
                >
                  ມື້ຮອບສັ່ງອໍເດີ
                </InputLabel>
                <Select
                  labelId="order_range_date"
                  id="order_range_date"
                  name="order_range_date"
                  value={form.order_range_date}
                  onChange={handleChange}
                  sx={{ fontFamily: "Noto Sans Lao" }}
                >
                  <MenuItem value={3} sx={{ fontFamily: "Noto Sans Lao" }}>
                    3 ວັນ
                  </MenuItem>
                  <MenuItem value={7} sx={{ fontFamily: "Noto Sans Lao" }}>
                    7 ວັນ
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px" gap={3}>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ fontFamily: "Noto Sans Lao" }}
              >
                ສ້າງໝວດໝູ່
              </Button>
              <Button
                onClick={handleClose}
                color="error"
                variant="contained"
                sx={{ fontFamily: "Noto Sans Lao" }}
              >
                ຍົກເລີກ
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddSupller;
