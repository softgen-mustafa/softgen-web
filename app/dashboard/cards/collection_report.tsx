"use client";

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
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";

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
      let url = `${getSgBizBaseUrl()}/tasks/get/collection`;
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
      // console.log("Request Body ", JSON.stringify(requestBody));
      let response = await postAsync(url, requestBody);
      // console.log("Response: ", JSON.stringify(response));

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
      // console.log("Action parameters: ", entry.Task);
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
      // console.log("Request body: ", requestBody);

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
      <Grid container justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5">Collection Task</Typography>
        <IconButton onClick={loadPrompts}>
          <Sync />
        </IconButton>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <div className="max-h-[500px] overflow-y-auto">
          {prompts.map((entry: any, index: number) => (
            <div
              key={index}
              className="mb-6 p-4 border rounded-[10px] shadow-md"
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
                        backgroundColor: "primary.dark", // Change color on hover
                      },
                      "&:focus": {
                        outline: "none",
                        boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.3)", // Custom focus ring
                      },
                      fontSize: { xs: "0.695rem", md: "0.8rem" }, // Responsive font sizes
                    }}
                    variant="contained"
                    onClick={() => handleAction(entry, index)}
                  >
                    Assigned To Me
                  </Button>
                </Grid>
              </Grid>

              {/* {index < prompts.length - 1 && <Divider className="mt-4" />} */}
            </div>
          ))}
        </div>
      )}
    </CardContent>
  );
};

export { CollectionReport };
