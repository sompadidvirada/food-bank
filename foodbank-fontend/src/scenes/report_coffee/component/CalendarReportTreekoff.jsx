import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { fecthReportTreekoff } from "../../../api/report";

export default function CalendarReportTreekoff({ setDataReport, setLoading }) {
  const token = useFoodBankStorage((state) => state.token);
  const { queryForm, setQueryForm } = useFoodBankStorage();

  const fecthReportTree = React.useCallback(async () => {
    if (!queryForm.startDate || !queryForm.endDate) {
      return; // Exit if dates aren't fully selected
    }

    try {
      setLoading(true);
      const ress = await fecthReportTreekoff(queryForm, token);
      setDataReport(ress.data);
    } catch (err) {
      console.error("Failed to fetch report:", err);
    } finally {
      setLoading(false);
    }
  }, [queryForm, token, setLoading, setDataReport]);

  React.useEffect(() => {
    if (queryForm.startDate && queryForm.endDate) {
      fecthReportTree();
    }
  }, [queryForm]);

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
