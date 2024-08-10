"use-client";

import { useEffect, useState } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { TextInput } from "@/app/ui/text_inputs";
import {
  getAsync,
  getBmrmBaseUrl,
  postAsync,
} from "@/app/services/rest_services";

const MovementConfig = () => {
  const [data, setData] = useState({
    textInput1: "",
    textInput2: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCompanyConfig();
  }, []);

  const fetchCompanyConfig = async () => {
    try {
      setIsLoading(true);
      let url = `${getBmrmBaseUrl()}/company-settings`;
      let response = await getAsync(url);
      setData({
        textInput1: response.movement_period_in_days,
        textInput2: response.inventory_rotation_in_days,
      });
    } catch (error) {
      console.log("Something went wrong...");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompanyConfig = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/company-settings/update`;
      let requestBody = {
        movement_period_in_days: parseInt(data.textInput1),
        inventory_rotation_in_days: parseInt(data.textInput2),
      };

      let response = await postAsync(url, requestBody);
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  return (
    <Stack flexDirection={"column"} gap={1.5}>
      <Stack flexDirection={"row"} gap={1.5}>
        {isLoading && <CircularProgress />}
        {!isLoading && (
          <TextInput
            mode="number"
            defaultValue={data.textInput1}
            placeHolder="Movement Period in days"
            onTextChange={(value: any) =>
              setData({ ...data, textInput1: value })
            }
          />
        )}
        {!isLoading && (
          <TextInput
            mode="number"
            defaultValue={data.textInput2}
            placeHolder="Inventory Rotation in days"
            onTextChange={(value: any) =>
              setData({ ...data, textInput2: value })
            }
          />
        )}
      </Stack>
      <Button
        variant="contained"
        disabled={
          data.textInput1.length == 0 || data.textInput2.length == 0
            ? true
            : false
        }
        onClick={updateCompanyConfig}
      >
        <Typography textTransform={"capitalize"}>Save Config</Typography>
      </Button>
    </Stack>
  );
};

export default MovementConfig;
