import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
  useTheme,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { tokens } from "../../../theme";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { getMenuSellByName } from "../../../api/report";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomTooltip = ({ id, value, indexValue, color }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 'id' is the menu name (e.g., "ICED CAPPUCCINO")
  // 'indexValue' is the branch name (e.g., "ສາຂາ ວັດຈັນ")
  // 'value' is the sales count (e.g., 735)

  return (
    <Card
      sx={{
        backgroundColor: colors.grey[900], // Dark background for contrast
        boxShadow: 3,
        borderRadius: 1,
        borderLeft: `5px solid ${color}`, // Match the bar color
      }}
    >
      <CardContent sx={{ p: 1.5, color: colors.grey[100], minWidth: 150 }}>
        {/* 🏢 Branch Name (Index By) */}
        <Typography
          variant="subtitle1"
          fontFamily="Noto Sans Lao"
          fontWeight="bold"
          sx={{ mb: 0.5 }}
        >
          ສາຂາ: {indexValue}
        </Typography>

        {/* ☕ Menu Name (The Key/ID) */}
        <Typography
          variant="body2"
          fontFamily="Noto Sans Lao"
          sx={{ color: color }} // Use the bar color for the menu name
        >
          ເມນູ: {id}
        </Typography>

        {/* 🔢 Sales Count (The Value) */}
        <Typography
          variant="h6"
          fontFamily="Noto Sans Lao"
          color={colors.greenAccent[400]}
        >
          ຍອດຂາຍ: {value ? value.toLocaleString() : 0}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dialog2BarChart = ({
  menuName,
  open2Dialog,
  setOpen2Dialog,
  setMenuName,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const queryForm = useFoodBankStorage((s) => s.queryForm);
  const token = useFoodBankStorage((s) => s.token);
  const [data, setData] = useState({
    data: [],
    keys: [],
    indexBy: "",
  });

  const handleClose = () => {
    setOpen2Dialog(false);
    setData({
      data: [],
      keys: [],
      indexBy: "",
    });
    setMenuName("");
  };

  const fecthMenu = async () => {
    try {
      const ress = await getMenuSellByName(
        {
          coffeeName: menuName,
          startDate: queryForm.startDate,
          endDate: queryForm.endDate,
        },
        token
      );
      setData(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (queryForm?.startDate && queryForm.endDate && open2Dialog) {
      fecthMenu();
    }
  }, [queryForm, open2Dialog]);

  return (
    <Dialog
      open={open2Dialog}
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
              ລາຍງານຍອດຂາຍເມນູ: {menuName || ""} ຂອງທຸກສາຂາ
            </Typography>
            <Typography
              variant="body2"
              fontFamily="Noto Sans Lao"
              color="textSecondary"
            >
              ວັນທີ{" "}
              {queryForm.startDate 
                ? new Date(queryForm.startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "..."}{" "}
              -{" "}
              {queryForm.endDate 
                ? new Date(queryForm.endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "..."}
            </Typography>
          </Box>
        ) : (
          "No data selected."
        )}
      </DialogTitle>

      <DialogContent sx={{ overflowX: "hidden" }}>
        <div style={{ height: 500 }}>
          <ResponsiveBar
            data={data?.data}
            keys={data?.keys}
            indexBy={data?.indexBy}
            margin={{ top: 50, right: 30, bottom: 100, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "nivo" }}
            colorBy="indexValue"
            enableLabel={false}
            enableTotals={true}
            labelSkipHeight={12}
            enableGridY={false}
            tooltip={(props) => <CustomTooltip {...props} />}
            axisTop={null}
            axisRight={null}
            labelTextColor={"#000000ff"}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -25,
              legend: "Branch",
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

export default Dialog2BarChart;
