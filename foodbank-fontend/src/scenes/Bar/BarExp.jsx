import { Box } from "@mui/material";
import React from "react";
import Header from "../component/Header";
import Calendar from "../../component/Calendar";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import BarChartExp from "../../component/BarChartExp";

const BarExp = () => {
  const data = useFoodBankStorage((state) => state.barExp);
  return (
    <Box m="20px">
      <Header title="SELLING BAR CHART" subtitle="ກຮາຟຍອດຂາຍສິນຄ້າ" />
      <Box sx={{ mt: "20px" }}>
        <Calendar />
      </Box>
      <Box height="75vh">
        <BarChartExp data={data} />
      </Box>
    </Box>
  );
};

export default BarExp;
