"use client";
import {
  getAsync,
  getSgBizBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { DropDown } from "@/app/ui/drop_down";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ApiAutoComplete from "@/app/ui/api_auto_complete";
import { ApiMultiDropDown } from "@/app/ui/api_multi_select";
import { TextInput } from "@/app/ui/text_inputs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";
import { GridColDef } from "@mui/x-data-grid";
import { ApiDropDown } from "@/app/ui/api_drop_down";
import { convertToDate } from "@/app/services/Local/helper";
import ResponsiveCardGrid from "@/app/components/ResponsiveCardGrid";
import { useSnackbar } from "@/app/ui/snack_bar_provider";

interface OsSettings {
  pocId: string;
  pocEmail: string;
  pocMobile: string;
  pocName: string;
  Notes: string;
  nextFollowup: string;
  nextDate: string;
}

interface BillSelection {
  billId: string;
  status: number;
}

interface Bill {
  BillNumber: string;
  PartyName: string;
  ParentGroup: string;
  PendingAmount: number | null;
  OpeningAmount: number;
  BillDate: string;
  DueDate: string;
}

const Page = () => {
  const initialDetails: OsSettings = {
    pocId: "",
    pocEmail: "",
    pocMobile: "",
    pocName: "",
    Notes: "",
    nextFollowup: "",
    nextDate: "",
  };

  const snackbar = useSnackbar();

  const [key, refreshKey] = useState(0);
  const [pocDetails, setPocDetails] = useState<OsSettings>(initialDetails);
  const [refresh, triggerRefresh] = useState(false);
  const [refreshBills, triggerBillsRefresh] = useState(false);
  const [refreshUsers, triggerUsers] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  let selectedBills = useRef<any[]>([]);
  let billSelections = useRef<BillSelection[]>([]);
  let selectedParty = useRef<string>("");

  const columns: any[] = [
    {
      field: "BillNumber",
      headerName: "Bill Number",
      sortable: false,
      flex: 1,
    },

    {
      field: "PendingAmount",
      headerName: "Pending Balance",
      sortable: false,
      flex: 1,
    },
    {
      field: "OpeningAmount",
      headerName: "Opening Balance",
      sortable: false,
      flex: 1,
    },
    {
      field: "BillDate",
      headerName: "Bill Date",
      sortable: false,
      flex: 1,
    },
    {
      field: "DueDate",
      headerName: "Due Date",
      sortable: false,
      flex: 1,
    },
  ];

  useEffect(() => {
    setPocDetails(initialDetails);
    selectedBills.current = [];
    billSelections.current = [];
    triggerBillsRefresh(!refreshBills);
  }, [key]);

  const loadParties = async (searchValue: string) => {
    let values = [{ name: "None" }];
    try {
      let url = `${getSgBizBaseUrl()}/os/search/ledgers?searchKey=${searchValue}`;
      let response = await getAsync(url);
      if (response == null || response.Data == null) {
        return [];
      }
      response.Data.map((entry: any) => {
        values.push({
          name: entry.Name,
        });
      });
      triggerRefresh(!refresh);
      return values;
    } catch {
      return [];
    }
  };

  const loadBills = async (searchValue: string) => {
    try {
      let url = `${getSgBizBaseUrl()}/os/get/bills?searchText=${searchValue}&partyName=${
        selectedParty.current
      }`;
      let response = await getAsync(url);
      if (response == null || response.Data == null) {
        return [];
      }
      let values = response.Data.map((entry: any) => {
        return {
          BillNumber: entry.BillNumber,
          PartyName: entry.PartyName,
          ParentGroup: entry.ParentGroup,
          PendingAmount:
            entry.PendingAmount != null ? entry.PendingAmount.Value : 0,
          OpeningAmount: entry.OpeningAmount.Value,
          BillDate: convertToDate(entry.BillDate),
          DueDate: convertToDate(entry.DueDate),
          Status: 0,
        };
      });
      return values;
    } catch {
      triggerRefresh(false);
      return [];
    }
  };
  const loadUser = async () => {
    try {
      const encodedPartyName = encodeURIComponent(selectedParty.current);
      let url = `${getSgBizBaseUrl()}/party/get/contact-person?partyName=${encodedPartyName}`;

      let response = await getAsync(url);

      if (response && response.Data && response.Data.length > 0) {
        return response.Data;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  };

  const fetchUserDetails = async (name: string) => {
    try {
      const encodedPartyName = encodeURIComponent(selectedParty.current);
      const encodedName = encodeURIComponent(name);
      let url = `${getSgBizBaseUrl()}/party/get/contact-person?partyName=${encodedPartyName}&name=${encodedName}`;

      let response = await getAsync(url);
      console.log("fetchUserDetails response", JSON.stringify(response));

      if (response && response.Data && response.Data.length > 0) {
        const userData = response.Data[0];
        return {
          pocName: userData.Name,
          pocEmail: userData.Email,
          pocMobile: userData.PhoneNo,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error fetching user details", error);
      return null;
    }
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
      setPocDetails((prev) => ({
        ...prev,
        nextDate: newDate.format("DD-MM-YYYY"),
      }));
    }
  };
  const submitFollowup = async () => {
    if (!pocDetails.pocName || pocDetails.pocName.trim() === "") {
      snackbar.showSnackbar(
        "Please enter or select a valid contact person",
        "error"
      );
      return;
    }

    try {
      const url = `${getSgBizBaseUrl()}/os/followup/create`;
      const requestBody = {
        Followup: {
          RefPrevFollowUpId: null,
          FollowUpId: "",
          ContactPersonId: "",
          PartyName: selectedParty.current,
          Description: pocDetails.Notes,
          FollowUpBills: billSelections.current.map((bill: BillSelection) => ({
            BillId: bill.billId,
            Status: bill.status,
          })),
        },
        PointOfContact: {
          PersonId: pocDetails.pocId,
          Name: pocDetails.pocName,
          PartyName: selectedParty.current,
          Email: pocDetails.pocEmail,
          PhoneNo: pocDetails.pocMobile,
        },
      };
      const response = await postAsync(url, requestBody);
      snackbar.showSnackbar("Follow Up Created", "success");
    } catch (error) {
      snackbar.showSnackbar("Could not create follow up", "error");
    } finally {
      refreshKey((key + 1) % 2);
    }
  };

  const gridConfig: any[] = [
    {
      id: 1,
      weight: 1,
      content: (
        <div className="flex flex-col">
          <Typography className="mt-2 mb-6 text-xl">
            Create new Followup
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ApiDropDown
              label="Party"
              displayFieldKey={"name"}
              valueFieldKey={null}
              onApi={loadParties}
              helperText={""}
              onSelection={async (selection) => {
                selectedParty.current = selection.name;
                triggerBillsRefresh(!refreshBills);
                triggerUsers(!refreshUsers);
                const userData = await loadUser();

                if (userData.length > 0) {
                  const { pocName, pocEmail, pocMobile } = userData[0];
                  setPocDetails((prev) => ({
                    ...prev,
                    pocName,
                    pocEmail,
                    pocMobile,
                    Notes: "",
                    nextDate: "",
                  }));
                } else {
                  setPocDetails((prev) => ({
                    ...prev,
                    pocName: "",
                    pocEmail: "",
                    pocMobile: "",
                    Notes: "",
                    nextDate: "",
                  }));
                }
                triggerRefresh(!refresh);
              }}
            />

            <div className="mt-4" />

            <ApiMultiDropDown
              reload={refreshBills}
              label="Bills"
              displayFieldKey={"BillNumber"}
              defaultSelections={selectedBills.current}
              valueFieldKey={null}
              onApi={loadBills}
              helperText={""}
              onSelection={(selection: any[]) => {
                selectedBills.current = selection;
                triggerRefresh(!refresh);
              }}
            />
            <div className="mt-4" />
            <ApiAutoComplete
              reload={refreshUsers}
              label="Select User"
              displayFieldKey="Name"
              onApi={loadUser}
              onSelection={async (userData, newValue) => {
                if (userData) {
                  setPocDetails((prev) => ({
                    ...prev,
                    pocId: userData.PersonId ?? "",
                    pocName: userData.Name ?? "",
                    pocEmail: userData.Email ?? "",
                    pocMobile: userData.PhoneNo ?? "",
                  }));
                } else {
                  setPocDetails((prev) => ({
                    ...prev,
                    pocName: newValue,
                  }));
                }
              }}
            />

            <div className="mt-4" />
            <TextInput
              mode="text"
              placeHolder="Email"
              onTextChange={(value) => {
                setPocDetails((prev) => ({ ...prev, pocEmail: value }));
              }}
              defaultValue={pocDetails.pocEmail}
            />
            <div className="mt-4" />
            <TextInput
              mode="text"
              placeHolder="Mobile Number"
              onTextChange={(value) => {
                setPocDetails((prev) => ({
                  ...prev,
                  pocMobile: value,
                }));
              }}
              defaultValue={pocDetails.pocMobile}
            />
            <div className="mt-4" />
            <TextInput
              multiline={true}
              mode="text"
              placeHolder="Notes"
              onTextChange={(value) => {
                setPocDetails((prev) => ({ ...prev, Notes: value }));
              }}
              defaultValue={pocDetails.Notes}
            />
            <div className="mt-4" />
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
              format="DD-MM-YYYY"
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    helperText="Pick the next follow-up date"
                  />
                ),
              }}
            />
            <Button
              className="min-h-[45px] mt-8"
              variant="contained"
              onClick={submitFollowup}
            >
              Create Follow-up
            </Button>
          </LocalizationProvider>
        </div>
      ),
    },
    {
      id: 2,
      weight: 1,
      content: (
        <div className="flex flex-col">
          <Typography className="mt-2 mb-6 text-xl">Selected Bills</Typography>
          <PeriodicTable
            useSearch={false}
            reload={refresh}
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
            rows={selectedBills.current}
            checkBoxSelection={false}
            actionViews={[
              {
                label: "Status",
                renderView: (row: any[]) => {
                  let billNumber = row.find(
                    (entry: any) => entry.field === "BillNumber"
                  );
                  let statusOptions = [
                    { id: 0, name: "Pending" },
                    { id: 1, name: "Scheduled" },
                    { id: 2, name: "Completed" },
                  ];
                  return (
                    <Box sx={{ minWidth: 120, maxWidth: "100%" }}>
                      <DropDown
                        label="Status"
                        displayFieldKey="name"
                        valueFieldKey="id"
                        selectionValues={statusOptions}
                        onSelection={(selection) => {
                          let foundIndex = -1;
                          billSelections.current.map(
                            (entry: BillSelection, index: number) => {
                              if (entry.billId === billNumber) {
                                foundIndex = index;
                              }
                            }
                          );
                          if (foundIndex > -1) {
                            billSelections.current[foundIndex] = selection;
                          } else {
                            let newEntry: BillSelection = {
                              billId: billNumber.value,
                              status: selection,
                            };
                            billSelections.current.push(newEntry);
                          }
                        }}
                        helperText=""
                      />
                    </Box>
                  );
                },
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full" key={key}>
      <ResponsiveCardGrid
        screenName="followUpCreation"
        initialCards={gridConfig}
      />
    </div>
  );
};
export default Page;
