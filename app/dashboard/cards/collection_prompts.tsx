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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { useEffect, useState, useRef } from "react";

const CollectionPrompts = () => {
  const snackbar = useSnackbar();
  const theme = useTheme();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const partyWiseRef = useRef(false);
  const dateRange = useRef({
    startDate: "01-01-2024",
    endDate: "01-01-2025",
  });

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      let url = `${getSgBizBaseUrl()}/prompts/get/collection?partyWise=${
        partyWiseRef.current
      }`;
      let requestBody = {
        StartDateStr: dateRange.current.startDate,
        EndDateStr: dateRange.current.endDate,
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
        return;
      }
      setPrompts([]);
    } catch {
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
      const url = `${getSgBizBaseUrl()}/prompts/set-decision/collection?partyWise=${
        partyWiseRef.current
      }`;

      const requestBody = {
        ActionCode: action,
        PartyName: partyName,
        BillNumber: billNumber,
        AmountStr: amountStr,
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

  const handlePartyWiseToggle = () => {
    partyWiseRef.current = !partyWiseRef.current;
    loadPrompts();
  };
  return (
    <div className="flex flex-col w-auto max-h-[500px] overflow-y-auto">
      {loading && <CircularProgress />}

      <div className="flex flex-row justify-between items-center mb-4">
        <IconButton onClick={loadPrompts}>
          <Sync />
        </IconButton>
        <FormControlLabel
          control={
            <Switch
              checked={partyWiseRef.current}
              onChange={handlePartyWiseToggle}
              color="primary"
            />
          }
          label="Party Wise"
        />
      </div>
      {prompts.map((entry: any, index: number) => {
        return (
          <div key={index} className="flex flex-col p-1">
            <Accordion className="h-auto mb-4">
              <AccordionSummary
                expandIcon={
                  <GridExpandMoreIcon
                    sx={{
                      color: theme.palette.primary.main, // Change icon color
                      fontSize: "2rem", // Adjust the icon size
                      "&:hover": {
                        color: theme.palette.primary.dark, // Change color on hover
                      },
                      transition: "color 0.3s", // Smooth transition effect for hover
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
                              backgroundColor: "transparent", // Default background
                              boxShadow: 2, // Subtle shadow for depth
                              "&:focus": {
                                outline: "none",
                                boxShadow: `0 0 0 2px ${theme.palette.primary.main}`, // Focus ring with main error color
                              },
                              transition:
                                "background-color 0.3s ease, box-shadow 0.3s ease", // Smooth transitions
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
                          borderRadius: "15px", // Rounded corners
                          boxShadow: 2, // Medium shadow
                          width: "90%",
                          color: "white", // Text color
                          fontWeight: { xs: 200, md: 400 },
                          fontSize: { xs: "0.825rem", md: "1rem" },
                          "&:hover": {
                            background: theme.palette.primary.dark, // Use dark color on hover
                            boxShadow: 10, // Optional: elevate shadow on hover
                          },
                          "&:focus": {
                            outline: "none",
                            boxShadow: `0 0 0 2px ${theme.palette.primary.light}`, // Focus ring
                          },
                          transition:
                            "background-color 0.3s ease, box-shadow 0.3s ease", // Smooth transitions
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
