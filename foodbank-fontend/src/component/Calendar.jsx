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
import {
  getPieChartExp,
  getPieChartSell,
  getPieChartSend,
} from "../api/PieChart";
import { getLineChart } from "../api/lineChart";
import { getImagesTrack } from "../api/tracking";

export default function Calendar({ selectBranchs }) {
  const {
    queryForm,
    setQueryForm,
    setDataTrack,
    setTotalData,
    setBarSell,
    setBarSend,
    setBarExp,
    setPieSell,
    setPieSend,
    setPieExp,
    setLineChartData,
    getImageTrack,
  } = useFoodBankStorage();
  const token = useFoodBankStorage((state) => state.token);

  const fecthImageTrack = async () => {
    try {
      const updatedQueryForm =
        selectBranchs && selectBranchs.length > 0
          ? { ...queryForm, branchs: selectBranchs }
          : { ...queryForm };
      const ress = await getImagesTrack(updatedQueryForm, token)
      getImageTrack(ress.data)
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLineChartData = async () => {
    try {
      const updatedQueryForm =
        selectBranchs && selectBranchs.length > 0
          ? { ...queryForm, branchs: selectBranchs }
          : { ...queryForm };
      const getDate = await getLineChart(updatedQueryForm, token);
      setLineChartData(getDate.data); // <-- Save data in Zustand
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchPieSell = async () => {
    try {
      const updatedQueryForm =
        selectBranchs && selectBranchs.length > 0
          ? { ...queryForm, branchs: selectBranchs }
          : { ...queryForm };
      const getDate = await getPieChartSell(updatedQueryForm, token);
      setPieSell(getDate.data); // <-- Save data in Zustand
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const fetchPieSend = async () => {
    try {
      const updatedQueryForm =
        selectBranchs && selectBranchs.length > 0
          ? { ...queryForm, branchs: selectBranchs }
          : { ...queryForm };
      const getDate = await getPieChartSend(updatedQueryForm, token);
      setPieSend(getDate.data); // <-- Save data in Zustand
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const fetchPieExp = async () => {
    try {
      const updatedQueryForm =
        selectBranchs && selectBranchs.length > 0
          ? { ...queryForm, branchs: selectBranchs }
          : { ...queryForm };
      const getDate = await getPieChartExp(updatedQueryForm, token);
      setPieExp(getDate.data); // <-- Save data in Zustand
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const fetchBarSell = async () => {
    try {
      const updatedQueryForm =
        selectBranchs && selectBranchs.length > 0
          ? { ...queryForm, branchs: selectBranchs }
          : { ...queryForm };
      const getDate = await getBarChartSell(updatedQueryForm, token);
      setBarSell(getDate.data); // <-- Save data in Zustand
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const fetchBarSend = async () => {
    try {
      const updatedQueryForm =
        selectBranchs && selectBranchs.length > 0
          ? { ...queryForm, branchs: selectBranchs }
          : { ...queryForm };
      const getDate = await getBarChartSend(updatedQueryForm, token);
      setBarSend(getDate.data); // <-- Save data in Zustand
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const fetchBarExp = async () => {
    try {
      const updatedQueryForm =
        selectBranchs && selectBranchs.length > 0
          ? { ...queryForm, branchs: selectBranchs }
          : { ...queryForm };
      const getDate = await getBarChartExp(updatedQueryForm, token);
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
      fecthImageTrack()
    }
  }, [queryForm.startDate, queryForm.endDate]);

  React.useEffect(() => {
    if (queryForm.startDate && queryForm.endDate) {
      fetchBarSell();
      fetchBarSend();
      fetchBarExp();
    }
  }, [queryForm.startDate, queryForm.endDate, selectBranchs]);

  React.useEffect(() => {
    if (queryForm.startDate && queryForm.endDate) {
      fetchPieSell();
      fetchPieSend();
      fetchPieExp();
    }
  }, [queryForm.startDate, queryForm.endDate, selectBranchs]);

  React.useEffect(() => {
    if (queryForm.startDate && queryForm.endDate) {
      fetchLineChartData();
    }
  }, [queryForm.startDate, queryForm.endDate, selectBranchs]);

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
