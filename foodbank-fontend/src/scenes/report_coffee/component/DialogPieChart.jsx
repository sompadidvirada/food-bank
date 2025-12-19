import React, { useEffect, useMemo, useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {
  Box,
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
import ReactDOM from "react-dom";


const CustomTooltip = ({ data, totalSales }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  
  const itemValue = data.value || 0;
  const percentage = totalSales > 0 ? (itemValue / totalSales) * 100 : 0;

  return (
    <Card
      sx={{
        backgroundColor: colors.grey[100],
        color: colors.grey[900],
        boxShadow: 12,
        borderRadius: 2,
        p: 1.5,
        minWidth: 200,
        pointerEvents: "none",
        zIndex: 999999,
      }}
      elevation={16}
    >
      <CardContent sx={{ p: 1.5, ":last-child": { pb: 1.5 } }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ fontSize: 15, mb: 0.5 }}
        >
          {data.id} 
        </Typography>

        <Typography fontFamily="Noto Sans Lao" fontSize={14}>
          <strong>ຈຳນວນຂາຍ:</strong> {itemValue.toLocaleString("en-US")} ຈອກ
        </Typography>

        <Typography
          fontFamily="Noto Sans Lao"
          fontSize={14}
          sx={{ mt: 0.5, color: "#2563eb" }}
        >
          <strong>ສັດສ່ວນ:</strong> {percentage.toFixed(2)}%
        </Typography>
        <Typography fontFamily={"Noto Sans Lao"} fontSize={14}>
          ຈາກຍອດຂາຍທັງຫມົດ: {totalSales ? totalSales.toLocaleString("en-US") : 0} ຈອກ
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
  const [apiResponse, setApiResponse] = useState({});
  
  const [tooltipState, setTooltipState] = useState(null);

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
      setApiResponse(ress.data);
    } catch (err) {
      console.error("Error fetching bar chart data:", err);
    } finally {
      setLoaing(false);
    }
  };

  useEffect(() => {
    if (selectDataPie) {
      fecthData();
    }
  }, [selectDataPie, queryForm.startDate, queryForm.endDate, token]);

  const handleClose = () => {
    setOpenDialogPie(false);
    setSelectDataPie("");
    setTooltipState(null);
  };

  const highestValue =
    productData.length > 0 ? Math.max(...productData.map((d) => d.value)) : 0;
  const dynamicMaxValue = highestValue * 1.1;

  const dynamicChartHeight = productData.length * 40 + 100;

  const handleBarHover = (barData, event) => {
    const rect = event.target.getBoundingClientRect();
    const clientX = rect.right + 10; 
    const clientY = rect.top + rect.height / 2; 

    setTooltipState({ 
      data: barData.data, 
      clientX, 
      clientY,
      totalSales: totalSales 
    });
  };

  const handleBarLeave = () => {
    setTooltipState(null);
  };

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
            <CircularProgress size={60} thickness={5} sx={{ color: "#00b0ff" }} />
          </Box>
        ) : (
          <>
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
                    ລາຍງານຍອດຂາຍແຕ່ລະເມນູຂອງໝວດໝູ່: {selectDataPie || ""}
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
            <DialogContent sx={{ overflow: "visible", p: 0 }}>
              <Box sx={{ height: "100%", overflowY: "auto", p: 2 }}>
                <div style={{ height: dynamicChartHeight }}>
                  <ResponsiveBar
                    data={productData}
                    keys={["value"]}
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
                        container: { zIndex: 1 }, 
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
                    tooltip={() => null} 
                    onMouseEnter={handleBarHover}
                    onMouseLeave={handleBarLeave}
                  />
                </div>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
      {tooltipState &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              left: tooltipState.clientX,
              top: tooltipState.clientY,
              zIndex: 9999999, 
              transform: "translateY(-50%)",
            }}
          >
            <CustomTooltip
              data={tooltipState.data}
              totalSales={tooltipState.totalSales}
            />
          </div>,
          document.body // Target where to render the portal (the body)
        )}
    </>
  );
};

export default DialogPieChart;