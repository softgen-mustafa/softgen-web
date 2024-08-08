"use client";

import { useEffect, useRef, useState } from "react";
import { DropDown } from "@/app/ui/drop_down";
import { SearchInput } from "@/app/ui/text_inputs";
import { Box, Stack, Switch } from "@mui/material";
import Cookies from "js-cookie";
import {
  getAsync,
  getBmrmBaseUrl,
  getUmsBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { GridColDef } from "@mui/x-data-grid";

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
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState("all");

  const compId = Cookies.get("companyId");

  useEffect(() => {
    loadUser().then((_) => {
      setIsLoading(!isLoading);
    });
  }, []);

  useEffect(() => {
    if (!!selectedUser) {
      onApi(1, 10, "").then((_) => {
        setIsLoading(!isLoading);
      });
    }
  }, [filter, selectedUser]);

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
            <Switch checked={params.row.status ? true : false} />
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
        }
        setSelectedUser(response[0]?.id);
      }
    } catch {
      alert("Something went wrong...");
    }
  };

  const onApi = async (
    page: number,
    pageSize: number,
    searchValue?: string
  ) => {
    let url = `${getBmrmBaseUrl()}/user-info/get/permission?userId=${selectedUser}`;

    let requestBody = {
      page_number: page,
      page_size: pageSize,
      search_text: searchValue ?? "",
      filter: filter,
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
      console.log(response);
      return entries;
    }
  };

  const updateUserStatus = async (
    code: string | number,
    currentStatus: boolean
  ) => {
    try {
      let status = currentStatus ? "revoke" : "assign";
      const url = `${getBmrmBaseUrl()}/user-info/${status}-permission?userId=${selectedUser}&code=${code}`;
      const requestBody = { isActive: currentStatus };
      const response = await postAsync(url, requestBody);
      setIsLoading(!isLoading);
    } catch (error) {
      console.log("Something went wrong...");
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
            setSelectedUser(_data?.id);
          }}
        />
        <Box sx={{ width: "20%" }}>
          <DropDown
            label={"Filter"}
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={filterData}
            helperText={""}
            onSelection={(_data) => {
              setFilter(_data?.value);
            }}
          />
        </Box>
      </Stack>
      <DataTable
        columns={columns}
        refresh={isLoading}
        onApi={async (page, pageSize, searchText) => {
          return await onApi(page, pageSize, searchText);
        }}
        useSearch={true}
        onRowClick={(params) => {
          let rowData = params?.row;
          updateUserStatus(rowData?.code, rowData?.status);
        }}
      />
    </Box>
  );
};

export default UserPermissions;
