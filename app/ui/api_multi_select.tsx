"use client";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  ListSubheader,
  TextField,
  Checkbox,
  ListItemText,
  Chip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

const ApiMultiDropDown = ({
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
  onApi: (searchValue: string) => Promise<any[]>;
  helperText: string | null;
  defaultSelectionIndex?: number;
  onSelection: (selected: any) => void;
  onSearchUpdate?: (value: string) => void;
  useSearch?: boolean;
}) => {
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  const [dropDownValues, setDropDownValues] = useState<JSX.Element[]>([]);
  let searchText = useRef("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let selectionValues: any[] = await onApi(searchText.current);
    let entries = selectionValues.map((entry, index) => {
      return (
        <MenuItem
          key={index}
          value={valueFieldKey == null ? entry : entry[valueFieldKey!]}
        >
          <Checkbox checked={selectedValues.indexOf(entry) > -1} />

          <ListItemText primary={entry[displayFieldKey]} />
        </MenuItem>
      );
    });
    if (
      selectionValues &&
      selectionValues.length > 0 &&
      selectedValues.length === 0
    ) {
      setSelectedValues([selectionValues[defaultSelectionIndex]]);
    }
    setDropDownValues(entries);
  };

  const handleChange = (event: any) => {
    const value = event.target.value as any[];
    setSelectedValues(value);
    onSelection(value);
  };

  return (
    <FormControl className="w-full mt-4 md:mt-0">
      <InputLabel>{label}</InputLabel>
      <Select
        className="w-full"
        multiple
        value={selectedValues}
        label={label}
        onChange={handleChange}
        renderValue={(selected) => (
          <div className="flex flex-wrap gap-1">
            {selected.map((value) => (
              <Chip
                key={valueFieldKey !== null ? value[valueFieldKey] : value}
                label={value[displayFieldKey]}
                size="small"
                className="m-1"
              />
            ))}
          </div>
        )}
      >
        <ListSubheader>
          <TextField
            defaultValue={searchText.current}
            size="small"
            autoFocus
            placeholder="Search..."
            fullWidth
            onChange={(e) => {
              searchText.current = e.target.value;
              loadData();
            }}
            onKeyDown={(e) => {
              if (e.key !== "Escape") {
                e.stopPropagation();
              }
            }}
          />
        </ListSubheader>
        {dropDownValues}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export { ApiMultiDropDown };
