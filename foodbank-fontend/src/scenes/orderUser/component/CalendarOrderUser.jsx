import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import useFoodBankStorage from "../../../zustand/foodbank-storage";

export default function CalendarOrderUser() {
  const dateConfirmOrder = useFoodBankStorage((state) => state.dateConfirmOrder);
  const setConfirmOrder = useFoodBankStorage((state) => state.setConfirmOrder);

  // Initialize value from Zustand state, convert ISO string to dayjs or null
  const [value, setValue] = React.useState(
    dateConfirmOrder.orderDate ? dayjs(dateConfirmOrder.orderDate) : null
  );

  // If dateConfirmOrder.orderDate changes externally, update local value state
  React.useEffect(() => {
    if (dateConfirmOrder.orderDate) {
      setValue(dayjs(dateConfirmOrder.orderDate));
    } else {
      setValue(null);
    }
  }, [dateConfirmOrder.orderDate]);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    if (newValue) {
      const formattedDate = dayjs(newValue).startOf("day").toISOString();
      setConfirmOrder("orderDate", formattedDate);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={value} onChange={handleDateChange} />
    </LocalizationProvider>
  );
}
