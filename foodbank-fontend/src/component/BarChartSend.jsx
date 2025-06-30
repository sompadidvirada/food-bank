import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@emotion/react";
import { tokens } from "../theme";
import useFoodBankStorage from "../zustand/foodbank-storage";

const BarChartSend = ({ isDashboard = false, data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const products = useFoodBankStorage((state) => state.products);
  const productName = Array.isArray(products)
    ? products.map((product) => product.name)
    : [];

  const productSecon = [" "];

  const keys = productName.length ? productName : productSecon;

  const chartData = Array.isArray(data) ? data || dataBar : [];

  const maxValue =
    chartData.length > 0
      ? Math.max(
          ...chartData.map((item) =>
            keys.reduce((sum, key) => sum + (item[key] || 0), 0)
          )
        ) * 1.2
      : 100; // Fallback maxValue when data is empty
  return (
    <ResponsiveBar
      data={chartData}
      maxValue={maxValue}
      layout="horizontal"
      padding={0.05}
      innerPadding={1}
      labelSkipWidth={isDashboard ? 20 : 20}
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
      keys={productName ? productName : productSecon}
      indexBy="country"
      margin={{ top: 50, right: 15, bottom: 50, left: 140 }}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "fries",
          },
          id: "dots",
        },
        {
          match: {
            id: "sandwich",
          },
          id: "lines",
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.5"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={{
        tickSize: 9,
        tickPadding: 5,
        tickRotation: 1,
        legend: null,
        legendPosition: "middle",
        legendOffset: 15,
        truncateTickAt: 0,
      }}
      enableTotals={true}
      totalsOffset={28}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", "6"]],
      }}
      motionConfig={{
        mass: 13,
        tension: 95,
        friction: 36,
        clamp: false,
        precision: 0.01,
        velocity: 0,
      }}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
    />
  );
};

export default BarChartSend;
