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
    <FormControl sx={{ minWidth: 160, textAlign: "center", height: 48 }}>
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
        }}
      >
        <MenuItem value="" disabled>
          <Typography>Select Status</Typography>
        </MenuItem>
        <MenuItem value="true">AVAILABLE</MenuItem>
        <MenuItem value="false">UNAVAILABLE</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectStatus;
