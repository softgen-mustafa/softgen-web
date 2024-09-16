import { Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const format = "DD-MM-YYYY"; // Format of your date string




const DateRangePicker = ({
    defaultStart = "",
    defaultEnd = "",
  onDateChange,
}: {
    defaultStart?: string,
    defaultEnd?: string,
  onDateChange: (fromDate?: string, toDate?: string) => void;
}) => {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  useEffect(() => {
      if (defaultStart.length > 0) {
          setFromDate(dayjs(defaultStart, format))
      }
      if (defaultEnd.length > 0) {
          setToDate(dayjs(defaultEnd, format))
      }
  },[defaultStart, defaultEnd])

  return (
    <div className="flex flex-col">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography className="text-lg">Select Start Date</Typography>
        <DatePicker
          value={fromDate}
          views={["year", "month", "day"]}
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
          views={["year", "month", "day"]}
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
