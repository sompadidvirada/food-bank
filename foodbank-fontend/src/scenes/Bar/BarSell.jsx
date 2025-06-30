import { Box } from "@mui/material";
import React from "react";
import Header from "../component/Header";
import BarChart from "../../component/BarChartSell";
import Calendar from "../../component/Calendar";
import useFoodBankStorage from "../../zustand/foodbank-storage";

const BarSell = () => {
  const data = useFoodBankStorage((state)=>state.barSell)
  return (
    <Box m="20px">
      <Header title="SELLING BAR CHART" subtitle="ກຮາຟຍອດຂາຍສິນຄ້າ" />
      <Box sx={{ mt: "20px" }}>
        <Calendar />
      </Box>
      <Box height="75vh">
        <BarChart data={data}/>
      </Box>
    </Box>
  );
};

export default BarSell;
