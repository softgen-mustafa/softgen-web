"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { postAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { numericToString } from "@/app/services/Local/helper";
import { useRouter } from "next/navigation";
import { inspiredPalette } from "@/app/ui/theme";
import { DataTable } from "@/app/ui/data_grid";
import { GridColDef } from "@mui/x-data-grid";
import {
  ApiProps,
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";

interface Task {
  partyName: string;
  amount: number;
  currency: string;
}

interface OutstandingTaskProps {
  companyId: string | null;
}
const OutstandingTask: React.FC<OutstandingTaskProps> = ({ companyId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [durationKey] = useState(dayjs().format("YYYY-MM-DD"));
  const [hasPermission, setHasPermission] = useState(false);
  const [refresh, triggerRefresh] = useState(false);

  useEffect(() => {
    triggerRefresh(!refresh);
  }, [companyId]);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "partyName",
      headerName: "Party",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      editable: false,
      sortable: true,
      hideable: true,
      flex: 1,
    },
    {
      field: "amountstr",
      headerName: "Amount",
      editable: false,
      sortable: true,
      flex: 1,
    },
  ];

  // useEffect(() => {
  //   fetchTasks();
  //   // FeatureControl("OutstandingTask").then((permission) => {
  //   //   setHasPermission(permission);
  //   //   if (permission) {
  //   //     fetchTasks(selectedCompany, refreshTrigger);
  //   //   } else {
  //   //   }
  //   // });
  // }, []);

  // useEffect(() => {
  //   fetchTasks();
  // }, [companyId]);

  const fetchTasks = async (apiProps: ApiProps) => {
    setIsLoading(true);
    try {
      const url = `${getBmrmBaseUrl()}/bill/get/upcoming-bills?groupType=receivable&durationType=daily&durationKey=${durationKey}`;
      const requestBody = {
        page_number: apiProps.offset + 1,
        page_size: apiProps.limit,
        search_text: apiProps.searchText ?? "",
        sort_by: apiProps.sortKey ?? "",
        sort_order: apiProps.sortOrder ?? "",
      };

      const response = await postAsync(url, requestBody);
      console.log(response);
      // alert(JSON.stringify(response));P

      const entries = response.map((entry: any, index: number) => {
        return {
          id: index + 1,
          partyName: entry.name,
          amountstr: `\u20B9 ${numericToString(entry.totalAmount)}`,
          amount: entry.totalAmount,
          // currency: entry.currency ?? "₹",
        };
      });

      return entries;
    } catch (error) {
      console.log("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
      triggerRefresh(false);
    }
  };

  const renderTask = (entry: Task, index: number) => (
    <Box key={index} className="mb-4 overflow-hidden">
      <div
        className="flex flex-col pb-3"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: inspiredPalette.dark,
        }}
      >
        <Typography variant="h6" className="font-medium truncate">
          {entry.partyName}
        </Typography>
        <div className="flex items-center mt-2">
          <Typography variant="subtitle1" className="font-bold text-orange-500">
            {`${entry.currency} ${numericToString(entry.amount)}`}
          </Typography>
          <Typography variant="caption" className="ml-2">
            Pending
          </Typography>
        </div>
      </div>
    </Box>
  );

  return (
    <Box
      onClick={() => {
        localStorage.setItem("party_filter_value", durationKey);
        localStorage.setItem("party_view_type", "upcoming");
        localStorage.setItem("party_bill_type", "receivable");
        localStorage.setItem("party_filter_type", "daily");
      }}
    >
      <PeriodicTable
        chartKeyFields={[
          {
            label: "Party",
            value: "partyName",
          },
        ]}
        chartValueFields={[
          {
            label: "Amount",
            value: "amount",
          },
        ]}
        useSearch={false}
        columns={columns.map((col: any) => {
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: "text",
            pinned: false,
            rows: [],
            hideable: col.hideable,
          };
          return column;
        })}
        onApi={fetchTasks}
        reload={refresh}
      />
    </Box>
  );
};

export { OutstandingTask };
