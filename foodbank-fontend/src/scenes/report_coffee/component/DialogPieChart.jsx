import React, { useEffect, useRef, useState, useMemo } from "react";
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
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { getCoffeeSellByType } from "../../../api/report";
import { ResponsiveBar } from "@nivo/bar";
import CircularProgress from "@mui/material/CircularProgress";

// --- Custom Tooltip Component Fix ---
// Nivo passes the entire data object for the bar as the 'data' prop
const CustomTooltip = ({ data, totalSales }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const itemValue = data.value || 0;

  const percentage = totalSales > 0 ? (itemValue / totalSales) * 100 : 0;

  // The data object contains { id: "Name Size", label: "Name Size", value: 12345 }
  return (
    <Card
      sx={{
        backgroundColor: colors.grey[100],
        boxShadow: 3,
        borderRadius: 2,
        p: 1,
        zIndex: 999999, // Keep a very high z-index
      }}
    >
      <CardContent
        sx={{ p: 1, color: colors.grey[900], fontFamily: "Noto Sans Lao" }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: 14, fontWeight: "bold", mb: 1 }}
        >
          {/* 🟢 FIX: Use data.label or data.id to get the product name */}
          {data.label || data.id}
        </Typography>

        <strong>ຍອດຂາຍ:</strong>
        <br />
        <Typography fontFamily={"Noto Sans Lao"}>
          {/* 🟢 FIX: Use data.value */}
          ຈຳນວນ: {data.value ? data.value.toLocaleString("en-US") : 0}
        </Typography>

        <Typography fontFamily={"Noto Sans Lao"} sx={{ mt: 0.5 }}>
          ສັດສ່ວນ: {percentage.toFixed(2)}%
        </Typography>
      </CardContent>
    </Card>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogPieChart = ({
  selectDataPie,
  setSelectDataPie,
  openDialogPie,
  setOpenDialogPie,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const queryForm = useFoodBankStorage((s) => s.queryForm);
  const token = useFoodBankStorage((s) => s.token);
  const [loading, setLoaing] = useState(false);

  // State will store the full API response object: { pie_chart_data: [...] }
  const [apiResponse, setApiResponse] = useState({});

  // 🟢 FIX 1: Compute the array of products from the API response
  const productData = useMemo(() => {
    return apiResponse?.pie_chart_data || [];
  }, [apiResponse]);

  const totalSales = useMemo(() => {
    return productData.reduce((acc, current) => acc + current.value, 0);
  }, [productData]);

  const fecthData = async () => {
    setLoaing(true);
    try {
      const ress = await getCoffeeSellByType(
        {
          type: selectDataPie,
          startDate: queryForm.startDate,
          endDate: queryForm.endDate,
        },
        token
      );
      // 🟢 FIX 2: Store the entire response object
      setApiResponse(ress.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoaing(false);
    }
  };

  useEffect(() => {
    if (selectDataPie) {
      fecthData();
    }
  }, [selectDataPie, queryForm.startDate, queryForm.endDate, token]); // Added dependencies

  const handleClose = () => {
    setOpenDialogPie(false);
    setSelectDataPie("");
  };

  // Calculate dynamic max value for scaling (optional, Nivo can handle this)
  const highestValue =
    productData.length > 0 ? Math.max(...productData.map((d) => d.value)) : 0;
  const dynamicMaxValue = highestValue * 1.1;

  // 🟢 FIX 3: Calculate dynamic height based on the product array length
  // Each bar needs ~40px of vertical space
  const dynamicChartHeight = productData.length * 40 + 100;

  return (
    <>
      <Dialog
        open={openDialogPie}
        onClose={handleClose}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "95vw",
            height: "90vh",
            maxWidth: "95vw",
          },
        }}
        slots={{ transition: Transition }}
        keepMounted
      >
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
          <>
            {" "}
            <DialogTitle
              sx={{
                fontFamily: "Noto Sans Lao",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* 🟢 FIX 4: Use length check to prevent display when dates are empty string ("") */}
              {queryForm?.startDate && queryForm?.endDate ? (
                <Box>
                  <Typography variant="h6" fontFamily="Noto Sans Lao">
                    ລາຍງານຍອດຂາຍແຕ່ລະເມນູຂອງໝວດໝູ່:{" "}
                    {selectDataPie || ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontFamily="Noto Sans Lao"
                    color="textSecondary"
                  >
                    ວັນທີ{" "}
                    {/* Use length check for the safest guard against empty string, null, and undefined */}
                    {queryForm.startDate
                      ? new Date(queryForm.startDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "..."}{" "}
                    -{" "}
                    {queryForm.endDate
                      ? new Date(queryForm.endDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "..."}
                  </Typography>
                </Box>
              ) : (
                "No data selected."
              )}
            </DialogTitle>
            <DialogContent sx={{ overflow: "visible", p: 0 }}>
              <Box sx={{ height: "100%", overflowY: "auto", p: 2 }}>
                {/* 🟢 FIX 5: Use the dynamically calculated height */}
                <div style={{ height: dynamicChartHeight }}>
                  <ResponsiveBar
                    // 🟢 FIX 6: Pass the computed product array
                    data={productData}
                    keys={["value"]}
                    // 🟢 FIX 7: Use 'id' (or 'label') as the index, as your server response uses it for the menu name
                    indexBy="id"
                    margin={{ top: 70, right: 30, bottom: 50, left: 200 }}
                    theme={{
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
                      tooltip: {
                        container: {
                          zIndex: 999999, // Extremely high z-index to break through the Dialog
                          backgroundColor: colors.grey[100],
                          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                          borderRadius: "4px",
                        },
                      },
                    }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={{ scheme: "nivo" }}
                    colorBy="indexValue"
                    layout="horizontal"
                    enableTotals={true}
                    enableGridY={false}
                    labelTextColor={"#000000ff"}
                    maxValue={dynamicMaxValue}
                    enableLabel={true}
                    labelSkipWidth={28}
                    tooltip={(props) => (
                      <CustomTooltip
                        {...props}
                        totalSales={totalSales}
                        theme={theme}
                      />
                    )}
                    // ... rest of the props ...
                  />
                </div>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default DialogPieChart;
