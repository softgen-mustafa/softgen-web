"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { TextInput } from "@/app/ui/text_inputs";
import { inspiredPalette } from "@/app/ui/theme";
import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const Page = () => {
  let mode = useRef("edit");

  const [agingData, setAgingData] = useState({
    id: "",
    title: "",
    minDays: 0,
    tagName: "",
  });

  useEffect(() => {
    mode.current = localStorage.getItem("aging_mode") ?? "";
    let agingDetails = localStorage.getItem("aging_code") ?? "";
    if (mode.current == "edit") {
      setAgingData(JSON.parse(agingDetails));
    }
  }, []);

  const deleteEntry = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings/delete?agingCode=${agingData.id}`;
      let requestBody = {};
      await postAsync(url, requestBody);
    } catch {}
  };

  const update = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings/update?agingCode=${agingData.id}`;
      let requestBody = {
        title: agingData.title,
        start_value: agingData.minDays,
        tag_name: agingData.tagName,
        color_hex: "",
      };
      await postAsync(url, requestBody);
    } catch {}
  };
  const create = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings/create`;
      let requestBody = {
        title: agingData.title,
        start_value: agingData.minDays,
        tag_name: agingData.tagName,
        color_hex: "",
      };
      await postAsync(url, requestBody);
    } catch {}
  };

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      children: [],
      view: (
        <CardView>
          <TextInput
            mode="text"
            placeHolder="Enter Aging Name"
            defaultValue={agingData.title}
            onTextChange={(value: string) => {
              setAgingData({
                ...agingData,
                title: value,
              });
            }}
          />
          <br />
          <TextInput
            mode="number"
            placeHolder="Enter Minimum Days"
            defaultValue={agingData.minDays.toString()}
            onTextChange={(value: string) => {
              setAgingData({
                ...agingData,
                minDays: parseInt(value),
              });
            }}
          />
          <br />
          <TextInput
            mode="text"
            placeHolder="Enter Tag Name"
            defaultValue={agingData.tagName}
            onTextChange={(value: string) => {
              setAgingData({
                ...agingData,
                tagName: value,
              });
            }}
          />
          <br />
          <div className="flex flex-row justify-end">
            <Button
              style={{
                background: inspiredPalette.dark,
              }}
              variant="contained"
              onClick={() => {
                if (mode.current == "edit") {
                  update();
                } else if (mode.current == "create") {
                  create();
                }
              }}
            >
              Save
            </Button>
            {mode.current == "edit" && (
              <Button
                style={{
                  background: inspiredPalette.darkRed,
                }}
                variant="contained"
                onClick={() => {
                  deleteEntry();
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </CardView>
      ),
    },
  ];
  return (
    <div className="w-full" style={{}}>
      <Grid
        container
        className="bg-gray-200"
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
