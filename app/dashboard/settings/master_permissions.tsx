"use client";

import { useEffect, useRef, useState } from "react";
import {
  getAsync,
  getBmrmBaseUrl,
  getUmsBaseUrl,
} from "@/app/services/rest_services";
import Cookies from "js-cookie";
import { Box, Stack, Switch } from "@mui/material";
import { DropDown } from "@/app/ui/drop_down";
import { DataTable } from "@/app/ui/data_grid";
import { GridColDef } from "@mui/x-data-grid";

interface UserProps {
  id: number;
  name: string;
}

const compId = Cookies.get("companyId");

const masterTypes = [
  {
    title: "Ledger",
    namesUrl: "/ledger/get/names",
    mappedNamesUrl: "/table-mapping/get/Ledger",
    mapUrl: "/table-mapping/map/ledger",
    mapAllUrl: "/table-mapping/map/ledger/all",
    removeUrl: "/table-mapping/remove/ledger",
  },
  {
    title: "Stock Item",
    namesUrl: "/stock-item/get/names",
    mappedNamesUrl: "/table-mapping/get/Item",
    mapUrl: "/table-mapping/map/item",
    mapAllUrl: "/table-mapping/map/item/all",
    removeUrl: "/table-mapping/remove/item",
  },
  {
    title: "Stock Group",
    namesUrl: "/stock-group/get/names",
    mappedNamesUrl: "/table-mapping/get/ItemGroup",
    mapUrl: "/table-mapping/map/itemGroup",
    mapAllUrl: "/table-mapping/map/itemGroup/all",
    removeUrl: "/table-mapping/remove/itemGroup",
  },
  {
    title: "Stock Category",
    namesUrl: "/stock-category/get/names",
    mappedNamesUrl: "/table-mapping/get/ItemCategory",
    mapUrl: "/table-mapping/map/itemCategory",
    mapAllUrl: "/table-mapping/map/itemCategory/all",
    removeUrl: "/table-mapping/remove/category",
  },
  {
    title: "Group",
    namesUrl: "/group/get/names",
    mappedNamesUrl: "/table-mapping/get/Group",
    mapUrl: "/table-mapping/map/group",
    mapAllUrl: "/table-mapping/map/group/all",
    removeUrl: "/table-mapping/remove/group",
  },
  {
    title: "Godown",
    namesUrl: "/stock-godown/get/names",
    mappedNamesUrl: "/table-mapping/get/Godown",
    mapUrl: "/table-mapping/map/godown",
    mapAllUrl: "/table-mapping/map/godown/all",
    removeUrl: "/table-mapping/map/godown",
  },
  {
    title: "Voucher Type",
    namesUrl: "/voucher-type/get/names",
    mappedNamesUrl: "/table-mapping/get/VoucherType",
    mapUrl: "/table-mapping/map/vouchertype",
    mapAllUrl: "/table-mapping/map/vouchertypes/all",
    removeUrl: "/table-mapping/remove/vouchertype",
  },
  {
    title: "User",
    namesUrl: `/users/company/${compId}`,
    mappedNamesUrl: "/table-mapping/get/User",
    mapUrl: "/table-mapping/map/user",
    mapAllUrl: "/table-mapping/map/users/all",
    removeUrl: "/table-mapping/remove/user",
  },
];

const MasterPermissions = () => {
  const [data, setData] = useState([]);
  const [refresh, triggerRefresh] = useState(false);

  let selectedMasterType = useRef(masterTypes[0]);
  let selectedUser = useRef(null);

  useEffect(() => {
    loadUser().then((_) => {
      triggerRefresh(!refresh);
    });
  }, []);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "name",
      headerName: "Name",
      editable: false,
      sortable: true,
      flex: 2,
    },
    {
      field: "selected",
      headerName: "Status",
      editable: false,
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Switch checked={params.row.selected ? true : false} />
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
          let values = response?.map((_data: UserProps) => ({
            id: _data?.id,
            name: _data?.name,
          }));
          setData(values);
          selectedUser.current = response[0]?.id;
        }
      }
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  const onApi = async () => {
    let selection = selectedMasterType.current;

    let baseNameUrl =
      selection.title == "User" ? getUmsBaseUrl() : getBmrmBaseUrl();
    let namesResponseTask = getAsync(`${baseNameUrl}${selection.namesUrl}`);
    let mappedResponse = await getAsync(
      `${getBmrmBaseUrl()}${selection.mappedNamesUrl}?userId=${
        selectedUser.current
      }`
    );
    let namesResponse = await namesResponseTask;

    console.log(
      `mapped: ${JSON.stringify(
        `${getBmrmBaseUrl()}${selection.mappedNamesUrl}?userId=${
          selectedUser.current
        }`
      )}`
    );
    // console.log(namesResponse);

    let entries = namesResponse.map((entry: any, index: number) => {
      let nameKey = selection.title == "User" ? "name" : "title";
      let existing = mappedResponse.some(
        (element: any) => element.entry_name === entry[nameKey]
      );
      if (existing) {
        console.log(`${entry[nameKey]}`);
      }
      return {
        id: index + 1,
        name: entry[nameKey],
        selected: existing,
      };
    });

    return entries ?? [];
  };

  const updateStatus = async () => {};

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
        />
        <DropDown
          label={"Select Master"}
          displayFieldKey={"title"}
          valueFieldKey={null}
          selectionValues={masterTypes}
          helperText={""}
          onSelection={(selection) => {
            selectedMasterType.current = selection;
            triggerRefresh(!refresh);
          }}
        />
      </Stack>
      <DataTable
        columns={columns}
        useServerPagination={false}
        refresh={refresh}
        onApi={async (page, pageSize, searchText) => {
          return await onApi();
        }}
        useSearch={false}
        onRowClick={(params) => {}}
      />
    </Box>
  );
};

export default MasterPermissions;
