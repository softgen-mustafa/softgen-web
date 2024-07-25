"use client";

import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
const SearchInput = ({
  placeHolder,
  onTextChange,
}: {
  placeHolder: string;
  onTextChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-row w-full">
      <TextField
        label={placeHolder}
        variant="outlined"
        type={"text"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search/>
            </InputAdornment>
          )
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
}: {
  mode: string;
  placeHolder: string;
  onTextChange: (value: string) => void;
}) => {
  return (
    <div>
      <TextField
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
