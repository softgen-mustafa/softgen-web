"use client";

import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import { Cancel, Sync } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
  Grid,
  Box,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DropDown } from "@/app/ui/drop_down";

const partyWiseOptions = [
  {
    name: "Bill Wise",
    value: true,
  },
  {
    name: "Party Wise",
    value: false,
  },
];

const CollectionPrompts = () => {
  const snackbar = useSnackbar();
  const theme = useTheme();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [partyWise, setPartyWise] = useState(false); // Now using useState

  // Default date range for current year start to next year start
  const defaultStartDate = dayjs().startOf("year");
  const defaultEndDate = dayjs().add(1, "year").startOf("year");

  const [startDate, setStartDate] = useState<Dayjs | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(defaultEndDate);

  useEffect(() => {
    loadPrompts();
  }, [startDate, endDate, partyWise]);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      let url = `${getSgBizBaseUrl()}/prompts/get/collection?partyWise=${partyWise}`;
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

      console.log("Request body", requestBody);
      let response = await postAsync(url, requestBody);
      if (response && response.Data && response.Data.length > 0) {
        setPrompts(response.Data);
        return;
      }
      setPrompts([]);
    } catch (error) {
      snackbar.showSnackbar("Could not load collection prompts", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    action: string,
    partyName: string,
    billNumber: string,
    amountStr: string
  ) => {
    try {
      setLoading(true);
      const url = `${getSgBizBaseUrl()}/prompts/set-decision/collection?partyWise=${partyWise}`;

      const requestBody = {
        ActionCode: action,
        PartyName: partyName,
        BillNumber: billNumber,
        AmountStr: amountStr,
      };
      const response = await postAsync(url, requestBody);

      if (response === null || response === "") {
        snackbar.showSnackbar("Action completed successfully", "success");
        loadPrompts(); // Reload prompts after successful action
      }
    } catch (error) {
      snackbar.showSnackbar("Error performing action", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-auto max-h-[500px]   overflow-y-auto">
      {loading && <CircularProgress />}

      <div className="flex flex-row justify-stretch  items-center mb-4">
        <IconButton onClick={loadPrompts}>
          <Sync className="mt-4"/>
        </IconButton>

        {/* Date Pickers */}
        <div className="flex flex-row items-center w-full overflow-visible space-x-4 mt-4 mr-2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <Grid item xs>
            <Box sx={{mb:{xs:2,md:0}}}>
            <DropDown
              label="View Type"
              displayFieldKey={"name"}
              valueFieldKey={null}
              selectionValues={partyWiseOptions}
              helperText={""}
              onSelection={(selection) => {
                setPartyWise(selection.value);
                loadPrompts();
              }}
            />
            </Box>
          </Grid>
        </div>
      </div>

      {/* Collection Prompts Display */}
      {prompts.map((entry: any, index: number) => {
        return (
          <div key={index} className="flex flex-col p-1">
            <Accordion className="h-auto mb-4">
              <AccordionSummary
                expandIcon={
                  <GridExpandMoreIcon
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: "2rem",
                      "&:hover": {
                        color: theme.palette.primary.dark,
                      },
                      transition: "color 0.3s",
                    }}
                  />
                }
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography className=" text-md mb-4">
                  {entry.Message}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="h-auto">
                <Typography
                  style={{
                    whiteSpace: "pre-line",
                  }}
                  className="font-semibold"
                >
                  {entry.SummaryProfile}
                </Typography>
              </AccordionDetails>
              <AccordionActions className="flex flex-col justify-between  md:flex-row md:items-center">
                {entry.Actions &&
                  entry.Actions.map((action: any, actionIndex: number) => {
                    if (action.Title === "Ignore") {
                      return (
                        <div key={actionIndex}>
                          <IconButton
                            key={actionIndex}
                            size="medium"
                            sx={{
                              backgroundColor: "transparent",
                              boxShadow: 2,
                              "&:focus": {
                                outline: "none",
                                boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                              },
                              transition:
                                "background-color 0.3s ease, box-shadow 0.3s ease",
                              mb: { xs: 1, md: 2 },
                            }}
                          >
                            <Cancel
                              sx={{ color: theme.palette.primary.dark }}
                            />
                          </IconButton>
                        </div>
                      );
                    }
                    return (
                      <Button
                        sx={{
                          display: "flex",
                          background: theme.palette.primary.dark,
                          margin: 0.5,
                          flexGrow: 1,
                          borderRadius: "15px",
                          boxShadow: 2,
                          width: "90%",
                          color: "white",
                          fontWeight: { xs: 200, md: 400 },
                          fontSize: { xs: "0.825rem", md: "1rem" },
                          "&:hover": {
                            background: theme.palette.primary.dark,
                            boxShadow: 10,
                          },
                          "&:focus": {
                            outline: "none",
                            boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
                          },
                          transition:
                            "background-color 0.3s ease, box-shadow 0.3s ease",
                          textTransform: "capitalize",
                          mb: { xs: 0.7, md: 2 },
                        }}
                        variant="contained"
                        key={actionIndex}
                        onClick={() =>
                          handleAction(
                            action.Code,
                            entry.PartyName,
                            entry.BillNumber,
                            entry.AmountStr
                          )
                        }
                      >
                        {action.Title}
                      </Button>
                    );
                  })}
              </AccordionActions>
            </Accordion>
            {entry.Suggestion && <Typography>{entry.Suggestion}</Typography>}
          </div>
        );
      })}
    </div>
  );
};

export { CollectionPrompts };
