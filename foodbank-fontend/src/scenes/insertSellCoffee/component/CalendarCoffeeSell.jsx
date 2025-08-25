import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CalendarCoffeeSell = ({
  setSelectFormtracksend,
  setSelectDateBrachCheck,
}) => {
  const [value, setValue] = React.useState(null);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (newValue) {
      const formattedDate = dayjs(newValue).startOf("day").toISOString();
      setSelectFormtracksend((prevState) => ({
        ...prevState,
        sellDate: formattedDate,
      }));
      setSelectDateBrachCheck((prevState) => ({
        ...prevState,
        sellDate: formattedDate,
      }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={value} onChange={handleDateChange} />
    </LocalizationProvider>
  );
};

export default CalendarCoffeeSell;
