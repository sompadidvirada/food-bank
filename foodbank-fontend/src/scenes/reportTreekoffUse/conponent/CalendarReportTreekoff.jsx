import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CalendarReportTreekoff = ({ queryForm, setQueryFormState }) => {
  const setQueryForm = (field, value) => {
    setQueryFormState((prev) => ({
      ...prev,
      [field]: value ? value.toDate().toISOString() : null,
    }));
  };
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
};

export default CalendarReportTreekoff;
