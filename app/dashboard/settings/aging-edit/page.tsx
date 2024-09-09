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

  const [errors, setErrors] = useState({
    title: "",
    minDays: "",
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

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", minDays: "" };

    if (!agingData.title.trim()) {
      newErrors.title = "Aging Name cannot be empty";
      isValid = false;
    }

    if (!agingData.minDays || agingData.minDays <= 0) {
      newErrors.minDays = "Minimum Days Cannot be zero or empty";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const deleteEntry = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings/delete?agingCode=${
        agingData.id
      }`;
      alert(url);
      await postAsync(url, {});
      router.push("/dashboard/settings");
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const update = async () => {
    if (!validateForm()) return;

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
    if (!validateForm()) return;

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
              setErrors({ ...errors, title: "" });
            }}
          />
          {errors.title && (
            <Typography color="error">{errors.title}</Typography>
          )}

          <br />
          <TextInput
            mode="number"
            placeHolder="Enter Minimum Days"
            defaultValue={agingData.minDays.toString()}
            onTextChange={(value: string) => {
              setAgingData({ ...agingData, minDays: parseInt(value) });
              setErrors({ ...errors, minDays: "" });
            }}
          />
          {errors.minDays && (
            <Typography color="error">{errors.minDays}</Typography>
          )}

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
          <div className="flex flex-row gap-2 justify-end">
            {mode === "edit" ? (
              <>
                <Button
                  style={{ background: inspiredPalette.dark }}
                  variant="contained"
                  onClick={update}
                  sx={{ textTransform: "capitalize" }}
                >
                  Update
                </Button>
                <Button
                  style={{ background: inspiredPalette.darkRed }}
                  variant="contained"
                  onClick={deleteEntry}
                  sx={{ textTransform: "capitalize" }}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button
                style={{ background: inspiredPalette.dark }}
                variant="contained"
                onClick={create}
                sx={{ textTransform: "capitalize" }}
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
