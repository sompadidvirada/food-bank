import { Box } from "@mui/material";
import React from "react";
import Header from "../component/Header";
import Calendar from "../../component/Calendar";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import BarChartSend from "../../component/BarChartSend";


const BarSend = () => {
   const data = useFoodBankStorage((state)=>state.barSend)
  return (
    <Box m="20px">
      <Header title="SELLING BAR CHART" subtitle="ກຮາຟຍອດຂາຍສິນຄ້າ" />
      <Box sx={{ mt: "20px" }}>
        <Calendar />
      </Box>
      <Box height="75vh">
        <BarChartSend data={data}/>
      </Box>
    </Box>
  )
}

export default BarSend