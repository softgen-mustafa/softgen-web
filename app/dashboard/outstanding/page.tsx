"use client";

import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { ListView } from "@/app/ui/list_view";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Container,
  Typography,
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DropDown } from "@/app/ui/drop_down";
import { League_Spartan } from "next/font/google";
import { PieChart } from "@mui/x-charts";
import { endianness } from "os";
import { inspiredPalette } from "@/app/ui/theme";
import { setFips } from "crypto";

interface CustomCardProps {
  data: CardData;
  onPress: (entry: CardData) => void;
}
const CustomCard: React.FC<CustomCardProps> = ({ data, onPress }) => {
  return (
    <Card
      sx={{ minWidth: 200, margin: "0 8px" }}
      onClick={(event) => {
        onPress(data);
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {data.title}
        </Typography>
        <Typography variant="body2">{data.content}</Typography>
      </CardContent>
    </Card>
  );
};

interface CardData {
  title: string;
  content: string;
  code: string;
}

const Home = ({ billType }: { billType: string }) => {
  const [data, setData] = useState<CardData[]>([]);
  const router = useRouter();
  useEffect(() => {
    loadData();
  }, [billType]);

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/bill/get/aging-overview?groupType=${billType}`;
      let response = await getAsync(url);
      let entries = response.map((entry: any, index: number) => {
        let newEntry: CardData = {
          title: entry.title,
          code: entry.code,
          content: `${entry.amount}`,
        };
        return newEntry;
      });
      let agingDetails = entries.sort((a: any, b: any) => {
        const name1 = a.title.toLowerCase();
        const name2 = b.title.toLowerCase();

        if (name1 < name2) {
          return -1;
        }
        if (name1 > name2) {
          return 1;
        }
        return 0;
      });
      setData(agingDetails);
    } catch {
      alert("Could not load data");
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", overflowX: "auto", padding: "16px 0" }}>
        {data.map((card, index) => (
          <CustomCard
            key={index}
            data={card}
            onPress={(data) => {
              localStorage.setItem("party_filter_value", data.code);
              localStorage.setItem("party_view_type", "aging");
              localStorage.setItem("party_bill_type", billType);
              router.push("/dashboard/outstanding/party-search");
            }}
          />
        ))}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <PieChart
          width={400}
          height={500}
          slotProps={{
            legend: {
              position: {
                horizontal: "left",
                vertical: "bottom",
              },
            },
          }}
          series={[
            {
              data: data.map((entry: CardData) => {
                return {
                  label: entry.title,
                  value: parseFloat(entry.content),
                };
              }),
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              cx: 150,
              cy: 150,
            },
          ]}
        />
      </Box>
    </Container>
  );
};

const Page = () => {
  const router = useRouter();

  let incomingBillType = "Receivable"; // populate later
  const [types, updateTypes] = useState([
    { id: 1, label: "Receivable", code: "receivable" },
    { id: 2, label: "Payable", code: "payable" },
  ]);

  const [refresh, triggerRefresh] = useState(false);
  const [filters, updateFilters] = useState([
    { id: 1, label: "Daily", value: "daily", isSelected: true },
    { id: 2, label: "Weekly", value: "weekly", isSelected: false },
    { id: 3, label: "Montly", value: "monthly", isSelected: false },
    { id: 4, label: "Quarterly", value: "quarterly", isSelected: false },
    { id: 5, label: "Yearly", value: "yearly", isSelected: false },
  ]);

  let selectedType = useRef(types[incomingBillType === "Payable" ? 1 : 0]);
  let selectedFilter = useRef(filters[0]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    loadUpcoming();
  }, []);

  const loadUpcoming = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/bill/get/upcoming-overview?groupType=${
        selectedType.current.code
      }&durationType=${selectedFilter.current.value}`;
      let response = await getAsync(url);
      let entries = response.map((entry: any) => {
        return {
          id: entry.id,
          name: entry.title,
          amount: entry.amount,
          billCount: entry.billCount,
          currency: entry.currency ?? "₹",
        };
      });
      setRows(entries);
    } catch {
      alert("Could not load upcoming outstanding");
    }
  };

  const columns: GridColDef<any[number]>[] = [
    {
      field: "name",
      headerName: "Duration Name",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
      valueGetter: (value, row) => `${row.currency || ""} ${row.amount || "0"}`,
    },
  ];

  return (
    <div>
      <h3>Outstanding Dashboard</h3>

      <Button variant="contained" onClick={(event) => {
          localStorage.setItem("party_filter_value", "");
          localStorage.setItem("party_view_type", "all_parties");
          localStorage.setItem("party_bill_type", selectedType.current.code);
          localStorage.setItem("party_filter_type", "");
          router.push("/dashboard/outstanding/party-search");

      }}>View All Parties</Button>
      <br/>

      <DropDown
        label="Select Type"
        displayFieldKey={"label"}
        valueFieldKey={null}
        selectionValues={types}
        helperText={"Select Outstanding Type"}
        onSelection={(selection) => {
          selectedType.current = selection;
          loadUpcoming();
        }}
      />

      <Home billType={selectedType.current.code} />
      <Container>
        <Box sx={{ display: "flex", overflowX: "auto", padding: "16px 0" }}>
          {filters.map((card, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 200,
                margin: "0 8px",
                background: card.isSelected ? inspiredPalette.Pumpkin : "white",
                color: card.isSelected ? "white" : "black",
              }}
              onClick={(event) => {
                let values: any[] = filters;
                values = values.map((entry: any) => {
                  let isSelected = card.value === entry.value;
                  entry.isSelected = isSelected;
                  return entry;
                });
                updateFilters(values);
                selectedFilter.current = card;
                loadUpcoming();
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {card.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <DataGrid
        columns={columns}
        rows={rows}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        onRowClick={(params) => {
          localStorage.setItem("party_filter_value", params.row.id);
          localStorage.setItem("party_view_type", "upcoming");
          localStorage.setItem("party_bill_type", selectedType.current.code);
          localStorage.setItem("party_filter_type", selectedFilter.current.value);
          router.push("/dashboard/outstanding/party-search");
        }}
        pageSizeOptions={[5, 10, 25, 50, 75, 100]}
        disableRowSelectionOnClick
        onPaginationModelChange={(value) => {
          alert(`page model:  ${JSON.stringify(value)}`);
        }}
      />
    </div>
  );
};

export default Page;
