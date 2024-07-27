import { Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useState } from "react";

const DateRangePicker = ({
  onDateChange,
}: {
  onDateChange: (fromDate?: string, toDate?: string) => void;
}) => {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  return (
    <div className="flex flex-col">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography className="text-lg">Select Start Date</Typography>
        <DatePicker
          value={fromDate}
          onChange={(value) => {
            setFromDate(value);
            onDateChange(
              value?.format("DD-MM-YYYY"),
              toDate?.format("DD-MM-YYYY"),
            );
          }}
        />
        <br />
        <Typography className="text-lg">Select End Date</Typography>
        <DatePicker
          value={toDate}
          onChange={(value) => {
            setToDate(value);
            onDateChange(
              fromDate?.format("DD-MM-YYYY"),
              value?.format("DD-MM-YYYY"),
            );
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export { DateRangePicker };
