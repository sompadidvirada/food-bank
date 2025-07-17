import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme, Typography } from "@mui/material";

const PieSendCompo = ({ isDashboard, dataPie }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const emtyData = [];

  return (
    <div
      style={{
        width: "100%", // Ensure it spans the full available width
        height: isDashboard ? "100%" : "600px", // Adjust height for dashboard view
        boxSizing: "border-box", // Ensure padding doesn't affect layout
      }}
    >
      <ResponsivePie
        data={dataPie || emtyData}
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
        margin={isDashboard ? { top: 10, right: 10, bottom: 10, left: 10 } : { top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        enableArcLinkLabels={isDashboard ? false : true}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.grey[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsRadiusOffset={0.4}
        arcLabelsSkipAngle={ isDashboard ? 15 : 7}
        arcLabelsTextColor={{
          from: colors.grey[900],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        tooltip={({ datum }) => (
          <div
            style={{
              background: colors.grey[100], // Style the tooltip background
              padding: "10px",
              borderRadius: "5px",
              color: colors.grey[900],
            }}
          >
            <Typography variant="laoText" color={colors.grey[900]}>
              <strong>{datum.id} </strong>
            </Typography>
            <Typography variant="laoText" color={colors.grey[900]}>
              ຈຳນວນ : {datum.value}
            </Typography>
          </div>
        )}
        arcLabels={({ datum }) => (
          <Typography
            variant="laoText"
            color={colors.grey[900]} // Set color dynamically based on theme
            style={{
              fontSize: "14px", // Adjust font size if necessary
              fontWeight: "bold", // Make label text bold
            }}
          >
            {datum.id}
          </Typography>
        )}
      />
    </div>
  );
};

export default PieSendCompo;
