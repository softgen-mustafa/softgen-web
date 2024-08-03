"use client";

import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AgingSettings = () => {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadData();
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
