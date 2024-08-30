"use client";

import { useEffect, useRef, useState } from "react";
import { DropDown } from "@/app/ui/drop_down";
import { SearchInput } from "@/app/ui/text_inputs";
import {
  Box,
  CircularProgress,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import {
  getAsync,
  getBmrmBaseUrl,
  getUmsBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { GridColDef } from "@mui/x-data-grid";
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";
import {
  ApiProps,
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";

interface UserProps {
  id: number;
  name: string;
}

const filterData = [
  {
    id: 1,
    name: "All",
    value: "all",
  },
  {
    id: 2,
    name: "Active",
    value: "active",
  },
  {
    id: 3,
    name: "In-active",
    value: "inactive",
  },
];

const UserPermissions = () => {
  const [data, setData] = useState([]);
  const [refresh, triggerRefresh] = useState(false);
  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  let selectedUser = useRef(null);
  let selectedFilter = useRef(null);

  const compId = Cookies.get("companyId");

  useEffect(() => {
    // FeatureControl("MasterConfigButton").then((permission) => {
    //   setHasPermission(permission);
    //   if (permission) {
    loadUser().then((_) => {
      triggerRefresh(!refresh);
    });
    //   }
    // });
  }, []);

  // useEffect(() => {
  //   loadUser().then((_) => {
  //     triggerRefresh(!refresh);
  //   });
  // }, []);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "name",
      headerName: "Name",
      editable: false,
      sortable: true,
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      editable: false,
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Switch
              checked={params.row.status ? true : false}
              onChange={() =>
                updateUserStatus(params.row.code, params.row.status)
              }
            />
          </Box>
        );
      },
    },
  ];

  const loadUser = async () => {
    try {
      if (compId) {
        const url = `${getUmsBaseUrl()}/users/company/${compId}`;
        let response = await getAsync(url);
        if (response && response.length > 0) {
          let values = response.map((_data: UserProps) => ({
            id: _data?.id,
            name: _data?.name,
          }));
          setData(values);
          selectedUser.current = response[0]?.id;
        }
      }
    } catch {
      console.log("Something went wrong...");
    }
  };

  const onApi = async (
    page: number,
    pageSize: number,
    searchValue?: string
    // apiProps: ApiProps
  ) => {
    let url = `${getBmrmBaseUrl()}/user-info/get/permission?userId=${
      selectedUser.current
    }`;

    let requestBody = {
      page_number: page,
      page_size: pageSize,
      search_text: searchValue ?? "",

      // page_number: apiProps.offset + 1,
      // page_size: apiProps.limit,
      // search_text: apiProps.searchText ?? "",
      filter: selectedFilter.current,
    };
    let response = await postAsync(url, requestBody);
    if (response && response.length > 0) {
      let entries = response.map((_data: any, index: number) => {
        return {
          id: index,
          name: _data?.name,
          status: _data?.is_active,
          code: _data?.code,
        };
      });
      return entries;
    }
  };

  const updateUserStatus = async (
    code: string | number,
    currentStatus: boolean
  ) => {
    try {
      let status = currentStatus ? "revoke" : "assign";
      const url = `${getBmrmBaseUrl()}/user-info/${status}-permission?userId=${
        selectedUser.current
      }&code=${code}`;
      const requestBody = { isActive: currentStatus };
      const response = await postAsync(url, requestBody);
      triggerRefresh(!refresh);
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  // if (hasPermission === null) {
  //   return <CircularProgress />;
  // }

  // if (hasPermission === false) {
  //   return (
  //     <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
  //       Get the Premium For this Service Or Contact Admin - 7977662924
  //     </Typography>
  //   );
  // }

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
            // setSelectedUser(_data?.id);
            selectedUser.current = _data?.id;
            triggerRefresh(!refresh);
          }}
          useSearch={true}
        />
        <Box sx={{ width: "20%" }}>
          <DropDown
            label={"Filter"}
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={filterData}
            helperText={""}
            onSelection={(_data) => {
              selectedFilter.current = _data?.value;
              triggerRefresh(!refresh);
            }}
          />
        </Box>
      </Stack>
      <DataTable
        columns={columns}
        refresh={refresh}
        onApi={async (page, pageSize, searchText) => {
          return await onApi(page, pageSize, searchText);
        }}
        useSearch={true}
        onRowClick={(params) => {}}
      />
      {/* <PeriodicTable
        useSearch={true}
        columns={columns.map((col: any) => {
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: "text",
            pinned: false,
            rows: [],
          };
          return column;
        })}
        onApi={onApi}
      /> */}
    </Box>
  );
};

export default UserPermissions;
