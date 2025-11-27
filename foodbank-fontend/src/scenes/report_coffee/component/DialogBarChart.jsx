import React, { useEffect, useRef, useState, useMemo } from "react"; // เพิ่ม useMemo
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
import { ResponsiveBar } from "@nivo/bar";
import { format, parseISO } from "date-fns";
import { useReactToPrint } from "react-to-print";
import useFoodBankStorage from "../../../zustand/foodbank-storage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomTooltip = ({ id, value, indexValue, data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card
      sx={{
        backgroundColor: colors.grey[100],
        boxShadow: 3,
        borderRadius: 2,
        p: 1,
      }}
    >
      <CardContent
        sx={{ p: 1, color: colors.grey[900], fontFamily: "Noto Sans Lao" }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: 14, fontWeight: "bold", mb: 1 }}
        >
          {data.coffeeMenuName}
        </Typography>

        <strong>ຍອດຂາຍ:</strong>
        <br />
        <Typography fontFamily={"Noto Sans Lao"}>
          ຈຳນວນ: {value ? value.toLocaleString("en-US") : 0}
        </Typography>
      </CardContent>
    </Card>
  );
};

const DialogBarChart = ({ open, setOpen, selectDataBar, setSelectDataBar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const queryForm = useFoodBankStorage((s) => s.queryForm);
  const componentRef = useRef();

  const chartData = useMemo(() => {
    if (!selectDataBar) return [];

    const excludeKeys = ["country", "branchInfo", "total", "id"];

    return Object.keys(selectDataBar)
      .filter((key) => !excludeKeys.includes(key))
      .map((key) => ({
        coffeeMenuName: key,
        value: selectDataBar[key],
      }))
      .sort((a, b) => b.value - a.value);
  }, [selectDataBar]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `ປີ່ນລາຍງານ`,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (barData) => {
    console.log(barData);
  };

  return (
    <Dialog
      open={open}
      slots={{ transition: Transition }}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle
        sx={{
          fontFamily: "Noto Sans Lao",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {queryForm?.startDate && queryForm?.endDate ? (
          <Box>
            <Typography variant="h6" fontFamily="Noto Sans Lao">
              ລາຍງານຍອດຂາຍປະເພດ: {selectDataBar?.country || ""}
            </Typography>
            <Typography
              variant="body2"
              fontFamily="Noto Sans Lao"
              color="textSecondary"
            >
              ວັນທີ {format(parseISO(queryForm?.startDate), "dd/MM/yyyy")} -{" "}
              {format(parseISO(queryForm?.endDate), "dd/MM/yyyy")}
            </Typography>
          </Box>
        ) : (
          "No data selected."
        )}
      </DialogTitle>

      <DialogContent sx={{ overflowX: "hidden" }}>
        <div style={{ height: 500 }} ref={componentRef}>
          <ResponsiveBar
            data={chartData}
            keys={["value"]}
            indexBy="coffeeMenuName"
            margin={{ top: 50, right: 30, bottom: 100, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "nivo" }}
            colorBy="indexValue"
            enableLabel={true}
            labelSkipHeight={12}
            tooltip={(props) => <CustomTooltip {...props} />}
            axisTop={null}
            axisRight={null}
            labelTextColor={"#000000ff"}
            enableTotals={true}
            totalsOffset={25}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -25,
              legend: "Menu Coffee",
              legendPosition: "middle",
              legendOffset: 80,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Amount",
              legendPosition: "middle",
              legendOffset: -50,
            }}
            theme={{
              text: {
                fontFamily: "Noto Sans Lao, sans-serif",
              },
              axis: {
                ticks: {
                  text: {
                    fill: colors.grey[100],
                    fontSize: 11,
                    fontFamily: "Noto Sans Lao",
                  },
                },
                legend: {
                  text: {
                    fill: colors.grey[100],
                  },
                },
              },
              text: {
                fontSize: 15,
                fill: colors.grey[100],
                fontWeight: "bold",
                fontFamily: '"Noto Serif Lao", serif',
              },
            }}
            onClick={(barData, event) => {
              handleClick(barData.data);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBarChart;
