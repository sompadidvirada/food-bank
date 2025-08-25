import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function CalendarSendMaterial({
  setSelectFormtracksend,
  setSelectDateBrachCheck,
}) {
  const [value, setValue] = React.useState(null);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (newValue) {
      const formattedDate = dayjs(newValue).startOf("day").toISOString();
      setSelectFormtracksend((prevState) => ({
        ...prevState,
        requisitionDate: formattedDate,
      }));
      setSelectDateBrachCheck((prevState) => ({
        ...prevState,
        requisitionDate: formattedDate,
      }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={value} onChange={handleDateChange} />
    </LocalizationProvider>
  );
}