import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CalendarBaristar = ({ setSelectFormtracksell }) => {
  // set default to previous day
  const [value, setValue] = React.useState(dayjs().subtract(1, "day"));

  React.useEffect(() => {
    // set default sellAt as previous day on mount
    setSelectFormtracksell((prevState) => ({
      ...prevState,
      sellAt: dayjs().subtract(1, "day").startOf("day").toISOString(),
    }));
  }, [setSelectFormtracksell]);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (newValue) {
      const formattedDate = dayjs(newValue).startOf("day").toISOString();
      setSelectFormtracksell((prevState) => ({
        ...prevState,
        sellAt: formattedDate,
      }));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={value} onChange={handleDateChange} />
    </LocalizationProvider>
  );
};

export default CalendarBaristar;
