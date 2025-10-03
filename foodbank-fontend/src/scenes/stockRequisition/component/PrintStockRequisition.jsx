import { Box, Button } from "@mui/material";
import React, { useRef } from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useReactToPrint } from "react-to-print";
import { format, parseISO } from "date-fns";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import ContentToPrint from "./ContentToPrint";

const PrintStockRequisition = ({
  branchName,
  queryForm = [],
  totals,
  rawMaterialVariants,
  rawMaterial,
  stockRequisitionData,
}) => {
  const componentRef = useRef();

  const user = useFoodBankStorage((state) => state.user);

  const startDate = queryForm?.requisitionDate
    ? format(parseISO(queryForm.requisitionDate), "dd/MM/yyyy")
    : "-";
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `ປີ່ນລາຍງານການເບີກວັດຖຸດີບຂອງ ${branchName} ປະຈຳວັນທີ ${startDate}`,
  });

  return (
    <Box>
      <Button
        variant="contained"
        color="info"
        sx={{ fontFamily: "Noto Sans Lao" }}
        startIcon={<LocalPrintshopIcon />}
        onClick={() => handlePrint()}
        disabled={queryForm?.requisitionDate && branchName ? false : true}
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

export default PrintStockRequisition;
