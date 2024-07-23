import { CustomerDetailsCard } from "./cards/customer_card";
import { Grid } from "@mui/material";
import { OutstandingCard } from "./cards/outstanding_card";
import { SalesReportCard } from "./cards/sales_report_card";
const DashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-light underline mb-6">Dashboard</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <OutstandingCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomerDetailsCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <SalesReportCard />
        </Grid>
        
        
      </Grid>
    </div>
  );
};
export default DashboardPage;
