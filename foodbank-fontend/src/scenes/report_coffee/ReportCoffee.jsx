import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
} from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import CircularProgress from "@mui/material/CircularProgress";
import {
  LocalCafe as CoffeeIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { ResponsiveContainer } from "recharts";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import BlenderIcon from "@mui/icons-material/Blender";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import CalendarReportTreekoff from "./component/CalendarReportTreekoff";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import DataGridReportTreekoff from "./component/DataGridReportTreekoff";
import DialogBarChart from "./component/DialogBarChart";
import DialogPieChart from "./component/DialogPieChart";

// --- Component ย่อย: Stat Card ---
const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="subtitle2"
            fontFamily={"Noto Sans Lao"}
          >
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontFamily={"Noto Sans Lao"}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: "50%",
            p: 1,
            display: "flex",
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function ReportCoffee() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dataReport, setDataReport] = useState({});
  const branch = useFoodBankStorage((s) => s.branchs);
  const [open, setOpen] = useState(false);
  const [selectDataBar, setSelectDataBar] = useState({});
  const [openDialogPie, setOpenDialogPie] = useState(false);
  const [selectDataPie, setSelectDataPie] = useState("");

  const [loading, setLoading] = useState(false);

  // Extract all unique product keys from the data
  const chartKeys = dataReport?.data_for_bar_chart
    ? Array.from(
        new Set(
          dataReport.data_for_bar_chart.flatMap((item) => Object.keys(item))
        )
      ).filter((key) => key !== "country" && key !== "branchInfo")
    : [];
  const maxValue =
    dataReport?.data_for_bar_chart?.length > 0
      ? Math.max(
          ...dataReport?.data_for_bar_chart.map((item) =>
            chartKeys.reduce((sum, key) => sum + (item[key] || 0), 0)
          )
        ) * 1.2 // Applies 20% buffer
      : 100;

  const handleClick = (dataA) => {
    setOpen(true);
    setSelectDataBar(dataA);
  };

  const total = dataReport?.pie_chart_data?.reduce(
    (acc, cur) => acc + cur.value,
    0
  );

  const handleClickPie = (data) => {
    setOpenDialogPie(true);
    setSelectDataPie(data.id);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: colors.primary[450], minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pb: 2 }}>
        <Box sx={{ my: 2, justifyItems: "center" }}>
          <CalendarReportTreekoff
            setDataReport={setDataReport}
            setLoading={setLoading}
          />
        </Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <CircularProgress
              size={60}
              thickness={5}
              sx={{
                color: "#00b0ff", // bright cyan blue, visible in dark
              }}
            />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* 1. KPI Cards Section */}
            <Grid item xs={10} md={3}>
              <StatCard
                title="ຍອກຂາຍຈອກທັງໝົດ"
                value={
                  dataReport?.total_type_2
                    ? `${dataReport?.total_type_2.TOTAL.toLocaleString()} ຈອກ`
                    : "0 ຈອກ"
                }
                icon={<MoneyIcon sx={{ color: "black" }} />}
                color="success"
              />
            </Grid>
            <Grid item xs={10} md={3}>
              <StatCard
                title="ຍອດຂາຍຈອກຮ້ອນ"
                value={
                  dataReport?.total_type_2
                    ? `${
                        dataReport?.total_type_2?.HOT?.toLocaleString() || 0
                      } ຈອກ`
                    : "0 ຈອກ"
                }
                icon={<CoffeeIcon sx={{ color: "black" }} />}
                color="warning"
              />
            </Grid>
            <Grid item xs={10} md={3}>
              <StatCard
                title="ຍອດຂາຍຈອກເຢັນ"
                value={
                  dataReport?.total_type_2
                    ? `${
                        dataReport?.total_type_2?.ICED?.toLocaleString() || 0
                      } ຈອກ`
                    : "0 ຈອກ"
                }
                icon={<AcUnitIcon sx={{ color: "black" }} />}
                color="warning"
              />
            </Grid>
            <Grid item xs={10} md={3}>
              <StatCard
                title="ຍອດຂາຍປັ່ນ"
                value={
                  dataReport?.total_type_2
                    ? `${
                        dataReport?.total_type_2?.SMOOTIE?.toLocaleString() || 0
                      } ຈອກ`
                    : "0 ຈອກ"
                }
                icon={<BlenderIcon sx={{ color: "black" }} />}
                color="warning"
              />
            </Grid>
            <Grid item xs={10} md={3}>
              <StatCard
                title="ຍອດຂາຍ EXTRA"
                value={
                  dataReport?.total_type_2
                    ? `${
                        dataReport?.total_type_2?.EXTRA?.toLocaleString() || 0
                      }`
                    : "-"
                }
                icon={<BlenderIcon sx={{ color: "black" }} />}
                color="warning"
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: 550,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  fontFamily={"Noto Sans Lao"}
                  fontSize={18}
                >
                  ຍອດຂາຍເຄື່ອງດື່ມແຍກເປັນໝວດໝູ່ຂອງແຕ່ລະສາຂາ (Selling Category of
                  Every Branch)
                </Typography>
                <ResponsiveContainer width="100%" height="95%">
                  <ResponsiveBar
                    data={dataReport?.data_for_bar_chart || []}
                    indexBy="country"
                    keys={chartKeys}
                    maxValue={maxValue}
                    layout="horizontal"
                    padding={0.5}
                    theme={{
                      // added
                      axis: {
                        domain: {
                          line: {
                            stroke: colors.grey[100],
                          },
                        },
                        legend: {
                          text: {
                            fill: colors.grey[100],
                            fontSize: 30,
                            fontFamily: '"Noto Serif Lao", serif', // Custom font for axis labels
                          },
                        },
                        ticks: {
                          text: {
                            fontSize: 11,
                            fill: colors.grey[100],
                            fontFamily: '"Noto Serif Lao", serif', // Custom font for tick labels
                          },
                        },
                      },
                      tooltip: {
                        container: {
                          background: colors.grey[100],
                          color: colors.grey[900],
                          fontFamily: '"Noto Serif Lao", serif', // Custom font for tooltip
                          fontSize: 15,
                        },
                      },
                      text: {
                        fontSize: 15,
                        fill: colors.grey[100],
                        fontWeight: "bold",
                        fontFamily: '"Noto Serif Lao", serif', // Custom font for other chart texts
                      },
                    }}
                    labelSkipWidth={25}
                    labelSkipHeight={12}
                    labelTextColor="black"
                    colors={{ scheme: "paired" }}
                    borderWidth={4}
                    borderColor={{ from: "color", modifiers: [] }}
                    enableTotals={true}
                    totalsOffset={25}
                    enableGridY={false}
                    axisBottom={{ tickSize: 7, tickPadding: 4 }}
                    animate={false}
                    motionConfig={{
                      mass: 1,
                      tension: 150,
                      friction: 9,
                      clamp: false,
                      precision: 0.01,
                      velocity: 0,
                    }}
                    margin={{ top: 50, right: 130, bottom: 50, left: 120 }}
                    onClick={(barData, event) => {
                      handleClick(barData.data);
                    }}
                  />
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: 550,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  fontFamily={"Noto Sans Lao"}
                  fontSize={18}
                >
                  ຍອດຂາຍເຄື່ອງດື່ມແຍກເປັນໝວດໝູ່ຂອງແຕ່ລະສາຂາ (Selling Category of
                  Every Branch)
                </Typography>
                <ResponsiveContainer width="100%" height="95%">
                  <ResponsivePie /* or Pie for fixed dimensions */
                    data={dataReport?.pie_chart_data || []}
                    theme={{
                      axis: {
                        domain: {
                          line: {
                            stroke: colors.grey[100],
                          },
                        },
                        legend: {
                          text: {
                            fill: colors.grey[100],
                          },
                        },
                        ticks: {
                          line: {
                            stroke: colors.grey[100],
                            strokeWidth: 1,
                          },
                          text: {
                            fill: colors.grey[100],
                          },
                        },
                      },
                      tooltip: {
                        container: {
                          background: colors.grey[100],
                          color: colors.grey[900],
                          fontFamily: '"Noto Serif Lao", serif', // Custom font for tooltip
                          fontSize: 15,
                        },
                      },
                      legends: {
                        text: {
                          fill: colors.grey[100],
                        },
                      },
                      text: {
                        fill: colors.grey[600],
                        fontSize: 15,
                      },
                    }}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    sortByValue={true}
                    tooltip={({ datum }) => {
                      const percent = ((datum.value / total) * 100).toFixed(2);

                      return (
                        <div
                          style={{
                            padding: "10px",
                            background: colors.grey[100],
                            color: colors.grey[900],
                            borderRadius: "8px",
                            fontFamily: '"Noto Serif Lao", serif',
                            fontSize: 15,
                          }}
                        >
                          <strong>{datum.label}</strong>
                          <br />
                          ຍອດຂາຍທັງໝົດ: {datum.value.toLocaleString()}
                          <br />
                          ເປີເຊັນ: {percent}%
                        </div>
                      );
                    }}
                    innerRadius={0.05}
                    cornerRadius={2}
                    enableArcLinkLabels={false}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: "accent" }}
                    arcLinkLabelsSkipAngle={6}
                    arcLinkLabelsTextColor={colors.grey[100]}
                    arcLinkLabelsOffset={-3}
                    arcLabel={(e) =>
                      `${(
                        (e.value /
                          dataReport.pie_chart_data.reduce(
                            (a, b) => a + b.value,
                            0
                          )) *
                        100
                      ).toFixed(1)}%`
                    }
                    arcLinkLabelsDiagonalLength={15}
                    arcLinkLabelsStraightLength={10}
                    arcLinkLabelsThickness={3}
                    onClick={(data, event) => {
                      handleClickPie(data);
                    }}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsRadiusOffset={0.55}
                    arcLabelsSkipAngle={20}
                    arcLabelsTextColor={{
                      from: "color",
                      modifiers: [["darker", 3]],
                    }}
                    animate={false}
                    legends={[
                      {
                        anchor: "bottom",
                        direction: "row",
                        translateY: 56,
                        itemWidth: 150,
                        itemHeight: 18,
                        symbolShape: "circle",
                      },
                    ]}
                  />
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  fontFamily={"Noto Sans Lao"}
                  fontSize={18}
                >
                  ຍອດຂາຍເຄື່ອງດື່ມແຍກເປັນໝວດໝູ່ຂອງແຕ່ລະສາຂາ (Selling Category of
                  Every Branch)
                </Typography>{" "}
                <DataGridReportTreekoff />
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
      <DialogBarChart
        open={open}
        setOpen={setOpen}
        selectDataBar={selectDataBar}
        setSelectDataBar={setSelectDataBar}
      />
      <DialogPieChart
        selectDataPie={selectDataPie}
        setSelectDataPie={setSelectDataPie}
        openDialogPie={openDialogPie}
        setOpenDialogPie={setOpenDialogPie}
      />
    </Box>
  );
}
