import { Box, Button } from "@mui/material";
import React, { useRef } from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useReactToPrint } from "react-to-print";
import { format, parseISO } from "date-fns";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import ComponentToPrint from "./ComponentToPrint";

const PrintReportTreekoff = ({
  queryForm = [],
  branchName,
  rawMaterial,
  reportCoffeeUse,
}) => {
  const componentRef = useRef();

  const user = useFoodBankStorage((state) => state.user);
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `ປີ່ນລາຍງານ`,
  });

  const result = rawMaterial?.map((material) => {
    // find the deepest variant (the one that is not a parent of others)
    const variants = material.materialVariant;
    const parentIds = new Set(
      variants.map((v) => v.parentVariantId).filter(Boolean)
    );

    // deepest = variant whose id is not in parentIds
    const deepest = variants.filter((v) => !parentIds.has(v.id));

    return {
      ...material,
      materialVariant: deepest,
    };
  });

  return (
    <Box>
      <Button
        variant="contained"
        color="info"
        sx={{ fontFamily: "Noto Sans Lao" }}
        startIcon={<LocalPrintshopIcon />}
        onClick={() => handlePrint()}
        disabled={
          queryForm?.startDate && queryForm?.endDate && queryForm?.branchId
            ? false
            : true
        }
      >
        ປິ່ນລາຍງານ
      </Button>

      {/* keep it rendered but not visible on screen */}
      <Box sx={{ display: "none" }}>
        <ComponentToPrint
          user={user}
          ref={componentRef}
          rawMaterial={result}
          branchName={branchName}
          queryForm={queryForm}
          reportCoffeeUse={reportCoffeeUse}
        />
      </Box>
    </Box>
  );
};

export default PrintReportTreekoff;
