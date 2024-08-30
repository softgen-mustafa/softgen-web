"use client";

import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
const SearchInput = ({
  placeHolder,
  onTextChange,
}: {
  placeHolder: string;
  onTextChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-row w-full ">
      <TextField
        label={placeHolder}
        variant="outlined"
        type={"text"}
        sx={{
          flex: 1,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          ),
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          let updatedValue = event.target.value;
          onTextChange(updatedValue);
        }}
      />
    </div>
  );
};

const TextInput = ({
  mode,
  placeHolder,
  onTextChange,
  defaultValue,
  multiline = false
}: {
  mode: string;
  placeHolder: string;
  onTextChange: (value: string) => void;
  defaultValue?: string;
  multiline?: boolean;
}) => {
  const [value, setValue] = useState<any | null>(null);
  useEffect(() => {
    if (defaultValue != null) {
      setValue(mode == "number" ? parseInt(defaultValue) : defaultValue);
    }
  }, [defaultValue]);
  return (
    <div>
      <TextField
      multiline={multiline}
        value={value}
        label={placeHolder}
        variant="outlined"
        type={mode}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          let updatedValue = event.target.value;
          onTextChange(updatedValue);
        }}
      />
    </div>
  );
};

export { TextInput, SearchInput };
