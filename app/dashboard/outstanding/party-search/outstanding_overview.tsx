"use client";

import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { DropDown } from "@/app/ui/drop_down";
import { Box, Stack, Switch, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const OutstandingOverview = ({ onChange }: { onChange: () => void }) => {
  const [agingData, setAgingData] = useState([]);
  const [refresh, triggerRefresh] = useState(false);
  const [types, updateTypes] = useState([
    { id: 1, label: "Receivable", code: "receivable" },
    { id: 2, label: "Payable", code: "payable" },
  ]);

  useEffect(() => {
    loadAgingData();
  }, []);

  const selectedAging = useRef("all");
  const selectedType = useRef("payable");

  const loadAgingData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings`;
      let response = await getAsync(url);

      if (response && response.length > 0) {
        let values: any = [{ title: "All", code: "all" }];
        response.map((_data: any) => {
          values.push({
            title: _data.title,
            code: _data.agingCode,
          });
        });
        setAgingData(values);
      }
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  return (
    <Stack flexDirection="column" gap={1.8}>
      <DropDown
        label="Select Type"
        displayFieldKey={"label"}
        valueFieldKey={null}
        selectionValues={types}
        helperText={""}
        onSelection={(selection) => {
          localStorage.setItem("os_bill_type", selection.code);
          onChange();
        }}
      />
      <DropDown
        label={"Aging Code"}
        displayFieldKey={"title"}
        valueFieldKey={null}
        selectionValues={agingData}
        helperText={""}
        onSelection={(_data) => {
          selectedAging.current = _data?.code;
          localStorage.setItem("os_aging_type", _data?.code);
          onChange();
        }}
      />
    </Stack>
  );
};

export default OutstandingOverview;
