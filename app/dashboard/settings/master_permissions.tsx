"use client";

import { useEffect, useRef, useState } from "react";
import {
  getAsync,
  getBmrmBaseUrl,
  getUmsBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import Cookies from "js-cookie";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { DropDown } from "@/app/ui/drop_down";
import { DataTable } from "@/app/ui/data_grid";
import { GridColDef } from "@mui/x-data-grid";
import FeatureControl from "@/app/components/featurepermission/page";

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
    removeAllUrl: "/table-mapping/remove/ledger/all",
  },
  {
    title: "Stock Item",
    namesUrl: "/stock-item/get/names",
    mappedNamesUrl: "/table-mapping/get/Item",
    mapUrl: "/table-mapping/map/item",
    mapAllUrl: "/table-mapping/map/item/all",
    removeUrl: "/table-mapping/remove/item",
    removeAllUrl: "/table-mapping/remove/item/all",
  },
  {
    title: "Stock Group",
    namesUrl: "/stock-group/get/names",
    mappedNamesUrl: "/table-mapping/get/ItemGroup",
    mapUrl: "/table-mapping/map/itemGroup",
    mapAllUrl: "/table-mapping/map/itemGroup/all",
    removeUrl: "/table-mapping/remove/itemGroup",
    removeAllUrl: "/table-mapping/remove/itemGroup/all",
  },
  {
    title: "Stock Category",
    namesUrl: "/stock-category/get/names",
    mappedNamesUrl: "/table-mapping/get/ItemCategory",
    mapUrl: "/table-mapping/map/itemCategory",
    mapAllUrl: "/table-mapping/map/itemCategory/all",
    removeUrl: "/table-mapping/remove/category",
    removeAllUrl: "/table-mapping/remove/itemCategory/all",
  },
  {
    title: "Group",
    namesUrl: "/group/get/names",
    mappedNamesUrl: "/table-mapping/get/Group",
    mapUrl: "/table-mapping/map/group",
    mapAllUrl: "/table-mapping/map/group/all",
    removeUrl: "/table-mapping/remove/group",
    removeAllUrl: "/table-mapping/remove/group/all",
  },
  {
    title: "Godown",
    namesUrl: "/stock-godown/get/names",
    mappedNamesUrl: "/table-mapping/get/Godown",
    mapUrl: "/table-mapping/map/godown",
    mapAllUrl: "/table-mapping/map/godown/all",
    removeUrl: "/table-mapping/map/godown",
    removeAllUrl: "/table-mapping/remove/godown/all",
  },
  {
    title: "Voucher Type",
    namesUrl: "/voucher-type/get/names",
    mappedNamesUrl: "/table-mapping/get/VoucherType",
    mapUrl: "/table-mapping/map/vouchertype",
    mapAllUrl: "/table-mapping/map/vouchertypes/all",
    removeUrl: "/table-mapping/remove/vouchertype",
    removeAllUrl: "/table-mapping/remove/voucherType/all",
  },
  {
    title: "User",
    namesUrl: `/users/company/${compId}`,
    mappedNamesUrl: "/table-mapping/get/User",
    mapUrl: "/table-mapping/map/user",
    mapAllUrl: "/table-mapping/map/users/all",
    removeUrl: "/table-mapping/remove/user",
    removeAllUrl: "/table-mapping/remove/user/all",
  },
];

const filterData = [
  { id: 1, title: "All" },
  { id: 2, title: "Active" },
  { id: 3, title: "Inactive" },
];

