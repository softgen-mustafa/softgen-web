"use client";
import {
  getAsync,
  getBmrmBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { DropDown } from "@/app/ui/drop_down";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import {
  ChevronLeftRounded,
  LabelOffRounded,
  Refresh,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import { numericToString } from "@/app/services/Local/helper";
import {
  PeriodicTable,
  TableColumn,
  ApiProps,
  TableSearchKey,
} from "@/app/ui/periodic_table/period_table";

const Page = () => {
  const router = useRouter();

  const [voucherTypes, setVoucherTypes] = useState([]);
  const [selectedVoucherType, setVoucherType] = useState("Sales");

  useEffect(() => {
    loadVoucherTypes();
  }, []);

  const { showSnackbar } = useSnackbar();
  const loadVoucherTypes = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/meta-voucher/get/voucher-types`;
      let response = await getAsync(url);
      setVoucherTypes(
        response.map((entry: any) => {
          return {
            id: entry.name,
            name: entry.name,
          };
        })
      );
    } catch {
      showSnackbar("Could not load voucher types");
    }
  };

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      className: "",
      view: (
        <CardView
          title={"Overview"}
          permissionCode="CustomerPartySearch"
          className="h-fit"
          actions={[
            <IconButton
              key={1}
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeftRounded />
              <Typography>Go Back</Typography>
            </IconButton>,
          ]}
        >
          <DropDown
            label="Select Type"
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={voucherTypes}
            helperText={"Select Outstanding Type"}
            onSelection={(selection) => {
              setVoucherType(selection.name);
            }}
            useSearch={true}
          />
        </CardView>
      ),
      children: [],
    },
  ];

  return (
    <div className="w-full" style={{}}>
      <Grid
        container
        sx={{
          flexGrow: 1,
          height: "100vh",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>
    </div>
  );
};
export default Page;
