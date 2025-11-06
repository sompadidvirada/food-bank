import React from "react";
import { Box, Select, MenuItem } from "@mui/material";
import dayjs from "dayjs";

const MonthSelectBaristar = ({ month, year, onMonthChange, onYearChange, onSearch }) => {
const handleMonthChange = (newMonth) => {
  onMonthChange(newMonth);
  onSearch(newMonth, year); // pass updated month
};

const handleYearChange = (newYear) => {
  onYearChange(newYear);
  onSearch(month, newYear); // pass updated year
};

  return (
    <Box display="flex" gap={2} width="100%" justifyContent="center" my={2}>
      {/* Month Dropdown */}
      <Select
        value={month}
        onChange={(e) => handleMonthChange(e.target.value)}
        sx={{ fontFamily: "Noto Sans Lao", minWidth: 120 }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <MenuItem key={i} value={i}>
            {dayjs(new Date(2000, i, 1)).format("MMMM")}
          </MenuItem>
        ))}
      </Select>

      {/* Year Dropdown */}
      <Select
        value={year}
        onChange={(e) => handleYearChange(e.target.value)}
        sx={{ fontFamily: "Noto Sans Lao", minWidth: 100 }}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const currentYear = dayjs().year();
          const y = currentYear - 2 + i;
          return (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
};

export default MonthSelectBaristar;
