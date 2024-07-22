"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";

const DropDown = ({
  label,
  displayFieldKey,
  valueFieldKey,
  selectionValues,
  helperText,
  onSelection
}: {
  label: string;
  displayFieldKey: string;
  valueFieldKey: string | null;
  selectionValues: any[];
  helperText: string | null; 
  onSelection: (selected: any) => void
}) => {
  const [value, setValue] = useState({});
  

  const [dropDownValues, setDropDownValues] = useState<JSX.Element[]>([]);

  useEffect(() => {
    let entries = selectionValues.map((entry, index) => {
      return (
        <MenuItem
          key={index}
          value={valueFieldKey == null ? entry : entry[valueFieldKey!]}
        >
          {entry[displayFieldKey]}
        </MenuItem>
      );
    });
    if (selectionValues && selectionValues.length > 0) {
      setValue(selectionValues[0]);
    }
    setDropDownValues(entries);
  }, [selectionValues]);

  return (
    <FormControl className="m-4">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(event) => {
          let selectedValue = event.target.value;
          setValue(selectedValue);
          onSelection(selectedValue);
        }}
      >
        {dropDownValues}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export { DropDown };
