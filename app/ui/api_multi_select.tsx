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
  const [dropDownValues, setDropDownValues] = useState<any[]>([]);
  let searchText = useRef("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let selectionValues: any[] = await onApi(searchText.current);
    setDropDownValues(selectionValues);
    if (
      selectionValues &&
      selectionValues.length > 0 &&
      selectedValues.length === 0
    ) {
      setSelectedValues([selectionValues[defaultSelectionIndex]]);
    }
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
        {dropDownValues.map((entry, index) => (
          <MenuItem
            key={index}
            value={valueFieldKey == null ? entry : entry[valueFieldKey!]}
          >
            <Checkbox
              checked={selectedValues.some(
                (item) =>
                  (valueFieldKey == null ? item : item[valueFieldKey!]) ===
                  (valueFieldKey == null ? entry : entry[valueFieldKey!])
              )}
            />
            <ListItemText primary={entry[displayFieldKey]} />
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export { ApiMultiDropDown };
