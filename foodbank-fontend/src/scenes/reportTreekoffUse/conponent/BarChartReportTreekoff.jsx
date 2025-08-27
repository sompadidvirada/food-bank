import React, { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import {
  Box,
  Card,
  CardContent,
  colors,
  Dialog,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
import DialogChartIngredientUse from "./DialogChartIngredientUse";

const CustomTooltip = ({ id, value, indexValue, data }) => (
  <Card
    sx={{
      backgroundColor: colors.grey[100],
      boxShadow: 3,
      borderRadius: 2,
      p: 1,
    }}
  >
    <CardContent sx={{ p: 1, color: colors.grey[900] }}>
      {indexValue}
      <br />
      <strong>
        {id === "stockRequisition"
          ? "ຍອດເບີກຈາກສາງ"
          : "ຍອດນຳໃຊ້ວັດຖຸດິບຈາກຍອດຂາຍ"}
      </strong>
      <br />
      <Typography fontFamily={"Noto Sans Lao"}>
        ຈຳນວນ:{" "}
        {`${value ? value.toLocaleString("en-US") : 0} ${
          data?.materialVariantName || ""
        }`}
      </Typography>
    </CardContent>
  </Card>
);

const BarChartReportTreekoff = ({ data, queryForm,branchName }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectDataBar, setSelectDataBar] = useState({});

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (barData) => {
    setOpen(true);
    setSelectDataBar(barData);
  };

  console.log(data)

  return (
    <Box sx={{ width: "100%", height: 600 }}>
      <ResponsiveBar /* or Bar for fixed dimensions */
        data={data}
        keys={["stockRequisition", "ingredientUsage"]} // 👈 required
        indexBy="rawMaterialName"
        groupMode="grouped"
        padding={0.5}
        enableLabel={false}
        //   label={(d) => `${d.value.toLocaleString()} ${d.data.materialVariantName}`}
        //   labelPosition="end"
        //   labelOffset={14}
        //   labelSkipWidth={10}
        //   labelSkipHeight={12}
        //   labelTextColor={"red"}
        innerPadding={2}
        colors={(bar) => {
          if (bar.id === "stockRequisition") return colors.blueAccent[400]; // blue
          if (bar.id === "ingredientUsage") return colors.greenAccent[400]; // orange
          return "#ccc"; // fallback
        }}
        tooltip={(props) => <CustomTooltip {...props} />}
        axisBottom={{
          tickSize: 12,
          tickPadding: 14,
          tickRotation: -38,
          legendOffset: -1,
          truncateTickAt: 52,
          color: colors[100],
        }}
        theme={{
          labels: {
            text: {
              fontFamily: "Noto Sans Lao, sans-serif",
              fontSize: 12,
              fontWeight: "bold",
            },
          },
          axis: {
            ticks: {
              text: {
                fill: colors.grey[100], // <-- set the color here
                fontSize: 12,
                fontFamily: "Noto Sans Lao", // optional font
              },
            },
          },
        }}
        motionConfig={{
          mass: 50,
          tension: 81,
          friction: 1,
          clamp: true,
          precision: 0.01,
          velocity: 0,
        }}
        margin={{ top: 50, right: 30, bottom: 140, left: 60 }} // <-- increased bottom
        onClick={(barData, event) => {
          handleClickOpen(barData.data);
        }}
      />
      <DialogChartIngredientUse
        setOpen={setOpen}
        selectDataBar={selectDataBar}
        open={open}
        queryForm={queryForm}
        branchName={branchName}
      />
    </Box>
  );
};

export default BarChartReportTreekoff;
