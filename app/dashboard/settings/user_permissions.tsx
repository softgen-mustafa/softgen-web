"use client";

import { useEffect, useRef, useState } from "react";
import { DropDown } from "@/app/ui/drop_down";
import { Box, Button, Stack, Switch, Typography } from "@mui/material";
import {
  getAsync,
  getPortalUrl,
  postAsync,
} from "@/app/services/rest_services";
import {
  ApiProps,
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";
import { ApiMultiDropDown } from "@/app/ui/api_multi_select";
import { useSnackbar } from "@/app/ui/snack_bar_provider";

interface UserProps {
  id: number;
  name: string;
}

const UserPermissions = () => {
  const [data, setData] = useState([]);
  const [refresh, triggerRefresh] = useState(false);

  let selectedUser = useRef(null);
  let selectedPermission = useRef<any>();

  const snackbar = useSnackbar();

  useEffect(() => {
    loadUser().then((_) => {
      triggerRefresh(!refresh);
    });
  }, []);

  const columns: any[] = [
    {
      field: "permission",
      headerName: "Permission",
      editable: false,
      sortable: true,
      hideable: true,
      flex: 2,
    },
    {
      field: "name",
      headerName: "Name",
      editable: false,
      sortable: true,
      flex: 2,
    },
  ];

  const loadUser = async () => {
    try {
      const url = `${getPortalUrl()}/companies/get/users`;
      let response = await getAsync(url);
      if (response && response.length > 0) {
        let values = response.map((_data: UserProps) => ({
          id: _data?.id,
          name: _data?.name,
        }));
        setData(values);
        selectedUser.current = response[0]?.id;
      }
    } catch {
      console.log("Something went wrong...");
    }
  };

  const loadFeatures = async () => {
    try {
      let url = `${getPortalUrl()}/features`;
      let response = await getAsync(url);
      if (response == null) {
        return [];
      }
      let values = response.map((entry: any) => {
        return {
          Permission: entry.Permission,
          ...entry,
        };
      });
      console.log(JSON.stringify(values));
      return values;
    } catch {
      return [];
    }
  };

  const mapFeatures = async () => {
    try {
      if (
        !selectedPermission.current ||
        selectedPermission.current.length === 0
      ) {
        return;
      }

      let groupPermissions = selectedPermission.current;

      let url = `${getPortalUrl()}/features/map/bulk?userId=${
        selectedUser.current
      }`;

      let requestBody = {
        groupPermissions,
      };
      console.log("mapFeatures RequestBody", JSON.stringify(requestBody));

      await postAsync(url, requestBody);
      snackbar.showSnackbar("Permissions mapped successfully");
    } catch {
      snackbar.showSnackbar("Failed to map permissions");
    }
  };
  const onApi = async (apiProps: ApiProps) => {
    let url = `${getPortalUrl()}/features/user?userId=${selectedUser.current}`;

    try {
      let response = await getAsync(url);
      if (response && response.length > 0) {
        let entries = response.map((_data: any, index: number) => {
          return {
            id: index ?? _data?.ID,
            name: _data?.Name,
            permission: _data?.Permission,
          };
        });
        return entries;
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return [];
    } finally {
      triggerRefresh(false);
    }
  };

  return (
    <Box>
      <Stack flexDirection={"row"} gap={1.5} mb={1}>
        <DropDown
          label={"Select User"}
          displayFieldKey={"name"}
          valueFieldKey={null}
          selectionValues={data}
          helperText={""}
          onSelection={(_data) => {
            selectedUser.current = _data?.id;
            triggerRefresh(!refresh);
          }}
          useSearch={true}
        />

        <ApiMultiDropDown
          reload={false}
          label="Feature Permission List"
          displayFieldKey={"Name"}
          defaultSelections={selectedPermission.current}
          valueFieldKey={null}
          onApi={loadFeatures}
          helperText={""}
          onSelection={(selection) => {
            selectedPermission.current =
              selection.map((entry: any) => entry.Permission) ?? [];
          }}
        />

        <Button
          variant="contained"
          onClick={mapFeatures}
          sx={{
            height: 50,
            borderRadius: "12px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Typography textTransform={"capitalize"} letterSpacing={0.8}>
            Map
          </Typography>
        </Button>

        <Button
          variant="contained"
          onClick={() => {}}
          sx={{
            height: 50,

            width: { xs: "100%", md: "200px" },
            borderRadius: "12px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Typography textTransform={"capitalize"} letterSpacing={0.8}>
            Remove
          </Typography>
        </Button>
      </Stack>

      <PeriodicTable
        actionViews={[
          {
            label: "Status",
            renderView: (row: any[]) => {
              let status = row.find((entry: any) => entry.field === "status");
              return (
                <div>
                  <Switch
                    checked={status != null && status.value ? true : false}
                    onChange={() => ""}
                  />
                </div>
              );
            },
          },
        ]}
        useSearch={true}
        reload={refresh}
        columns={columns.map((col: any) => {
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: "text",
            pinned: false,
            hideable: col.hideable,
            rows: [],
          };
          return column;
        })}
        onApi={onApi}
      />
    </Box>
  );
};

export default UserPermissions;
