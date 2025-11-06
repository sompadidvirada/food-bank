import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CalendarOrderBaristar = ({ setDateToGet, dateToGet }) => {
  const handleDateChange = (newValue) => {
    if (newValue) {
      const localDate = dayjs(newValue).startOf("day").toDate();
      setDateToGet(localDate);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={dayjs(dateToGet)} // 👈 use parent's value
        onChange={handleDateChange}
      />
    </LocalizationProvider>
  );
};

export default CalendarOrderBaristar;
