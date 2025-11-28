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
import Dialog2BarChart from "./Dialog2BarChart";

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

  const [open2Dialog, setOpen2Dialog] = useState(false);
  const [menuName, setMenuName] = useState("");

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

  const handleClose = () => {
    setOpen(false);
    setSelectDataBar({});
  };

  const handleClick = (barData) => {
    setMenuName(barData?.coffeeMenuName);
    // handleClose();
    setOpen2Dialog(true);
  };

  return (
    <>
      {" "}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={false} // disable maxWidth limit
        PaperProps={{
          sx: {
            width: "95vw", // custom width
            height: "90vh", // custom height
            maxWidth: "95vw",
          },
        }}
        slots={{ transition: Transition }}
        keepMounted
      >
        <DialogTitle
          sx={{
            fontFamily: "Noto Sans Lao",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* ... inside DialogTitle ... */}

          {queryForm?.startDate &&
          queryForm?.endDate &&
          typeof queryForm.startDate === "string" &&
          queryForm.startDate.length > 0 ? (
            <Box>
              <Typography variant="h6" fontFamily="Noto Sans Lao">
                ລາຍງານຍອດຂາຍເມນູ: {menuName || ""} ຂອງທຸກສາຂາ
              </Typography>
              <Typography
                variant="body2"
                fontFamily="Noto Sans Lao"
                color="textSecondary"
              >
                {/* Added check and safe fallback for parsing */}
                ວັນທີ{" "}
                {queryForm.startDate
                  ? format(parseISO(queryForm.startDate), "dd/MM/yyyy")
                  : "..."}{" "}
                -{" "}
                {queryForm.endDate
                  ? format(parseISO(queryForm.endDate), "dd/MM/yyyy")
                  : "..."}
              </Typography>
            </Box>
          ) : (
            "No data selected."
          )}
        </DialogTitle>

        <DialogContent sx={{ overflow: "hidden", p: 0 }}>
          <Box sx={{ height: "100%", overflowY: "auto", p: 2 }}>
            <div style={{ height: chartData.length * 40 }}>
              <ResponsiveBar
                data={chartData}
                keys={["value"]}
                indexBy="coffeeMenuName"
                margin={{ top: 50, right: 30, bottom: 50, left: 200 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "nivo" }}
                colorBy="indexValue"
                layout="horizontal"
                enableLabel={true}
                labelSkipWidth={28}
                tooltip={(props) => <CustomTooltip {...props} />}
                axisTop={null}
                axisRight={null}
                labelTextColor={"#000000ff"}
                enableTotals={true}
                totalsOffset={29}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  legend: "Amount",
                  legendPosition: "middle",
                  legendOffset: 40,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  legend: "",
                  legendPosition: "middle",
                  legendOffset: -100,
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
                    fontSize: 11,
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
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog2BarChart
        menuName={menuName}
        open2Dialog={open2Dialog}
        setOpen2Dialog={setOpen2Dialog}
        setMenuName={setMenuName}
      />
    </>
  );
};

export default DialogBarChart;
