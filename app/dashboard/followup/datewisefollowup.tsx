"use client";
import { DateRangePicker } from "@/app/ui/date_ui";
import React, { useRef, useState } from "react";
import {
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";
import { ApiProps } from "@/app/ui/periodic_table/period_table";
import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
import { convertToDate } from "@/app/services/Local/helper";

const DateWiseFollowup = () => {
  const [refresh, triggerRefresh] = useState(false);

  let dateRange = useRef({
    startDate: "01-01-2024",
    endDate: "01-01-2025",
  });

  const columns: any[] = [
    {
      field: "CreationDate",
      headerName: "Creation Date",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "NextFollowUpDate",
      headerName: "Next FollowUp",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "PartyName",
      headerName: "Party",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "PersonInCharge",
      headerName: "Attended By",
      minWidth: 300,
      editable: false,
      sortable: false,
      type: "text",
      hideable: false,
      flex: 1,
    },
    {
      field: "PocName",
      headerName: "Contact Person",
      editable: false,
      sortable: false,
      hideable: false,
      type: "text",
      flex: 1,
    },
    {
      field: "PocEmail",
      headerName: "Contact Email",
      editable: false,
      sortable: false,
      hideable: false,
      type: "text",
      flex: 1,
    },
    {
      field: "PocMobile",
      headerName: "Contact Mobile",
      editable: false,
      sortable: false,
      hideable: false,
      type: "text",
      flex: 1,
    },
    {
      field: "Description",
      headerName: "Description",
      editable: false,
      sortable: false,
      hideable: false,
      type: "text",
      flex: 1,
    },
    {
      field: "TotalCount",
      headerName: "Total Bills",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "PendingCount",
      headerName: "Pending",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "ScheduledCount",
      headerName: "Scheduled",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "CompleteCount",
      headerName: "Completed",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "UpdationDate",
      headerName: "Last Updated",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
  ];

  const onApi = async (props: ApiProps) => {
    try {
      let url = `${getSgBizBaseUrl()}/os/followup/get/day-wise`;
      let requestBody = {
        StartDateStr: dateRange.current.startDate,
        EndDateStr: dateRange.current.endDate,
        Filter: {
          Batch: {
            Apply: true,
            Limit: props.limit,
            Offset: props.offset,
          },
        },
      };
      let response = await postAsync(url, requestBody);
      let values = response.Data.map((entry: any) => {
        return {
          ...entry,
          CreationDate: convertToDate(entry.CreationDate),
          UpdationDate: convertToDate(entry.UpdationDate),
          NextFollowUpDate:
            entry.NextFollowUpDate === null
              ? ""
              : convertToDate(entry.NextFollowUpDate),
        };
      });
      return values;
    } catch {
      return [];
    }
  };

  const renderFilterView = () => {
    return (
      <div>
        <DateRangePicker
          defaultStart={dateRange.current.startDate}
          defaultEnd={dateRange.current.endDate}
          onDateChange={(fromDate, toDate) => {
            dateRange.current = {
              startDate: fromDate ?? "",
              endDate: toDate ?? "",
            };
            triggerRefresh(!refresh);
          }}
        />
      </div>
    );
  };

  return (
    <PeriodicTable
      useSearch={false}
      reload={refresh}
      RenderAdditionalView={renderFilterView()}
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
  );
};

export { DateWiseFollowup };
