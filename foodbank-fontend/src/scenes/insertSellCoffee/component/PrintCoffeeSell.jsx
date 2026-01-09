import { Box, Button } from "@mui/material";
import React, { useRef } from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useReactToPrint } from "react-to-print";
import { format, parseISO } from "date-fns";
import ComponentToPrint from "./ComponentToPrint";

const PrintCoffeeSell = ({
    detailedSalesData,
    aggregatedCounts,
    grandTotalUnitsSold,
    selectDateBrachCheck
}) => {
  const componentRef = useRef();


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `ປີ່ນລາຍງານການຂາຍ ປະຈຳວັນທີ`,
  });


  return (
    <Box>
      <Button
        variant="contained"
        color="info"
        sx={{ fontFamily: "Noto Sans Lao" }}
        startIcon={<LocalPrintshopIcon />}
        onClick={() => handlePrint()}
      >
        ປິ່ນລາຍງານ
      </Button>

      {/* keep it rendered but not visible on screen */}
      <Box sx={{ display: "none" }}>
        <ComponentToPrint
          ref={componentRef}
          detailedSalesData={detailedSalesData}
          aggregatedCounts={aggregatedCounts}
          grandTotalUnitsSold={grandTotalUnitsSold}
          selectDateBrachCheck={selectDateBrachCheck}
        />
      </Box>
    </Box>
  );
};

export default PrintCoffeeSell;
