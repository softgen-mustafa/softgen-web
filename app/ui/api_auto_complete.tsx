"use client";

import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface AutoCompleteProps {
  label: string;
  displayFieldKey: string;
  onApi: (searchValue: string) => Promise<any[]>;
  onSelection: (selected: any) => void;
}

const ApiAutoComplete = ({
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
  }, []);

  const loadData = async () => {
    let values: any[] = await onApi(searchText.current);
    setOptions(values);
  };

  const handleInputChange = (
    event: React.ChangeEvent<{}>,
    newValue: string
  ) => {
    onSelection(newValue); // Update the input value state
    searchText.current = newValue; // Update search text reference
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    let updatedText = "";
    if (typeof newValue === "string") {
      updatedText = newValue;
    } else if (newValue && newValue.inputValue) {
      updatedText = newValue.inputValue;
    } else {
      updatedText = newValue?.name || "";
    }
    onSelection(updatedText);
    newText(updatedText);
  };

  return (
    <div>
      <Autocomplete
        disableClearable
        options={options}
        freeSolo
        getOptionLabel={(option: any) => option[displayFieldKey] || text}
        onInputChange={handleInputChange}
        onChange={handleChange}
        renderInput={(params: any) => <TextField {...params} label={label} />}
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
      />
    </div>
  );
};

export default ApiAutoComplete;
