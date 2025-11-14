import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function Calendar({
  setSelectFormtracksell,
  setSelectDateBrachCheck,
}) {
  // 👉 Default to previous day
  const defaultDate = dayjs().subtract(1, "day").startOf("day");
  const [value, setValue] = React.useState(defaultDate);

  // 👉 Run once on mount to update parent state with default date
  React.useEffect(() => {
    const formattedDate = defaultDate.toISOString();

    setSelectFormtracksell((prevState) => ({
      ...prevState,
      sellAt: formattedDate,
    }));

    setSelectDateBrachCheck((prevState) => ({
      ...prevState,
      sellDate: formattedDate,
    }));
  }, []);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (newValue) {
      const formattedDate = dayjs(newValue).startOf("day").toISOString();

      setSelectFormtracksell((prevState) => ({
        ...prevState,
        sellAt: formattedDate,
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
}
