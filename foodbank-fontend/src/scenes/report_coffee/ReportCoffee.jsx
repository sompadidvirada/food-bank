import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import {
  LocalCafe as CoffeeIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import BlenderIcon from "@mui/icons-material/Blender";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";

const data = [
  {
    country: "AD",
    "hot dog": 184,
    burger: 45,
    sandwich: 4,
    kebab: 64,
    fries: 119,
    donut: 185,
  },
  {
    country: "AE",
    "hot dog": 185,
    burger: 35,
    sandwich: 106,
    kebab: 0,
    fries: 185,
    donut: 6,
  },
  {
    country: "AF",
    "hot dog": 15,
    burger: 173,
    sandwich: 159,
    kebab: 92,
    fries: 28,
    donut: 26,
  },
  {
    country: "AG",
    "hot dog": 101,
    burger: 38,
    sandwich: 134,
    kebab: 90,
    fries: 191,
    donut: 163,
  },
  {
    country: "AI",
    "hot dog": 47,
    burger: 156,
    sandwich: 98,
    kebab: 54,
    fries: 10,
    donut: 62,
  },
  {
    country: "AL",
    "hot dog": 93,
    burger: 184,
    sandwich: 3,
    kebab: 173,
    fries: 87,
    donut: 152,
  },
  {
    country: "AM",
    "hot dog": 2,
    burger: 140,
    sandwich: 118,
    kebab: 157,
    fries: 134,
    donut: 98,
  },
];

const pieData = [
  {
    id: "make",
    label: "make",
    value: 1,
    color: "hsl(36, 70%, 50%)",
  },
  {
    id: "javascript",
    label: "javascript",
    value: 305,
    color: "hsl(336, 70%, 50%)",
  },
  {
    id: "sass",
    label: "sass",
    value: 561,
    color: "hsl(7, 70%, 50%)",
  },
  {
    id: "c",
    label: "c",
    value: 253,
    color: "hsl(6, 70%, 50%)",
  },
  {
    id: "php",
    label: "php",
    value: 336,
    color: "hsl(262, 70%, 50%)",
  },
];

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

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

export default function ReportCoffee({ isDashboard = false }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClick = (dataA) => {
    console.log(dataA);
  };
  return (
    <Box sx={{ flexGrow: 1, bgcolor: colors.primary[450], minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pb: 2 }}>
        <Grid container spacing={3}>
          {/* 1. KPI Cards Section */}
          <Grid item xs={10} md={3}>
            <StatCard
              title="ຍອດທັງໝົດ"
              value="12,450 ຈອກ"
              icon={<MoneyIcon sx={{ color: "black" }} />}
              color="success"
            />
          </Grid>
          <Grid item xs={10} md={3}>
            <StatCard
              title="ຍອດຂາຍຮ້ອນ"
              value="12,450 ຈອກ"
              icon={<CoffeeIcon sx={{ color: "black" }} />}
              color="warning"
            />
          </Grid>
          <Grid item xs={10} md={3}>
            <StatCard
              title="ຍອດຂາຍເຢັນ"
              value="156,222 ຈອກ"
              icon={<AcUnitIcon sx={{ color: "black" }} />}
              color="warning"
            />
          </Grid>
          <Grid item xs={10} md={3}>
            <StatCard
              title="ຍອດຂາຍປັ່ນ"
              value="1,422 ຈອກ"
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
                  data={data}
                  indexBy="country"
                  keys={["hot dog", "burger", "sandwich", "kebab", "fries"]}
                  layout="horizontal"
                  padding={0.5}
                  enableGridX={true}
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
                          fontSize: isDashboard ? 12 : 30,
                          fontFamily: '"Noto Serif Lao", serif', // Custom font for axis labels
                        },
                      },
                      ticks: {
                        line: {
                          stroke: colors.grey[100],
                          strokeWidth: 1,
                        },
                        text: {
                          fontSize: isDashboard ? 10 : 15,
                          fill: colors.grey[100],
                          fontFamily: '"Noto Serif Lao", serif', // Custom font for tick labels
                        },
                      },
                    },
                    legends: {
                      text: {
                        fill: colors.grey[100],
                        fontSize: isDashboard ? 15 : 25,
                        fontFamily: '"Noto Serif Lao", serif', // Custom font for legend text
                      },
                    },
                    tooltip: {
                      container: {
                        background: colors.grey[900],
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
                  labelSkipWidth={11}
                  labelSkipHeight={12}
                  labelTextColor="black"
                  colors={{ scheme: "paired" }}
                  borderWidth={4}
                  borderColor={{ from: "color", modifiers: [] }}
                  enableTotals={true}
                  totalsOffset={25}
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
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
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
                  data={pieData}
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
                  innerRadius={0.05}
                  cornerRadius={2}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: "accent" }}
                  arcLinkLabelsSkipAngle={6}
                  arcLinkLabelsTextColor={colors.grey[100]}
                  arcLinkLabelsOffset={-3}
                  arcLinkLabelsDiagonalLength={15}
                  arcLinkLabelsStraightLength={10}
                  arcLinkLabelsThickness={3}
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
                      itemWidth: 100,
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
                height: 550,
              }}
            >
              {" "}
              <Box sx={{ my: 2, display:"flex", gap:2, justifyContent:"space-between" }}>
                <Typography sx={{ fontSize: 18, fontFamily: "Noto Sans Lao" }}>
                  ລາຍງານລາຍລະອຽດຍອດຂາຍແຕ່ລະເມນູຂອງທຸກສາຂາ
                </Typography>
                <Button variant="contained" color="info" sx={{fontFamily:"Noto Sans Lao"}}>ພິມລາຍງານ</Button>
              </Box>
              <Box>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  hideFooter
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  disableRowSelectionOnClick
                />
              </Box>
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
