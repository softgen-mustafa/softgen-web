"use client";

import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";
import {
  ApiProps,
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";

const AgingSettings = () => {
  const [data, setData] = useState([]);
  const router = useRouter();
  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // useEffect(() => {
  //   loadData();
  // }, []);

  // useEffect(() => {
  //   // FeatureControl("MasterConfigButton").then((permission) => {
  //   //   setHasPermission(permission);
  //   //   if (permission) {
  //   loadData();
  //   //   }
  //   // });
  // }, []);

  const loadData = async (apiProps: ApiProps) => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings`;
      let response = await getAsync(url);
      let entries = response.map((entry: any) => {
        return {
          id: entry.agingCode,
          title: entry.title,
          minDays: entry.start_value,
          tagName: entry.tag_name,
        };
      });
      // alert(JSON.stringify(entries));
      setData(entries);
      return entries;
    } catch {
      alert("could not load aging settings");
      return [];
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      editable: false,
      sortable: false,
      hideable: true,
      flex: 1,
      minWidth: 250,
    },
    {
      field: "title",
      headerName: "Title",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 250,
    },
    {
      field: "minDays",
      headerName: "Minimum Days",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "tagName",
      headerName: "Tag Name",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
  ];

  const handleAddClick = () => {
    localStorage.setItem("aging_mode", "add");
    localStorage.removeItem("aging_code");
    router.push("/dashboard/settings/aging-edit");
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

  const handleRowClick = (rowData: any) => {
    // alert(JSON.stringify(rowData));
    localStorage.setItem("aging_mode", "edit");
    localStorage.setItem("aging_code", JSON.stringify(rowData));
    router.push("/dashboard/settings/aging-edit");
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        {" "}
        <Button
          onClick={handleAddClick}
          aria-label="add aging setting"
          sx={{
            padding: { xs: "8px", sm: "10px", md: "8px" }, // Adjusted padding for desktop
            height: { xs: 40, sm: 50, md: 45 }, // Reduced height for desktop
            borderRadius: "12px",
            backgroundColor: "primary.main", // Green background color
            color: "white", // White text color
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            width: { xs: "100%", sm: "auto" }, // Full width on small screens, auto on larger
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center both text and icon
            "&:hover": {
              backgroundColor: "primary.dark", // Darker green on hover
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Typography
            variant="button"
            textTransform={"capitalize"}
            letterSpacing={0.8}
            fontSize={{ xs: "0.8rem", sm: "1rem", md: "0.9rem" }} // Slightly smaller text size for desktop
          >
            Create New Aging
          </Typography>
          <IconButton
            color="inherit"
            sx={{
              padding: { xs: "4px", sm: "6px", md: "4px" }, // Reduced padding for desktop
              marginLeft: 0, // Removed margin left
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Button>
      </Box>
      {/* <DataGrid
        columns={columns}
        rows={data}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        onRowClick={(params) => {
          localStorage.setItem("aging_mode", "edit");
          localStorage.setItem("aging_code", JSON.stringify(params.row));
          router.push("/dashboard/settings/aging-edit");
        }}
        pageSizeOptions={[5, 10, 25, 50, 75, 100]}
        onPaginationModelChange={(value) => {}}
      /> */}
      <PeriodicTable
        useSearch={false}
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
        onApi={loadData}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export { AgingSettings };
