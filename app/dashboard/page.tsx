"use client";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, useRef } from "react";
import Cookies from "js-cookie";
import GridCardView from "../ui/grid_card";
import { CollectionPrompts } from "./cards/collection_prompts";
import { CollectionReport } from "./cards/collection_report";
import { PartyReportGraph } from "./cards/party_report_graph";
import { UpcomingGraphOverview } from "./cards/upcoming_wise_graph";
import { AgingReportGraph } from "./cards/aging_report_graph";
import { OutstandingTask } from "./cards/outstanding_task_card";
import RankedPartyOutstandingCard from "./cards/ranked_party";
import { Weight } from "../ui/responsive_grid";

const DashboardPage = () => {
  let incomingBillType = "Receivable"; // populate later
  const [types, updateTypes] = useState([
    { id: 1, label: "Receivable", code: "receivable" },
    { id: 2, label: "Payable", code: "payable" },
  ]);

  let selectedType = useRef(types[incomingBillType === "Payable" ? 1 : 0]);

  const initialCards = [
    {
      id: 7,
      weight: Weight.Low,
      label: "Collection Summary",
      content: (
        <GridCardView title="Collection Summary">
          <CollectionPrompts />
        </GridCardView>
      ),
    },
    {
      id: 8,
      weight: Weight.Low,
      label: "Collection Task",
      content: (
        <GridCardView title="Collection Task">
          <CollectionReport />
        </GridCardView>
      ),
    },
    {
      id: 1,
      weight: Weight.Medium,
      label: "Aging Overview",
      content: (
        <GridCardView
          permissionCode="OutstandingAgingOverview"
          title="Aging Overview"
        >
          <AgingReportGraph />
        </GridCardView>
      ),
    },
    {
      id: 3,
      weight: Weight.High,
      label: "Party Overview",
      content: (
        <GridCardView
          title="Party Overview"
          permissionCode="PartyWiseOutstanding"
        >
          <PartyReportGraph companyId={Cookies.get("companyId") ?? ""} />
        </GridCardView>
      ),
    },
    {
      id: 4,
      weight: Weight.High,
      label: "Today's Outstanding",
      content: (
        <GridCardView
          permissionCode="TodaysOutstanding"
          title="Today's Outstanding"
        >
          <OutstandingTask companyId={Cookies.get("companyId") ?? ""} />
        </GridCardView>
      ),
    },
    {
      id: 5,
      weight: Weight.High,
      label: "Ranked Parties",
      content: (
        <GridCardView permissionCode="TopRankedParties" title="Ranked Parties">
          <RankedPartyOutstandingCard
            companyId={Cookies.get("companyId") ?? ""}
            billType={selectedType.current.code}
          />
        </GridCardView>
      ),
    },
    {
      id: 6,
      weight: Weight.High,
      label: "Upcoming Collections",
      content: (
        <GridCardView
          permissionCode="UpcomingCollections"
          title="Upcoming Collections"
        >
          <UpcomingGraphOverview />
        </GridCardView>
      ),
    },
  ];

  const [visibleCards, setVisibleCards] = useState(
    initialCards.map((card) => card.label)
  );

  const renderCard = (card: any) => (
    <div>
      <Accordion key={card.id} sx={{ mb: 2, borderRadius: 4, boxShadow: 3 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="text-white" />}
          sx={{
            backgroundColor: "primary.light",
            "&:hover": { backgroundColor: "primary.dark" },
            padding: "0 16px",
            borderRadius: 4,
            transition: "background-color 0.3s",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
            {card.content.props.title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            backgroundColor: "background.dark",
            padding: "16px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: 4,
          }}
        >
          {card.content}
        </AccordionDetails>
      </Accordion>
    </div>
  );

  return (
    <Box
      className="content"
      sx={{
        padding: "20px",
        paddingTop: "80px",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginBottom: "10%",
      }}
    >
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={initialCards.map((card) => card.label)}
        value={visibleCards}
        onChange={(event, newValue) => {
          setVisibleCards(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Select Components"
            placeholder="Choose Components"
          />
        )}
        sx={{ mb: 3 }}
      />

      {initialCards
        .filter((card) => visibleCards.includes(card.label))
        .map(renderCard)}
    </Box>
  );
};

export default DashboardPage;
