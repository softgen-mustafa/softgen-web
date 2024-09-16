"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  ListSubheader,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

const DropDown = ({
  label,
  displayFieldKey,
  valueFieldKey,
  selectionValues,
  helperText,
  onSelection,
  defaultSelectionIndex = 0,
  useSearch,
  onSearchUpdate,
  useFullWidth = true,
}: {
  label: string;
  displayFieldKey: string;
  valueFieldKey: string | null;
  selectionValues: any[];
  helperText: string | null;
  defaultSelectionIndex?: number;
  onSelection: (selected: any) => void;
  onSearchUpdate?: (value: string) => void;
  useSearch?: boolean;
  useFullWidth?: boolean;
}) => {
  const [value, setValue] = useState({});
  const [dropDownValues, setDropDownValues] = useState<JSX.Element[]>([]);
  let searchText = useRef("");

  useEffect(() => {
    loadData();
  }, [selectionValues]);

  const loadData = () => {
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

  const onSearch = () => {
     if (onSearchUpdate) {
        onSearchUpdate(searchText.current);
        return;
     }
    if (!searchText.current || searchText.current.length < 1) {
      loadData();
      return;
    }

    const searchedValues = selectionValues.filter((entry, index) =>
      entry[displayFieldKey]
        .toLowerCase()
        .includes(searchText.current.toLowerCase())
    );
    const remaining = selectionValues.filter(
      (entry, index) =>
        !entry[displayFieldKey]
          .toLowerCase()
          .includes(searchText.current.toLowerCase())
    );

    let newValues = [...searchedValues, ...remaining];
    let searchedItems = newValues.map((entry, index) => {
      return (
        <MenuItem
          key={index}
          value={valueFieldKey == null ? entry : entry[valueFieldKey!]}
        >
          {entry[displayFieldKey]}
        </MenuItem>
      );
    });
    if (searchedItems && searchedItems.length > 0) {
      setValue(searchedItems[0]);
    }
    setDropDownValues(searchedItems);
  };

  return (
    // <FormControl className="w-full md:w-[30vw] mt-4 md:mt-0">
    <FormControl className={`${useFullWidth ? "w-full" :"" } mt-4 md:mt-0`}>
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
        {useSearch && (
          <ListSubheader>
            <TextField
              size="small"
              // Autofocus on textfield
              autoFocus
              placeholder="Search..."
              fullWidth
              onChange={(e) => {
                searchText.current = e.target.value;
                onSearch();
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

export { DropDown };
