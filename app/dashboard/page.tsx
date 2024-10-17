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
    initialCards.map((card: any) => card.label)
  );

  const renderCard = (card: any) => (
    <Accordion
      key={card.id}
      sx={{
        mb: { xs: 2, sm: 1 }, // Margin bottom adjusted for both mobile and desktop
        borderRadius: "24px !important",
        marginBottom: "12px !important",
        backgroundColor: "transparent",
        boxShadow: 3,
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.01)", // Slightly larger on hover
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)", // Increased shadow on hover
        },
        flexDirection: "column", // Column layout for both views
        alignItems: "flex-start", // Align to start for both views
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon className="text-white" />}
        sx={{
          backgroundColor: "primary.light",
          "&:hover": { backgroundColor: "primary.dark" }, // Background color on hover
          padding: { xs: "6px 12px", sm: "1px 20px" }, // Increased padding for desktop
          transition: "background-color 0.3s, transform 0.2s",
          // minHeight: { xs: 40, sm: 16 }, // Adjust height for mobile and desktop
          display: "flex",
          alignItems: "center",
          borderRadius: 6,
          outline: "none", // Remove outline
          boxShadow: "none",
          border: "none",
          margin: 0,
          "&.Mui-expanded": {
            borderRadius: 5,
            padding: { xs: "6px 10px", sm: "8px 18px" }, // Adjust padding when expanded for both views
          },
          "& .MuiCollapse-root": {
            gap: { xs: "5px", sm: "16px" },
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
          {card.content.props.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: "background.dark",
          padding: { xs: "4px 8px", sm: "16px 24px" }, // Increased padding for desktop
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "0 0 4px 4px", // Border radius for the bottom corners
          transition: "background-color 0.3s, box-shadow 0.3s",
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        {card.content}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box
  className="content"
  sx={{
    padding: { xs: "10px", sm: "20px" }, // Padding for both mobile and desktop
    backgroundColor: "background.default",
    display: "flex",
    flexDirection: "column",
    gap: { xs: "0.5px", sm: "16px" }, // Adjust gap for mobile
    marginBottom: "10%", // Margin-bottom for mobile view
    boxSizing: "border-box", // Ensure no overflow due to padding
  }}
>
  <Autocomplete
    multiple
    disableCloseOnSelect
    options={initialCards.map((card) => card.label)}
    value={visibleCards}
    onChange={(event, newValue: any) => {
      setVisibleCards(newValue);
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        label="Select Components"
        placeholder="Choose Components"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "18px",
          },
        }}
      />
    )}
    sx={{ mb: 3 }}
  />

  {/* Flexbox layout for cards */}
  <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    flexDirection: { xs: "column", sm: "row" }, // Column for mobile, row for desktop
    justifyContent: { xs: "center", sm: "flex-start" }, // Center items on mobile, align left on desktop
    gap: { xs: "8px", sm: "9px" }, // Maintain gap between cards
    width: "100%", // Ensure container takes full width
    boxSizing: "border-box", // Ensure padding is considered in width
  }}
>
  {initialCards
    .filter((card) => visibleCards.includes(card.label))
    .map((card, index) => (
      <Box
        key={index}
        sx={{
          flex: {
            xs: "1 0 100%", // Full width for mobile view
            sm: "1 1 calc(50% - 16px)", // Half width for desktop view
          },
          width: { xs: "100%", sm: "calc(50% - 16px)" }, // Ensure full width for mobile, half width for desktop
          mb: { xs: "8px", sm: "0px" }, // Add margin bottom for mobile spacing
          boxSizing: "border-box",
          overflow: "revert", // Let content naturally overflow (for transitions)
        }}
      >
        {renderCard(card)}
      </Box>
    ))}
</Box>


</Box>
  );
};

export default DashboardPage;
