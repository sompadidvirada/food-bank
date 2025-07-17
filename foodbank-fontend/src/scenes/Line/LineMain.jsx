import { Box } from "@mui/material";
import React from "react";
import Header from "../component/Header";
import Calendar from "../../component/Calendar";
import LineCharts from "../../component/LineChart";

const LineMain = () => {
  return (
    <Box m="20px" overflow="none">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box sx={{ mt: "20px" }}>
        <Calendar />
      </Box>

      <Box height="75vh">
        <LineCharts />
      </Box>
    </Box>
  );
};

export default LineMain;
