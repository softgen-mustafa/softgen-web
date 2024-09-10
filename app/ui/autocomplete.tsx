"use client";

import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface AutoCompleteProps {
  label: string;
  displayFieldKey: string;
  onApi: (searchValue: string) => Promise<any[]>;
}

const ApiAutoComplete = ({
  label,
  onApi,
  displayFieldKey,
}: AutoCompleteProps) => {
  const [options, setOptions] = useState<any[]>([]);
  const searchText = useRef("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let values: any[] = await onApi(searchText.current);
    let entries = values.map((value) => console.log(value));
    setOptions(entries);
  };

  return (
    <div>
      <Autocomplete
        disableClearable
        options={options.map((option) => console.log(option))}
        renderInput={(params: any) => (
          <TextField
            {...params}
            label={label}
            slotProps={{
              input: {
                ...params.InputProps,
                type: "search",
              },
            }}
          />
        )}
      />
    </div>
  );
};

export default ApiAutoComplete;
