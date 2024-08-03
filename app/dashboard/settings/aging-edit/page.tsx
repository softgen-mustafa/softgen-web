"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { TextInput } from "@/app/ui/text_inputs";
import { inspiredPalette } from "@/app/ui/theme";
import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [mode, setMode] = useState("add");
  const [agingData, setAgingData] = useState({
    id: "",
    title: "",
    minDays: 0,
    tagName: "",
  });

  useEffect(() => {
    const storedMode = localStorage.getItem("aging_mode");
    setMode(storedMode === "edit" ? "edit" : "add");

    if (storedMode === "edit") {
      const agingDetails = localStorage.getItem("aging_code");
      if (agingDetails) {
        setAgingData(JSON.parse(agingDetails));
      }
    }
  }, []);

  const deleteEntry = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings/delete?agingCode=${
        agingData.id
      }`;
      await postAsync(url, {});
      router.push("/dashboard/settings");
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const update = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings/update?agingCode=${
        agingData.id
      }`;
      let requestBody = {
        title: agingData.title,
        start_value: agingData.minDays,
        tag_name: agingData.tagName,
        color_hex: "",
      };
      await postAsync(url, requestBody);
      router.push("/dashboard/settings");
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
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
      router.push("/dashboard/settings");
    } catch (error) {
      console.error("Failed to create entry:", error);
    }
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
              setAgingData({ ...agingData, title: value });
            }}
          />
          <br />
          <TextInput
            mode="number"
            placeHolder="Enter Minimum Days"
            defaultValue={agingData.minDays.toString()}
            onTextChange={(value: string) => {
              setAgingData({ ...agingData, minDays: parseInt(value) });
            }}
          />
          <br />
          <TextInput
            mode="text"
            placeHolder="Enter Tag Name"
            defaultValue={agingData.tagName}
            onTextChange={(value: string) => {
              setAgingData({ ...agingData, tagName: value });
            }}
          />
          <br />
          <div className="flex flex-row justify-end">
            {mode === "edit" ? (
              <>
                <Button
                  style={{ background: inspiredPalette.dark }}
                  variant="contained"
                  onClick={update}
                >
                  Update
                </Button>
                <Button
                  style={{ background: inspiredPalette.darkRed }}
                  variant="contained"
                  onClick={deleteEntry}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button
                style={{ background: inspiredPalette.dark }}
                variant="contained"
                onClick={create}
              >
                Create
              </Button>
            )}
          </div>
        </CardView>
      ),
    },
  ];

  return (
    <div className="w-full">
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
