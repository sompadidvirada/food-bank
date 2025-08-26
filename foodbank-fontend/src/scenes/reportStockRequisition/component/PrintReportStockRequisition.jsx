import { Box, Button } from "@mui/material";
import React, { useRef } from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useReactToPrint } from "react-to-print";
import { format, parseISO } from "date-fns";
import ContentToPrint from "./ContentToPrint";
import useFoodBankStorage from "../../../zustand/foodbank-storage";

const PrintReportStockRequisition = ({
  branchName,
  queryForm = [],
  totals,
  rawMaterialVariants,
  rawMaterial,
  stockRequisitionData,
}) => {
  const componentRef = useRef();

  const user = useFoodBankStorage((state) => state.user);

  const startDate = queryForm?.startDate
    ? format(parseISO(queryForm.startDate), "dd/MM/yyyy")
    : "-";
  const endDate = queryForm?.endDate
    ? format(parseISO(queryForm.endDate), "dd/MM/yyyy")
    : "-";

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `ປີ່ນລາຍງານການເບີກວັດຖຸດີບຂອງ ${branchName} ປະຈຳວັນທີ ${startDate} - ${endDate}`,
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
        <ContentToPrint
          ref={componentRef}
          branchName={branchName}
          queryForm={queryForm}
          totals={totals}
          rawMaterialVariants={rawMaterialVariants}
          rawMaterial={rawMaterial}
          stockRequisitionData={stockRequisitionData}
          user={user}
        />
      </Box>
    </Box>
  );
};

export default PrintReportStockRequisition;
