"use client";

import { TextField } from "@mui/material";

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

export { TextInput };
