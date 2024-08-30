"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  ListSubheader,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

const ApiDropDown = ({
  label,
  displayFieldKey,
  valueFieldKey,
  onApi,
  helperText,
  onSelection,
  defaultSelectionIndex = 0,
}: {
  label: string;
  displayFieldKey: string;
  valueFieldKey: string | null;
  onApi: (searchValue: string) => Promise<any[]>,
  helperText: string | null;
  defaultSelectionIndex?: number;
  onSelection: (selected: any) => void;
  onSearchUpdate?: (value: string) => void;
  useSearch?: boolean;
}) => {
  const [value, setValue] = useState({});
  const [dropDownValues, setDropDownValues] = useState<JSX.Element[]>([]);
  let searchText = useRef("");

  useEffect(() => {
    loadData()
  }, []);

  const loadData = async () => {
    let selectionValues:any[] = await onApi(searchText.current);
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
      setValue(selectionValues[defaultSelectionIndex]);
    }
    setDropDownValues(entries);
  };

  return (
    // <FormControl className="w-full md:w-[30vw] mt-4 md:mt-0">
    <FormControl className="w-full mt-4 md:mt-0">
      <InputLabel>{label}</InputLabel>
      <Select
        className="w-full"
        value={value}
        label={label}
        onChange={(event) => {
          let selectedValue = event.target.value;
          setValue(selectedValue);
          onSelection(selectedValue);
        }}
      >
        {(
          <ListSubheader>
            <TextField
            defaultValue={searchText.current}
              size="small"
              // Autofocus on textfield
              autoFocus
              placeholder="Search..."
              fullWidth
              onChange={(e) => {
                searchText.current = e.target.value;
                loadData();
              }}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
            />
          </ListSubheader>
        )}
        {dropDownValues}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export { ApiDropDown };
