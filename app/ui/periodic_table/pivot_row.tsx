import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useRef, useState } from "react";

const PivotRow = ({
  data,
  keys,
  pivotKey = "",
}: {
  data: any[];
  keys: string[];
  pivotKey?: string;
}) => {
  let selectedIndexes = useRef<number[]>([]);

  const [refresh, toggleRefresh] = useState(0);

  const renderPivotRows = (rowIndex: number) => {
    const pivotColumn = data[rowIndex][pivotKey];

    // Check if pivot data is available
    if (
      !selectedIndexes.current.includes(rowIndex) ||
      !pivotColumn ||
      pivotColumn.length < 1
    ) {
      return null;
    }

    // Get keys for the inner pivot rows
    const pivotKeys = Object.keys(pivotColumn[0] || {});

    return (
      <div
        key={`pivot-${rowIndex}`}
        className="w-auto flex-col"
        style={{
          borderWidth: 1,
        }}
      >
        <PivotRow data={pivotColumn} keys={pivotKeys} />
      </div>
    );
  };

  return (
    <Box key={refresh} className="flex flex-row pl-6 overflow-hidden overflow-x-auto" sx={{
      borderBottomWidth: 1,
      borderTopWidth: 1,
    }}>
      <div className="flex flex-col">
      {data.map((row: any, rowIdx: number) => {
        return (
          <div key={rowIdx}>
            <Box className="flex flex-row overflow-x-hidden">
              <div className="flex flex-col" style={{
                borderRightWidth: 1,
              }}>
                {rowIdx === 0 && (
                  <div className="bg-gray-200 min-h-[40px] max-h-[40px]">
                  <IconButton className=""
                    size={"small"}
                    onClick={() => {
                      if (selectedIndexes.current.length > 0) {
                        selectedIndexes.current = [];
                      }
                      toggleRefresh(refresh === 1 ? 0 : 1);
                    }}
                  >
                    {selectedIndexes.current.length > 0 ? (
                      <ArrowUpward />
                    ) : (
                      <ArrowDownward />
                    )}
                  </IconButton>
                  </div>
                )}
                <IconButton
                    size={"small"}
                  sx={{
                  }}
                  onClick={() => {
                    if (selectedIndexes.current.includes(rowIdx)) {
                      selectedIndexes.current = selectedIndexes.current.filter(
                        (i) => i !== rowIdx
                      );
                    } else {
                      selectedIndexes.current.push(rowIdx);
                    }
                    toggleRefresh(refresh === 1 ? 0 : 1);
                  }}
                >
                  {selectedIndexes.current.includes(rowIdx) ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  )}
                </IconButton>
              </div>
              {keys
                .filter((entry) => entry != pivotKey)
                .map((column: string, index: number) => {
                  const value = row[column];
                  return (
                    <div className="flex flex-col" style={{
                      borderRightWidth: 1,
                    }}>
                      {rowIdx === 0 && (
                        <Box
                          className="w-full flex p-2 bg-gray-200 min-h-[40px] max-h-[40px]"
                          key={index}
                          sx={{
                            minWidth: 200,
                            maxWidth: 200,
                            borderRightWidth: index === keys.length - 1 ? 0 : 2,
                            overflowX: "auto",
                          }}
                        >
                          <Typography className="overflow-x-auto">
                            {column}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        key={index}
                        className="w-full flex p-2"
                        sx={{
                          minWidth: 200,
                          maxWidth: 200,
                          borderRightWidth: index === keys.length - 1 ? 0 : 2,
                          overflowX: "auto",
                        }}
                      >
                        <Typography className="overflow-x-auto">
                          {value}
                        </Typography>
                      </Box>
                    </div>
                  );
                })}
            </Box>
            {/* Render the pivot rows if the row is selected */}
            {selectedIndexes.current.includes(rowIdx) &&
              pivotKey &&
              pivotKey.length > 0 &&
              renderPivotRows(rowIdx)}
          </div>
        );
      })}
</div>
    </Box>
  );
};

export { PivotRow };
