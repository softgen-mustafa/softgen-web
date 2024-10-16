// "use client";

import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
import { DropDown } from "@/app/ui/drop_down";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import { Sync } from "@mui/icons-material";
import {
  Button,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
  Grid,
  Box,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const statusTypes = [
  {
    name: "Pending",
    value: 0,
  },
  {
    name: "Done",
    value: 1,
  },
  {
    name: "Cancelled",
    value: 2,
  },
];

const CollectionReport = () => {
  const snackbar = useSnackbar();
  const theme = useTheme();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const selectedStatusTypes = useRef<{ [key: number]: number }>({});
  let userid = parseInt(Cookies.get("user_id") || "0", 10);

  // Default date range
  const defaultStartDate = dayjs().startOf("year");
  const defaultEndDate = dayjs().add(1, "year").startOf("year");

  // State for start date and end date
  const [startDate, setStartDate] = useState<Dayjs | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(defaultEndDate);

  useEffect(() => {
    loadPrompts();
  }, [startDate, endDate]); // Reload prompts whenever dates change

  const loadPrompts = async () => {
    try {
      setLoading(true);
      let url = `${getSgBizBaseUrl()}/tasks/get/collection`;

      let requestBody = {
        StartDateStr: startDate
          ? startDate.format("DD-MM-YYYY")
          : defaultStartDate.format("DD-MM-YYYY"),
        EndDateStr: endDate
          ? endDate.format("DD-MM-YYYY")
          : defaultEndDate.format("DD-MM-YYYY"),
        Filter: {
          Batch: {
            Apply: true,
            Limit: 30,
            Offset: 0,
          },
        },
      };

      let response = await postAsync(url, requestBody);

      if (response && response.Data && response.Data.length > 0) {
        setPrompts(response.Data);
      } else {
        setPrompts([]);
      }
    } catch {
      snackbar.showSnackbar("Could not load collection prompts", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (entry: any, index: number) => {
    try {
      setLoading(true);
      const url = `${getSgBizBaseUrl()}/tasks/update/collection`;
      const requestBody = {
        Title: entry.Task.Title,
        Description: entry.Task.Description,
        AssignedTo: userid,
        CreatedBy: entry.Task.CreatedBy,
        CreatedOn: entry.Task.CreatedOn,
        Status:
          selectedStatusTypes.current[index] !== undefined
            ? selectedStatusTypes.current[index]
            : 0,
      };

      const response = await postAsync(url, requestBody);

      if (response === null || response === "") {
        snackbar.showSnackbar("Action completed successfully", "success");
        loadPrompts();
      }
    } catch (error) {
      snackbar.showSnackbar("Error performing action", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContent>
      <Grid container justifyContent="space-between" alignItems="center">
        <IconButton onClick={loadPrompts}>
          <Sync />
        </IconButton>
      </Grid>

      {/* Date Pickers for selecting the date range */}
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <div className="max-h-[500px]  overflow-y-auto">
          {prompts.map((entry: any, index: number) => (
            <Box
              key={index}
              sx={{
                marginBottom: { xs: "1rem", md: "2rem" },
                padding: { xs: "1.25rem", md: "1.5rem" },
                borderColor: "white",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  borderWidth: "2px",
                  borderInlineStartWidth: "6px",
                  boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
                  borderColor: (theme) => theme.palette.primary.dark,
                  transform: "translateY(5px)",
                  borderRadius: "1.2rem",
                  mr: "4%",
                },
              }}
            >
              <Typography
                variant="h6"
                style={{
                  color: theme.palette.primary.dark,
                }}
              >
                {entry.Task.Title}
              </Typography>

              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-1"
              >
                {entry.Task.Description}
              </Typography>
              <Typography mt={2}>
                <strong>Assigned To:</strong> {entry.AssignedToName}
              </Typography>
              <Typography>
                <strong>Created By:</strong> {entry.CreatedByName}
              </Typography>
              <Typography>
                <strong>Status:</strong> {entry.StatusName}
              </Typography>

              <Grid container spacing={2} alignItems="center" mt={2}>
                <Grid item xs>
                  <DropDown
                    label="Change Status"
                    displayFieldKey={"name"}
                    valueFieldKey={null}
                    selectionValues={statusTypes}
                    helperText={""}
                    onSelection={(selection) => {
                      selectedStatusTypes.current[index] = selection.value;
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <Button
                    sx={{
                      color: "white",
                      fontWeight: { xs: "400", md: "500" },
                      paddingY: "8px",
                      paddingX: "16px",
                      borderRadius: "9px",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "&:focus": {
                        outline: "none",
                        boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.3)",
                      },
                      fontSize: { xs: "0.695rem", md: "0.8rem" },
                    }}
                    variant="contained"
                    onClick={() => handleAction(entry, index)}
                  >
                    Assigned To Me
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}
        </div>
      )}
    </CardContent>
  );
};

export { CollectionReport };
