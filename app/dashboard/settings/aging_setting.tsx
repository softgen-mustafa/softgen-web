"use client";

import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FeatureControl from "@/app/components/featurepermission/page";

const AgingSettings = () => {
  const [data, setData] = useState([]);
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);


  // useEffect(() => {
  //   loadData();
  // }, []);


  useEffect(() => {
    FeatureControl("MasterConfigButton").then((permission) => {
      setHasPermission(permission);
      if (permission) {
        loadData();
      }
    });
  }, []);

  const loadData = async () => {
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
      setData(entries);
    } catch {
      alert("could not load aging settings");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      editable: false,
      sortable: true,
     flex:1
    },
    {
      field: "minDays",
      headerName: "Minimum Days",
      editable: false,
      sortable: true,
      flex:1,
    },
    {
      field: "tagName",
      headerName: "Tag Name",
      editable: false,
      sortable: true,
      flex:1
    },
  ];

  const handleAddClick = () => {
    localStorage.setItem("aging_mode", "add");
    localStorage.removeItem("aging_code");
    router.push("/dashboard/settings/aging-edit");
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
    <div>
       <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          marginBottom: '10px' 
        }}
      >
        <Typography variant="button" sx={{ marginRight: '10px' }}>
          Create New Aging
        </Typography>
        <IconButton 
          onClick={handleAddClick} 
          color="primary" 
          aria-label="add aging setting"
        >
          <AddIcon />
        </IconButton>
      </Box>
      <DataGrid
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
      />
    </div>
  );
};

export { AgingSettings };
