import React from "react";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import { Box } from "@mui/material";
import Header from "../../scenes/component/Header";
import Calendar from "../../component/Calendar";
import PieSellCompo from "../../component/PieSell";

const PieSell = () => {
  const pieSell = useFoodBankStorage((state) => state.pieSell);
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box sx={{ mt: "20px" }}>
        <Calendar />
      </Box>
      <Box height="75vh">
        <PieSellCompo dataPie={pieSell} />
      </Box>
    </Box>
  );
};

export default PieSell;
