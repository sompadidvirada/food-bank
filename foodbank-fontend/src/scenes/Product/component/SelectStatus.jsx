import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import React from "react";

const SelectStatus = ({ setFormUpdateAviable, row, formUpdateAviable }) => {

  const handleChange = (event) => {
    const value = event.target.value === "true";

    setFormUpdateAviable({
      branchId: row.branchId,
      status: value,
    });

  };

  return (
    <FormControl>
      <Select
        labelId="status-select-label"
        displayEmpty
        value={
          formUpdateAviable?.branchId === row.branchId
            ? String(formUpdateAviable?.status)
            : ""
        }
        onChange={handleChange}
        sx={{
          height: 40,
          fontSize: "0.9rem",
          "& .MuiSelect-select": {
            paddingTop: 1,
            paddingBottom: 1,
          },
          fontFamily:"Noto Sans Lao"
        }}
      >
        <MenuItem value="" disabled>
          <Typography  sx={{fontFamily:"Noto Sans Lao"}}>ເລືອກສະຖານະ</Typography>
        </MenuItem>
        <MenuItem value="true" sx={{fontFamily:"Noto Sans Lao"}}>ອະນຸມັດ</MenuItem>
        <MenuItem value="false" sx={{fontFamily:"Noto Sans Lao"}}>ບໍ່ອະນຸມັດ</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectStatus;
