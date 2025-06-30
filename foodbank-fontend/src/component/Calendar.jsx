import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import useFoodBankStorage from "../zustand/foodbank-storage";
import { fecthReportAll, fecthReportPerBranch } from "../api/report";
import {
  getBarChartExp,
  getBarChartSell,
  getBarChartSend,
} from "../api/barChart";

export default function Calendar() {
  const {
    queryForm,
    setQueryForm,
    setDataTrack,
    setTotalData,
    setBarSell,
    setBarSend,
    setBarExp,
  } = useFoodBankStorage();
  const token = useFoodBankStorage((state) => state.token);

  const fetchBarSell = async () => {
    try {
      const getDate = await getBarChartSell(queryForm, token);
      setBarSell(getDate.data); // <-- Save data in Zustand
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const fetchBarSend = async () => {
    try {
      const getDate = await getBarChartSend(queryForm, token);
      setBarSend(getDate.data); // <-- Save data in Zustand
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const fetchBarExp = async () => {
    try {
      const getDate = await getBarChartExp(queryForm, token);
      setBarExp(getDate.data); // <-- Save data in Zustand
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fecthDataTrack = async () => {
    try {
      const respone = await fecthReportPerBranch(queryForm, token);
      setDataTrack(respone.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fecthTotalData = async () => {
    try {
      const respones = await fecthReportAll(queryForm, token);
      setTotalData(respones.data.totalDetail);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (queryForm.startDate && queryForm.endDate) {
      fecthDataTrack();
      fecthTotalData();
      fetchBarSell();
      fetchBarSend();
      fetchBarExp();
    }
  }, [queryForm.startDate, queryForm.endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: "flex", gap: "10px" }}>
        <DatePicker
          label="Start Date"
          value={queryForm.startDate ? dayjs(queryForm.startDate) : null}
          onChange={(newValue) => setQueryForm("startDate", newValue)}
        />
        <DatePicker
          label="End Date"
          value={queryForm.endDate ? dayjs(queryForm.endDate) : null}
          onChange={(newValue) => setQueryForm("endDate", newValue)}
        />
      </div>
    </LocalizationProvider>
  );
}
