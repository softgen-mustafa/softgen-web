"use client";

import { Stack, Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface AutoCompleteProps {
reload: boolean;
  label: string;
  displayFieldKey: string;
  onApi: (searchValue: string) => Promise<any[]>;
  onSelection: (selected?: any, value?: any) => void;
}

const ApiAutoComplete = ({
reload,
  label,
  onApi,
  displayFieldKey,
  onSelection,
}: AutoCompleteProps) => {
  const [options, setOptions] = useState<any[]>([]);
  const [text, newText] = useState("");
  const searchText = useRef("");

  useEffect(() => {
    loadData();
  }, [reload]);

  const loadData = async () => {
    let values: any[] = await onApi(searchText.current || "");
    setOptions(values);
  };


  return (
    <Stack spacing={2} sx={{ }}>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        onChange={(event, value) => {
            let selectedOption = options.find((entry: any) => entry[displayFieldKey] === value)
            onSelection(selectedOption, value); // Update the input value state
        }}
        onInputChange={(event, value) => {
            onSelection(null, value); // Update the input value state
        }}
        options={options.map((option) => option[displayFieldKey])}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Stack>
  );
};

export default ApiAutoComplete;
