import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import CalendarReportTreekoff from "./conponent/CalendarReportTreekoff";
import SelectBranchReportTreekoff from "./conponent/SelectBranchReportTreekoff";
import PrintReportTreekoff from "./conponent/PrintReportTreekoff";
import BarChartReportTreekoff from "./conponent/BarChartReportTreekoff";
import { getReportCoffeeSell } from "../../api/reportCoffeeSell";
import { format, parseISO } from "date-fns";
import { getRawMaterialVariantToInsert } from "../../api/rawMaterial";
import FilterReportDialog from "./conponent/FilterReportDialog";

const URL =
  "https://treekoff-storage-rawmaterials.s3.ap-southeast-2.amazonaws.com";

const ReportTreekoffUse = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token);
  const [reportCoffeeUse, setReportCoffeeUse] = useState([]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [filteredReport, setFilteredReport] = useState(reportCoffeeUse);
  const [queryForm, setQueryFormState] = useState({
    startDate: "",
    endDate: "",
    branchId: "",
  });
  const [branchName, setBranchName] = useState();

  const fecthReportCoffeeUse = async () => {
    try {
      const ress = await getReportCoffeeSell(queryForm, token);
      setReportCoffeeUse(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fecthRawMaterial = async () => {
    try {
      const ress = await getRawMaterialVariantToInsert(token);
      setRawMaterial(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (queryForm.startDate && queryForm.endDate && queryForm.branchId) {
      fecthReportCoffeeUse();
    }
  }, [token, queryForm]);

  useEffect(() => {
    setFilteredReport(reportCoffeeUse); // reset filtered report when data changes
  }, [reportCoffeeUse]);

  useEffect(() => {
    fecthRawMaterial();
  }, [token]);

  // open image modal function

  return (
    <Box m="20px">
      <Header
        title="ລາຍງານການການໃຊ້ວັດຖຸດິບ TREEKOFF"
        subtitle="ລາຍງານການນຳໃຊ້ວັດຖຸດິບ TREEKOFF ຂອງແຕ່ລະສາຂາ ປຽບທຽບກັບຍອດເບີກວັດຖຸດິບ."
      />
      <Box
        mt="30px"
        display="grid"
        gridTemplateColumns="repeat(1, 20fr)"
        gridAutoRows="60px"
        gap="20px"
      >
        <Box gridColumn="span 1" backgroundColor={colors.primary[400]}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="20px"
          >
            <Box>
              <CalendarReportTreekoff
                setQueryFormState={setQueryFormState}
                queryForm={queryForm}
              />
            </Box>
            <Box>
              <SelectBranchReportTreekoff
                setQueryFormState={setQueryFormState}
                setBranchName={setBranchName}
              />
            </Box>
            <Box>
              <PrintReportTreekoff
                branchName={branchName}
                queryForm={queryForm}
                rawMaterial={rawMaterial}
                reportCoffeeUse={reportCoffeeUse}
              />
            </Box>
          </Box>
        </Box>
        <Box gridColumn="span 1" backgroundColor={colors.primary[400]}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="20px"
            p={2}
          >
            <Box>
              {queryForm?.startDate && queryForm?.endDate ? (
                <Typography sx={{ fontFamily: "Noto Sans Lao", fontSize: 20 }}>
                  ປຽບທຽບຍອດການເບີກໃຊ້ຂອງສາຂາ {branchName} ຈາກວັນທີ{" "}
                  {format(parseISO(queryForm?.startDate), "dd/MM/yyyy")} -{" "}
                  {format(parseISO(queryForm?.endDate), "dd/MM/yyyy")}
                </Typography>
              ) : (
                <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
                  "No date selected"
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/**Section 2 grap data */}
        <Box>
          <FilterReportDialog
            reportCoffeeUse={reportCoffeeUse}
            setFilteredReport={setFilteredReport}
            colors={colors}
          />
        </Box>
        <Box>
          <BarChartReportTreekoff
            data={filteredReport}
            queryForm={queryForm}
            branchName={branchName}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ReportTreekoffUse;
