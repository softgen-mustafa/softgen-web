"use client";
import {
  getAsync,
  getSgBizBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { DropDown } from "@/app/ui/drop_down";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { Box, Grid } from "@mui/material";
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

interface OsSettings {
  pocEmail: string;
  pocMobile: string;
  pocName: string;
  Notes: string;
  nextFollowup: string;
  nextDate: string;
}

const Page = () => {
  const initialDetails: OsSettings = {
    pocEmail: "",
    pocMobile: "",
    pocName: "",
    Notes: "",
    nextFollowup: "",
    nextDate: "",
  };

  interface Bill {
    BillNumber: string;
    PartyName: string;
    ParentGroup: string;
    PendingAmount: number | null;
    OpeningAmount: number;
    BillDate: string;
    DueDate: string;
  }
  const [pocDetails, setPocDetails] = useState<OsSettings>(initialDetails);
  const [data, setData] = useState([]);
  const [refresh, triggerRefresh] = useState(false);
  const [refreshBills, triggerBillsRefresh] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  let selectedBills = useRef<Bill[]>([]);
  let selectedUser = useRef<string[]>([]);
  let selectedParty = useRef<string>("");

  const columns: GridColDef[] = [
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
    loadParties("");
    loadBills("");
    loadUser();
  }, []);

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
          PendingAmount: entry.PendingAmount,
          OpeningAmount: entry.OpeningAmount.Value,
          BillDate: convertToDate(entry.BillDate),
          DueDate: convertToDate(entry.DueDate),
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
      console.log("loadUser response", JSON.stringify(response));

      if (response && response.Data && response.Data.length > 0) {
        return response.Data.map((entry: any) => ({
          pocName: entry.Name,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.log("Error loading user data", error);
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

  // const loadUser = async () => {
  //   try {
  //     const encodedPartyName = encodeURIComponent(selectedParty.current);
  //     let url = `${getSgBizBaseUrl()}/party/get/contact-person?partyName=${encodedPartyName}`;

  //     let response = await getAsync(url);
  //     console.log("loadUser response", JSON.stringify(response));

  //     if (response && response.Data.length > 0) {
  //       const userData = response.Data[0];
  //       setPocDetails((prev) => ({
  //         ...prev,
  //         pocName: userData.Name,
  //         pocEmail: userData.Email,
  //         pocMobile: userData.PhoneNo,
  //       }));

  //       return response.Data.map((entry: any) => ({
  //         pocName: entry.Name,
  //         pocEmail: entry.Email,
  //         pocMobile: entry.PhoneNo,
  //       }));
  //     } else {
  //       return [];
  //     }
  //   } catch (error) {
  //     console.log("Error loading user data", error);
  //     return [];
  //   }
  // };

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
    console.log("Current pocDetails:", pocDetails);

    if (!pocDetails.pocName || pocDetails.pocName.trim() === "") {
      alert("Please select a valid user.");
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
          FollowUpBills: selectedBills.current.map((bill: Bill) => ({
            BillId: bill.BillNumber,
            Status: 0,
          })),
        },
        PointOfContact: {
          PersonId: "",
          Name: pocDetails.pocName,
          PartyName: selectedParty.current,
          Email: pocDetails.pocEmail,
          PhoneNo: pocDetails.pocMobile,
        },
      };
      console.log("Request body:", JSON.stringify(requestBody));
      const response = await postAsync(url, requestBody);
      console.log("Response:", response);
      alert("Follow-up created successfully");
    } catch (error) {
      console.error("Error creating follow-up:", error);
      alert("Failed to create follow-up");
    }
  };
  // const submitFollowup = async () => {
  //   console.log("Current pocDetails:", pocDetails); // Add this line

  //   // Validation check
  //   if (!pocDetails.pocName || pocDetails.pocName.trim() === "") {
  //     alert("Please enter a valid name for the point of contact.");
  //     return;
  //   }

  //   try {
  //     const url = `${getSgBizBaseUrl()}/os/followup/create`;
  //     const requestBody = {
  //       Followup: {
  //         RefPrevFollowUpId: null,
  //         FollowUpId: "",
  //         ContactPersonId: "",
  //         PartyName: selectedParty.current,
  //         Description: pocDetails.Notes,
  //         FollowUpBills: selectedBills.current.map((bill: Bill) => ({
  //           BillId: bill.BillNumber,
  //           Status: 0,
  //         })),
  //       },
  //       PointOfContact: {
  //         PersonId: "",
  //         Name: pocDetails.pocName,
  //         PartyName: selectedParty.current,
  //         Email: pocDetails.pocEmail,
  //         PhoneNo: pocDetails.pocMobile,
  //       },
  //     };
  //     console.log("Request body:", JSON.stringify(requestBody)); // Add this line
  //     const response = await postAsync(url, requestBody);
  //     console.log("Response:", response);
  //     alert("Follow-up created successfully");
  //   } catch (error) {
  //     console.error("Error creating follow-up:", error);
  //     alert("Failed to create follow-up");
  //   }
  // };
  // const submitFollowup = async () => {
  //   try {
  //     const url = `${getSgBizBaseUrl()}/os/followup/create`;
  //     const requestBody = {
  //       Followup: {
  //         RefPrevFollowUpId: null,
  //         FollowUpId: "",
  //         ContactPersonId: "",
  //         PartyName: selectedParty.current,
  //         Description: pocDetails.Notes,
  //         FollowUpBills: selectedBills.current.map((bill: Bill) => ({
  //           BillId: bill.BillNumber,
  //           Status: 0,
  //         })),
  //       },
  //       PointOfContact: {
  //         PersonId: "",
  //         Name :"Aquib2",
  //         // Name: pocDetails.pocName,
  //         PartyName: selectedParty.current,
  //         Email: pocDetails.pocEmail,
  //         PhoneNo: pocDetails.pocMobile,
  //       },
  //     };
  //     console.log("POC Name:", pocDetails.pocName);
  //     alert(JSON.stringify(requestBody));
  //     console.log(JSON.stringify(requestBody));
  //     const response = await postAsync(url, requestBody);
  //     console.log(response);
  //   } catch (error) {
  //     console.error("Error creating follow-up:", error);
  //     alert("Failed to create follow-up");
  //   }
  // };

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      className: "",
      view: (
        <CardView
          title={"Overview"}
          permissionCode="CustomerPartySearch"
          className="h-fit"
        >
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
            {/* <ApiDropDown
              label="Party"
              displayFieldKey={"name"}
              valueFieldKey={null}
              onApi={loadParties}
              helperText={""}
              onSelection={async (selection) => {
                selectedParty.current = selection.name;
                triggerBillsRefresh(!refreshBills);
                const userData = await loadUser();
                // If user data is available, update the state with contact info
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
                  // Reset the contact details if no user is found
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
            /> */}

            <br></br>
            <ApiMultiDropDown
              reload={refreshBills}
              label="Bills"
              displayFieldKey={"BillNumber"}
              defaultSelections={selectedBills.current}
              valueFieldKey={null}
              onApi={loadBills}
              helperText={""}
              onSelection={(selection) => {
                selectedBills.current = selection;
                triggerRefresh(!refresh);
              }}
            />
            <br></br>
            <ApiAutoComplete
              label="Select User"
              displayFieldKey="pocName"
              onApi={loadUser}
              onSelection={async (userData) => {
                const userDetails = await fetchUserDetails(userData.pocName);
                if (userDetails) {
                  setPocDetails((prev) => ({
                    ...prev,
                    pocName: userDetails.pocName,
                    pocEmail: userDetails.pocEmail,
                    pocMobile: userDetails.pocMobile,
                  }));
                  console.log("Selected user details:", userDetails);
                } else {
                  setPocDetails((prev) => ({
                    ...prev,
                    pocName: userData.pocName,
                    pocEmail: "",
                    pocMobile: "",
                  }));
                  console.log("No details found for selected user");
                }
                selectedUser.current = userData.pocName;
                triggerRefresh(!refresh);
              }}
            />
            {/* <ApiAutoComplete
              label="Select User"
              displayFieldKey="pocName"
              onApi={loadUser}
              onSelection={(userData) => {
                setPocDetails((prev) => ({
                  ...prev,
                  pocName: userData.pocName,
                  pocEmail: userData.pocEmail,
                  pocMobile: userData.pocMobile,
                }));
                selectedUser.current = userData.pocName;
                triggerRefresh(!refresh);
              }}
            /> */}
            {/* <ApiAutoComplete
              label="Select User"
              displayFieldKey={"pocName"}
              onApi={loadUser}
              onSelection={(userData) => {
                setPocDetails((prev) => ({
                  ...prev,
                  pocName: userData.pocName,
                  pocEmail: userData.pocEmail,
                  pocMobile: userData.pocMobile,
                }));
                selectedUser.current = userData.pocName;
                triggerRefresh(!refresh);
              }}
            /> */}

            <br></br>
            <TextInput
              mode="text"
              placeHolder="Email"
              onTextChange={(value) => {
                setPocDetails((prev) => ({ ...prev, pocEmail: value }));
              }}
              defaultValue={pocDetails.pocEmail}
            />
            <br></br>
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
            <br></br>
            <TextInput
              multiline={true}
              mode="text"
              placeHolder="Notes"
              onTextChange={(value) => {
                setPocDetails((prev) => ({ ...prev, Notes: value }));
              }}
              defaultValue={pocDetails.Notes}
            />
            <br></br>
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
          </LocalizationProvider>
          <button onClick={submitFollowup}>Create Follow-up</button>
        </CardView>
      ),
      children: [],
    },
    {
      type: "item",
      className: "",
      view: (
        <CardView title="Status Table">
          <PeriodicTable
            useSearch={true}
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
            // onApi={loadBills}
            checkBoxSelection={true}
            renderCheckedView={(values: any) => {
              return (
                <div>
                  {values.map((entry: any, index: number) => {
                    return <div key={index}>{entry[0].value}</div>;
                  })}
                </div>
              );
            }}
            actionViews={[
              {
                label: "Status",
                renderView: (row: any[]) => {
                  let BillNumber = row.find(
                    (entry: any) => entry.field === "BillNumber"
                  );
                  let selected = row.find(
                    (entry: any) => entry.field === "selected"
                  );
                  let statusOptions = [
                    { id: 0, name: "Pending" },
                    { id: 1, name: "Scheduled" },
                    { id: 2, name: "Completed" },
                  ];
                  return (
                    <Box sx={{ minWidth: 120, maxWidth: "100%" }}>
                      {" "}
                      <DropDown
                        label="Status"
                        displayFieldKey="name"
                        valueFieldKey="id"
                        selectionValues={statusOptions}
                        onSelection={(selection) => {
                          console.log(
                            `Status for BillNumber ${BillNumber.value} changed to ${selection.id}`
                          );
                        }}
                        helperText="Select status"
                      />
                    </Box>
                  );
                },
              },
            ]}
          />
        </CardView>
      ),
      children: [],
    },
  ];
  return (
    <Box>
      <Grid
        container
        sx={{
          flexGrow: 1,
          height: "100vh",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>
    </Box>
  );
};
export default Page;
