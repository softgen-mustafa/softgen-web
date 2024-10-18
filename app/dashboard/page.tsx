"use client";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Autocomplete,
  TextField,
  Icon,
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
import InventoryIcon from "@mui/icons-material/Inventory";
import { PendingActions, Receipt } from "@mui/icons-material";

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
      icon: (
        <InventoryIcon
          sx={{
            fontWeight: { xs: 50, md: 500 },
            color: "primary.light",
            borderRadius: 10,
          }}
        />
      ),
      content: (
        <GridCardView
        // title="Collection Summary"
        >
          <CollectionPrompts />
        </GridCardView>
      ),
    },
    {
      id: 8,
      weight: Weight.Low,
      label: "Collection Task",
      icon: (
        <PendingActions
          sx={{ fontWeight: { xs: 50, md: 500 }, color: "primary.light" }}
        />
      ),
      content: (
        <GridCardView
        // title="Collection Task"
        >
          <CollectionReport />
        </GridCardView>
      ),
    },
    {
      id: 1,
      weight: Weight.Medium,
      label: "Aging Overview",
      icon: (
        <InventoryIcon
          sx={{ fontWeight: { xs: 50, md: 500 }, color: "primary.light" }}
        />
      ),
      content: (
        <GridCardView
          permissionCode="OutstandingAgingOverview"
          // title="Aging Overview"
        >
          <AgingReportGraph />
        </GridCardView>
      ),
    },
    {
      id: 3,
      weight: Weight.High,
      label: "Party Overview",
      icon: (
        <InventoryIcon
          sx={{ fontWeight: { xs: 50, md: 500 }, color: "primary.light" }}
        />
      ),
      content: (
        <GridCardView
          // title="Party Overview"
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
      icon: (
        <InventoryIcon
          sx={{ fontWeight: { xs: 50, md: 500 }, color: "primary.light" }}
        />
      ),
      content: (
        <GridCardView
          permissionCode="TodaysOutstanding"
          // title="Today's Outstanding"
        >
          <OutstandingTask companyId={Cookies.get("companyId") ?? ""} />
        </GridCardView>
      ),
    },
    {
      id: 5,
      weight: Weight.High,
      label: "Ranked Parties",
      icon: (
        <InventoryIcon
          sx={{ fontWeight: { xs: 50, md: 500 }, color: "primary.light" }}
        />
      ),
      content: (
        <GridCardView
          permissionCode="TopRankedParties"
          // title="Ranked Parties"
        >
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
      icon: (
        <Receipt
          sx={{ fontWeight: { xs: 50, md: 500 }, color: "primary.light" }}
        />
      ),
      content: (
        <GridCardView
          permissionCode="UpcomingCollections"
          // title="Upcoming Collections"
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
        mb: { xs: 0.1, sm: 1 }, // Margin bottom adjusted for both mobile and desktop
        borderRadius: "24px !important",
        marginBottom: "12px !important",
        backgroundColor: "transparent",
        boxShadow: 3,
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.01)", // Slightly larger on hover
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)", // Increased shadow on hover
        },
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative",
        minHeight: { xs: 32, sm: 55 }, // Further reduced height for desktop
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon className="text-white" />}
        sx={{
          backgroundColor: "primary.light",
          "&:hover": { backgroundColor: "primary.dark" },
          padding: { xs: "0px 10px", sm: "0px 18px" }, // Adjusted padding to reduce size
          transition: "background-color 0.3s, transform 0.2s",
          minHeight: { xs: 32, sm: 45 }, // Reduced height for both mobile and desktop
          display: "flex",
          alignItems: "center",
          borderRadius: 4.5,
          outline: "none",
          boxShadow: "none",
          border: "none",
          margin: 0,
        }}
      >
        {card.icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 1,
              backgroundColor: "white",
              padding: { xs: "4px 4px", md: "6px 6px" }, // Reduced padding around the icon
              borderRadius: 100,
            }}
          >
            {card.icon}
          </Box>
        )}
        <Typography
          variant="h6"
          sx={{
            fontWeight: { xs: 450, md: 570 },
            color: "white",
            fontSize: { xs: 17.5, md: 22 }, // Reduced font size
          }}
        >
          {card.label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: "background.dark",
          padding: { xs: "2px 6px", sm: "4px 8px" },
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "0 0 4px 4px",
          transition: "background-color 0.3s, box-shadow 0.3s",
          maxHeight: "400px",
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
        padding: { xs: "10px", sm: "20px" },
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        gap: { xs: "0.5px", sm: "15px" },
        marginBottom: "-1%",
        boxSizing: "border-box",
      }}
    >
      <Autocomplete
        multiple
        limitTags={2}
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
        sx={{ mb: 2 }}
      />

      {/* Flexbox layout for cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: { xs: "center", sm: "flex-start" },
          gap: { xs: "8px", sm: "11px" },
          width: "100%",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {initialCards
          .filter((card) => visibleCards.includes(card.label))
          .map((card, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 0 100%",
                  sm: "1 1 calc(50% - 16px)",
                },
                width: { xs: "100%", sm: "calc(50% - 16px)" },
                mb: { xs: "1px", sm: "1px" },
                boxSizing: "border-box",
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
