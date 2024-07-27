"use client";

import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      minWidth: 100,
      maxWidth: 400,
    },
    {
      field: "minDays",
      headerName: "Minimum Days",
      editable: false,
      sortable: true,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      field: "tagName",
      headerName: "Tag Name",
      editable: false,
      sortable: true,
      minWidth: 100,
      maxWidth: 400,
    },
  ];

  return (
    <div>
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
