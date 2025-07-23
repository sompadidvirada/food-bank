import { useTheme } from "@mui/material";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { tokens } from "../theme";
import useFoodBankStorage from "../zustand/foodbank-storage";

const LineCharts = ({ isDashboard = false }) => {
  const lineChartData = useFoodBankStorage((state) => state.lineChartData);

  const chartData = lineChartData;
  const branches =
    chartData?.length > 0
      ? Object.keys(chartData[0]).filter((key) => key !== "name")
      : [];

  const generateColor = (index, total) =>
    `hsl(${(index * 360) / total}, 70%, 50%)`;

  const branchColorMap = {};
  branches.forEach((branch, index) => {
    branchColorMap[branch] = generateColor(index, branches.length);
  });

  return (
    <div style={{ width: "98%", height: isDashboard ? "380px" : "600px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={0}
            textAnchor="end"
            tick={{
              fontSize: 12,
              fontFamily: "Noto Sans Lao",
              fill: "#666",
            }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />

          {branches.map((branch) => (
            <Line
              key={branch}
              type="monotone"
              dataKey={branch}
              stroke={branchColorMap[branch]}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode); // access themed tokens
  if (active && payload && payload.length) {
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
    return (
      <div
        style={{
          backgroundColor: colors.primary[400],
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          fontFamily: "Noto Sans Lao", // <- set custom font here
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", color: colors.grey[100] }}>
          {label}
        </p>
        {sortedPayload.map((entry, index) => (
          <p
            key={`item-${index}`}
            style={{
              color: entry.color,
              margin: "4px 0",
              fontFamily: "Noto Sans Lao",
            }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const CustomLegend = ({ payload }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap", // allow wrapping
        gap: "12px 20px", // row and column spacing
        padding: "8px 16px",
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "Noto Sans Lao",
            fontSize: 14,
            color: entry.color,
            minWidth: "max-content",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              backgroundColor: entry.color,
              marginRight: 6,
              borderRadius: "50%",
              display: "inline-block",
            }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  );
};

export default LineCharts;
