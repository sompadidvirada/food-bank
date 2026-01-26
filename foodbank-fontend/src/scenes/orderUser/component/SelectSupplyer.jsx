import { Autocomplete, Box, Popper, styled, TextField, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../../../theme";

const StyledPopper = styled(Popper)({
  "& .MuiAutocomplete-option": {
    fontSize: "14px",
    fontFamily: "Noto Sans Lao, sans-serif",
  },
});

const SelectSupplyer = ({ supplyers, setSelectDateBrachCheck }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box>
      <Autocomplete
        disablePortal
        options={supplyers}
        getOptionLabel={(option) => option.name}
        sx={{
          width: 180,
          // input text
          "& .MuiInputBase-input": {
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Noto Sans Lao, sans-serif",
          },
          // dropdown options
          "& .MuiAutocomplete-option": {
            fontSize: "14px",
            fontFamily: "Noto Sans Lao, sans-serif",
          },
          // label
          "& .MuiInputLabel-root": {
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "Noto Sans Lao, sans-serif",
            color: colors.grey[100],
          },
        }}
        PopperComponent={StyledPopper}
        renderInput={(params) => <TextField {...params} label="ບໍລິສັດ/ຮ້ານ" />}
        onChange={(event, value) => {
          setSelectDateBrachCheck((prev) => ({
            ...prev,
            supplyerId: value ? value.id : null,
          }));
        }}
      />
    </Box>
  );
};

export default SelectSupplyer;
