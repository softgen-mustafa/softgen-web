"use client";

import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
import { DropDown } from "@/app/ui/drop_down";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import { Sync } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
  Divider,
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
      console.log("Request Body ", JSON.stringify(requestBody));
      let response = await postAsync(url, requestBody);
      console.log("Response: ", JSON.stringify(response));

      if (response && response.Data && response.Data.length > 0) {
        setPrompts(response.Data);
      } else {
        setPrompts([]);
      }
    } catch (error) {
      console.error("Error loading prompts: ", error);
      snackbar.showSnackbar("Could not load collection prompts", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (entry: any, index: number) => {
    try {
      setLoading(true);
      console.log("Action parameters: ", entry.Task);
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
      console.log("Request body: ", requestBody);

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
    <Card className="max-w-2xl mx-auto">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5">Collection Report</Typography>
          <IconButton onClick={loadPrompts}>
            <Sync />
          </IconButton>
        </div>

        {loading ? (
          <CircularProgress />
        ) : (
          <div className="max-h-[500px] overflow-y-auto">
            {prompts.map((entry: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-end">
                  <Typography
                    variant="h6"
                    style={{
                      color: theme.palette.primary.dark,
                    }}
                  >
                    {entry.Task.Title}
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mt-2"
                >
                  {entry.Task.Description}
                </Typography>
                <div className="mt-4">
                  <Typography>
                    <strong>Assigned To:</strong> {entry.AssignedToName}
                  </Typography>
                  <Typography>
                    <strong>Created By:</strong> {entry.CreatedByName}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {entry.StatusName}
                  </Typography>

                  <div className="flex mt-4">
                    <Button
                      variant="contained"
                      onClick={() => handleAction(entry, index)}
                    >
                      {`Assigned To -${userid}`}
                    </Button>
                    <div className="ml-10 flex flex-grow "></div>
                    <DropDown
                      label="View"
                      displayFieldKey={"name"}
                      valueFieldKey={null}
                      selectionValues={statusTypes}
                      helperText={""}
                      onSelection={(selection) => {
                        selectedStatusTypes.current[index] = selection.value;
                      }}
                    />
                  </div>
                </div>
                {index < prompts.length - 1 && <Divider className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { CollectionReport };
