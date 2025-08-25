import { Box, colors, Popper, styled, TextField } from "@mui/material";
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import useFoodBankStorage from "../../../zustand/foodbank-storage";

const StyledPopper = styled(Popper)({
  "& .MuiAutocomplete-option": {
    fontSize: "14px",
    fontFamily: "Noto Sans Lao, sans-serif",
  },
});

const SelectBracnhCoffeeSell = ({
  setSelectFormtracksend,
  setSelectDateBrachCheck,
}) => {
  const branches = useFoodBankStorage((state) => state.branchs);
  return (
    <Box>
      <Autocomplete
        disablePortal
        options={branches}
        getOptionLabel={(option) => option.branchname}
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
        renderInput={(params) => <TextField {...params} label="ສາຂາ" />}
        onChange={(event, value) => {
          setSelectFormtracksend((prev) => ({
            ...prev,
            brachId: value ? value.id : null,
          }));
          setSelectDateBrachCheck((prev) => ({
            ...prev,
            brachId: value ? value.id : null,
          }));
        }}
      />
    </Box>
  );
};

export default SelectBracnhCoffeeSell;
