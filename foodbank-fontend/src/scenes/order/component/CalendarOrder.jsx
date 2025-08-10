import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function CalendarOrder({
  setSelectFormtracksell,
  setSelectDateBrachCheck,
}) {
  const [value, setValue] = React.useState(null);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (newValue) {
      const formattedDate = dayjs(newValue).startOf("day").toISOString();
      setSelectFormtracksell((prevState) => ({
        ...prevState,
        orderDate: formattedDate,
      }));
      setSelectDateBrachCheck((prevState) => ({
        ...prevState,
        orderDate: formattedDate,
      }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={value} onChange={handleDateChange} />
    </LocalizationProvider>
  );
}
