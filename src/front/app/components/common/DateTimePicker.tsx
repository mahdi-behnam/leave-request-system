import { DateTimePicker as DateTimePickerComponent } from "@mui/x-date-pickers/DateTimePicker";
import type { DateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const DateTimePicker = (props: DateTimePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePickerComponent {...props} ampm={false} />
    </LocalizationProvider>
  );
};

export default DateTimePicker;