const MasterPermissions = () => {
  const [data, setData] = useState([]);
  const [refresh, triggerRefresh] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  let selectedMasterType = useRef(masterTypes[0]);
  let selectedUser = useRef(null);
  let selectedFilter = useRef(filterData[0]?.title);

  // useEffect(() => {
  //   loadUser().then((_) => {
  //     triggerRefresh(!refresh);
  //   });
  // }, []);
  useEffect(() => {
    FeatureControl("MasterConfigButton").then((permission) => {
      setHasPermission(permission);
      if (permission) {
        loadUser().then((_) => {
          triggerRefresh(!refresh);
        });
      }
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
            <Switch
              checked={params.row.selected ? true : false}
              onChange={() =>
                updateStatus(
                  selectedUser.current,
                  selectedMasterType.current.title === "User"
                    ? params.row.userId
                    : params.row.name,
                  params.row.selected
                )
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

    let isUserMasterSelected = selection.title == "User";

    let entries: any[] = [];
    namesResponse.map((entry: any, index: number) => {
      let nameKey = isUserMasterSelected ? "name" : "title";
      let compareKey = isUserMasterSelected ? "id" : "title";
      let existing = mappedResponse.find(
        (element: any) => element.entry_name === entry[compareKey].toString()
      );

      let newEntry: any | null = {
        id: index + 1,
        name: entry[nameKey],
        selected: existing !== null,
        userId: isUserMasterSelected ? entry["id"].toString() : "0",
      };

      let filterValue = selectedFilter.current;

      if (filterValue !== "All") {
        if (
          !(
            (filterValue === "Active" && !newEntry.selected) ||
            (filterValue === "Inactive" && newEntry.selected)
          )
        ) {
          entries.push(newEntry);
        }
      } else {
        entries.push(newEntry);
      }
    });

    return entries ?? [];
  };

  const updateStatus = async (
    id: any,
    name: string,
    currentStatus: boolean
  ) => {
    try {
      let selection = selectedMasterType.current;
      let url = `${getBmrmBaseUrl()}${
        currentStatus ? selection.removeUrl : selection.mapUrl
      }`;

      const requestBody = { userId: id, entryName: name };
      const response = await postAsync(url, requestBody);
      triggerRefresh(!refresh);
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  const handleMapAll = async () => {
    try {
      let selection = selectedMasterType.current;

      let baseUrl = `${getBmrmBaseUrl()}${selection.mapAllUrl}?userId=${
        selectedUser.current
      }`;
      let response = await getAsync(baseUrl);
      triggerRefresh(!refresh);
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  const handleRemoveAll = async () => {
    try {
      let selection = selectedMasterType.current;

      let baseUrl = `${getBmrmBaseUrl()}${selection.removeAllUrl}?userId=${
        selectedUser.current
      }`;
      let response = await getAsync(baseUrl);
      triggerRefresh(!refresh);
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  if (hasPermission === null) {
    return <CircularProgress />;
  }

  if (hasPermission === false) {
    return (
      <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
        Get the Premium For this Service Or Contact Admin - 7977662924
      </Typography>
    );
  }

  return (
    <Stack flexDirection={"column"} gap={1.5}>
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
      <Stack flexDirection={"row"} alignItems={"center"} gap={1.2}>
        <Box sx={{ flex: 1 }}>
          <DropDown
            label="Filter"
            displayFieldKey={"title"}
            valueFieldKey={null}
            selectionValues={filterData}
            helperText={""}
            onSelection={(_selection) => {
              selectedFilter.current = _selection.title;
              triggerRefresh(!refresh);
            }}
          />
        </Box>
        <Button variant="contained" onClick={handleMapAll} sx={{ height: 50 }}>
          <Typography textTransform={"capitalize"} letterSpacing={0.8}>
            Map All
          </Typography>
        </Button>
        <Button
          variant="contained"
          onClick={handleRemoveAll}
          sx={{ height: 50 }}
        >
          <Typography textTransform={"capitalize"} letterSpacing={0.8}>
            Remove All
          </Typography>
        </Button>
      </Stack>
      <DataTable
        columns={columns}
        useServerPagination={false}
        refresh={refresh}
        onApi={async () => {
          return await onApi();
        }}
        useSearch={false}
        onRowClick={(params) => {}}
      />
    </Stack>
  );
};

export default MasterPermissions;
