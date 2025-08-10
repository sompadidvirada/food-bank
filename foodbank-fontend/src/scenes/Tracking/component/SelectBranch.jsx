import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import useFoodBankStorage from "../../../zustand/foodbank-storage";

export default function SelectBranch({
  selectFormtracksell,
  setSelectFormtracksell,
  setSelectDateBrachCheck,
  setBranchName = () => {}, // default no-op
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const brach = useFoodBankStorage((state) => state.branchs);
  const getBrach = useFoodBankStorage((state) => state.getBrnachs);
  const token = useFoodBankStorage((state) => state.token);
  const getProducts = useFoodBankStorage((state) => state.getProduct);

  React.useEffect(() => {
    getBrach();
  }, [token]);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    // Find the branch object by id
    const selectedBranch = brach.find((b) => b.id === selectedId);

    setSelectFormtracksell((prevState) => ({
      ...prevState, // Keep existing state values
      brachId: event.target.value, // Update only brachId
    }));
    setSelectDateBrachCheck((prevState) => ({
      ...prevState, // Keep existing state values
      brachId: event.target.value, // Update only brachId
    }));

    // Set the branch name if found
    if (selectedBranch) {
      setBranchName(selectedBranch.branchname);
    } else {
      setBranchName("");
    }
    getProducts();
  };

  return (
    <div>
      <FormControl sx={{ m: "2px", minWidth: 160, textAlign: "center" }}>
        <InputLabel id="demo-simple-select-helper-label">
          <Typography
            variant="laoText"
            fontWeight="bold"
            color={colors.grey[100]}
          >
            ເລືອກສາຂາ
          </Typography>
        </InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selectFormtracksell.brachId}
          onChange={handleChange}
        >
          <MenuItem value="">
            <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>
              NONE
            </Typography>
          </MenuItem>
          {Array.isArray(brach) && brach.length > 0 ? (
            brach?.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                <Typography
                  variant="laoText"
                  fontWeight="bold"
                  color={colors.grey[100]}
                >
                  {item?.branchname}
                </Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value="">
              <Typography variant="h5" color="error">
                No branches available
              </Typography>
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  );
}
