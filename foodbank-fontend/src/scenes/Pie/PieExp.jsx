import React from "react";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import { Box } from "@mui/material";
import Header from "../../scenes/component/Header";
import Calendar from "../../component/Calendar";
import PieSellCompo from "../../component/PieSell";
import PieSendCompo from "../../component/PieSend";

const PieExp = () => {
  const pieExp = useFoodBankStorage((state) => state.pieExp);
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box sx={{ mt: "20px" }}>
        <Calendar />
      </Box>
      <Box height="75vh">
        <PieSendCompo dataPie={pieExp} />
      </Box>
    </Box>
  );
};

export default PieExp;
